import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { CreatePaymentRequest, CreatePaymentResult, VerifyPaymentRequest, VerifyPaymentResult } from "./multipay";
import { DB } from "../db/mikro_orm";
import { Payment, Wallets } from '../db/entity';
import { expirationTimeStr, notSupportedCoinsHandler, nowUnixStr } from "../lib";
import { randomUUID } from "crypto";
import Wallet from "../lib/wallet";
import { WALLET_STRENGTH } from "../config/dotenv";
import Balance from "../lib/balance";
import { CoinTypeLocal } from "../lib/wallet/utils";


// Creating an instance of the DB class
const db = new DB();

// Creating an instance of the Balance class
const balance = new Balance();

// Function to create a payment
export async function createPayment(
    call: ServerUnaryCall<CreatePaymentRequest, CreatePaymentResult>,
    callback: sendUnaryData<VerifyPaymentResult>
) {
    // Extracting the request from the call
    const createPaymentRequest = call.request;
    let createPaymentResult: VerifyPaymentResult;

    const { valid, coin } = notSupportedCoinsHandler(createPaymentRequest.coin)

    if (valid) {
        // Handle not supported coins
        createPaymentRequest.coin = coin

        // Initializing the database
        await db.init().then(async () => {
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
                const { mnemonic, address } = await wallet.makeWallet(createPaymentRequest.coin as keyof typeof CoinTypeLocal);

                const newWallet = new Wallets();
                newWallet.address = address;
                newWallet.coin = createPaymentRequest.coin;
                newWallet.mnemonic = mnemonic;

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

        }).catch((err) => {
            throw err;
        });
    } else {
        callback({ code: status.INVALID_ARGUMENT, message: `${coin} is not supported` }, null);
    }
}

// Function to verify a payment
export async function verifyPayment(
    call: ServerUnaryCall<VerifyPaymentRequest, VerifyPaymentResult>,
    callback: sendUnaryData<VerifyPaymentResult>
) {
    // Extracting the request from the call
    const verifyPaymentRequest = call.request;
    let verifyPaymentResult: VerifyPaymentResult;

    // Initializing the database
    await db.init().then(async () => {
        // Finding the payment by paymentId
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
                    }
                }
            }

            // Sending the result back to the client
            callback(null, verifyPaymentResult);

        } else {
            // If the payment is not found, send a NOT_FOUND status
            callback({ code: status.NOT_FOUND }, null);
        }

    }).catch((err) => {
        throw err;
    });
}