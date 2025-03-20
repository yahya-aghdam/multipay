import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { CreatePaymentRequest, CreatePaymentResult, VerifyPaymentRequest, VerifyPaymentResult } from "./multipay";
import { DB } from "../db/mikro_orm";
import { expirationTimeStr, notSupportedCoinsHandler, nowUnixStr } from "../lib";
import { randomUUID } from "crypto";
import Wallet from "../lib/wallet";
import { WALLET_STRENGTH } from "../config/dotenv";
import Balance from "../lib/balance";
import { CoinTypeLocal } from "../lib/wallet/utils";
import { Payment } from "../db/entities/payments";
import { Wallets } from "../db/entities/wallets";




// Creating an instance of the Balance class
const balance = new Balance();

// Function to create a payment
export const createPayment = (db: DB) => async (
    call: ServerUnaryCall<CreatePaymentRequest, CreatePaymentResult>,
    callback: sendUnaryData<VerifyPaymentResult>
) => {
    // Extracting the request from the call
    const createPaymentRequest = call.request;
    let createPaymentResult: VerifyPaymentResult = {} as VerifyPaymentResult;

    const { valid, coin } = notSupportedCoinsHandler(createPaymentRequest.coin)

    if (valid) {
        // Finding expired payments for the specified coin
        const payments = await db.findMany(
            Payment,
            {
                expiration: { $lt: nowUnixStr() },
                coin: createPaymentRequest.coin
            },
            { orderBy: { expiration: "asc" } }
        ) as Payment[];

        // If there are expired payments, reuse the oldest one
        if (payments.length != 0) {
            const oldestPayment = payments[0];

            const newPayment = {
                coin: createPaymentRequest.coin,
                amount: createPaymentRequest.amount,
                expiration: expirationTimeStr(),
                paymentId: randomUUID(),
                clientId: createPaymentRequest.clientId,
                address: oldestPayment.address,
                isPaid: false,
                isConfirmed: false,
                time: nowUnixStr(),
                blockNumber: 0
            };

            // Creating the new payment in the database
            await db.createOne(Payment, newPayment).then(() => {
                createPaymentResult = newPayment;
            }).catch((err) => {
                console.log(err);
                callback({ code: status.INTERNAL, message: err.message }, null);
            });

        } else {
            // If there are no expired payments, create a new wallet and payment
            const wallet = new Wallet(WALLET_STRENGTH);
            const { mnemonic, address } = await wallet.make(coin as keyof typeof CoinTypeLocal);

            const newWallet = new Wallets();
            newWallet.address = address;
            newWallet.coin = createPaymentRequest.coin;
            newWallet.mnemonic = mnemonic;
            newWallet.amount = "0"

            // Creating the new wallet in the database
            await db.createOne(Wallets, newWallet).then(async () => {
                const newPayment = {
                    coin: createPaymentRequest.coin,
                    amount: createPaymentRequest.amount,
                    expiration: expirationTimeStr(),
                    paymentId: randomUUID(),
                    clientId: createPaymentRequest.clientId,
                    address: address,
                    isPaid: false,
                    isConfirmed: false,
                    blockNumber: 0,
                    time: nowUnixStr()
                };

                // Creating the new payment in the database
                await db.createOne(Payment, newPayment).then(() => {
                    createPaymentResult = newPayment;
                }).catch((err) => {
                    console.log(err);
                    callback({ code: status.INTERNAL, message: err.message }, null);
                });

            }).catch((err) => {
                console.log(err);
                callback({ code: status.INTERNAL, message: err.message }, null);
            });
        }

        // Sending the result back to the client
        callback(null, createPaymentResult);


    } else {
        callback({ code: status.INVALID_ARGUMENT, message: `${coin} is not supported` }, null);
    }
}

// Function to verify a payment
export const verifyPayment = (db: DB) => async (
    call: ServerUnaryCall<VerifyPaymentRequest, VerifyPaymentResult>,
    callback: sendUnaryData<VerifyPaymentResult>
) => {
    // Extracting the request from the call
    const verifyPaymentRequest = call.request;
    let verifyPaymentResult: VerifyPaymentResult;


    const payment = await db.findOne(Payment, { paymentId: verifyPaymentRequest.paymentId }) as Payment;

    if (payment) {
        verifyPaymentResult = {
            coin: payment.coin,
            amount: payment.amount,
            expiration: payment.expiration,
            paymentId: payment.paymentId,
            clientId: payment.clientId,
            address: payment.address,
            isPaid: payment.isPaid,
            isConfirmed: payment.isConfirmed,
        };

        // If the payment is not paid or confirmed, verify it
        if (!(payment.isPaid && payment.isConfirmed)) {
            const { verify, blockNumber, isConfirmed } = await balance.verify(payment);

            if (!payment.isPaid && verify) {
                const newPayment = payment;
                newPayment.isPaid = true;
                newPayment.blockNumber = blockNumber;

                // Updating the payment in the database
                await db.updateOne(payment, newPayment).then(() => {
                    verifyPaymentResult.isPaid = true;
                }).catch((err) => {
                    console.log(err);
                    callback({ code: status.INTERNAL, message: err.message }, null);
                });
            }

            if (!payment.isConfirmed && verify) {
                const newPayment = payment;
                if (isConfirmed) {
                    newPayment.isConfirmed = isConfirmed;
                    // Updating the payment in the database
                    await db.updateOne(payment, newPayment).then(() => {
                        verifyPaymentResult.isConfirmed = isConfirmed;
                    }).catch((err) => {
                        console.log(err);
                        callback({ code: status.INTERNAL, message: err.message }, null);
                    });


                    const wallet = await db.findOne(Wallets, { address: payment.address }) as Wallets;
                    const newWallet = wallet;
                    newWallet.amount = (+wallet.amount + +payment.amount).toString();
                    // Updating the wallet in the database
                    await db.updateOne(wallet, newWallet).then(() => {
                        verifyPaymentResult.amount = newWallet.amount;
                    }).catch((err) => {
                        console.log(err);
                        callback({ code: status.INTERNAL, message: err.message }, null);
                    });

                }
            }
        }

        // Sending the result back to the client
        callback(null, verifyPaymentResult);

    } else {
        // If the payment is not found, send a NOT_FOUND status
        callback({ code: status.NOT_FOUND }, null);
    }

}

