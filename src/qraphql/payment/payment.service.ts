import { randomUUID } from "crypto";
import { WALLET_STRENGTH } from "../../config/dotenv";
import { Payment } from "../../db/entities/payments";
import { Wallets } from "../../db/entities/wallets";
import { DB } from "../../db/mikro_orm";
import { notSupportedCoinsHandler, nowUnixStr, expirationTimeStr } from "../../lib";
import Wallet from "../../lib/wallet";
import { CoinTypeLocal } from "../../lib/wallet/utils";
import { Payment_CreatePaymentOutput, Payment_VerifyPaymentOutput } from "./interfaces";
import Balance from "../../lib/balance";

// Creating an instance of the Balance class
const balance = new Balance();

export const PaymentService = {
    getAllPayments: async (db: DB) => {
        return await db.findMany(Payment, {}, {});
    },

    getPaymentById: async (db: DB, paymentId: string) => {
        return await db.findOne(Payment, { paymentId });
    },

    createPayment: async (
        db: DB,
        coin: string,
        amount: string,
        clientId: string,
    ) => {
        let createPaymentOutput: Payment_CreatePaymentOutput = {} as Payment_CreatePaymentOutput;

        const notSupportedCoins = notSupportedCoinsHandler(coin)

        if (notSupportedCoins.valid) {
            // Finding expired payments for the specified coin
            const payments = await db.findMany(
                Payment,
                {
                    expiration: { $lt: nowUnixStr() },
                    coin: coin
                },
                { orderBy: { expiration: "asc" } }
            ) as Payment[];

            // If there are expired payments, reuse the oldest one
            if (payments.length != 0) {
                const oldestPayment = payments[0];

                const newPayment = {
                    coin: coin,
                    amount: amount,
                    expiration: expirationTimeStr(),
                    paymentId: randomUUID(),
                    clientId: clientId,
                    address: oldestPayment.address,
                    isPaid: false,
                    isConfirmed: false,
                    time: nowUnixStr(),
                    blockNumber: 0
                };

                // Creating the new payment in the database
                await db.createOne(Payment, newPayment).then(() => {
                    createPaymentOutput = newPayment;
                }).catch((err) => {
                    console.log(err);
                    throw new Error(err.message);
                });

            } else {
                // If there are no expired payments, create a new wallet and payment
                const wallet = new Wallet(WALLET_STRENGTH);
                const { mnemonic, address } = await wallet.make(coin as keyof typeof CoinTypeLocal);

                const newWallet = new Wallets();
                newWallet.address = address;
                newWallet.coin = coin;
                newWallet.mnemonic = mnemonic;
                newWallet.amount = "0"

                // Creating the new wallet in the database
                await db.createOne(Wallets, newWallet).then(async () => {
                    const newPayment = {
                        coin: coin,
                        amount: amount,
                        expiration: expirationTimeStr(),
                        paymentId: randomUUID(),
                        clientId: clientId,
                        address: address,
                        isPaid: false,
                        isConfirmed: false,
                        blockNumber: 0,
                        time: nowUnixStr()
                    };

                    // Creating the new payment in the database
                    await db.createOne(Payment, newPayment).then(() => {
                        createPaymentOutput = newPayment;
                    }).catch((err) => {
                        console.log(err);
                        throw new Error(err.message);
                    });

                }).catch((err) => {
                    console.log(err);
                    throw new Error(err.message);
                });
            }

            // Sending the Output back to the client
            return createPaymentOutput


        } else {
            throw new Error(`${coin} is not supported`);
        }
    },

    verifyPayment: async (db: DB, paymentId: string) => {
        // Extracting the request from the call
        let verifyPaymentOutput: Payment_VerifyPaymentOutput = {} as Payment_VerifyPaymentOutput;


        const payment = await db.findOne(Payment, { paymentId: paymentId }) as Payment;

        if (payment) {
            verifyPaymentOutput = {
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
                        verifyPaymentOutput.isPaid = true;
                    }).catch((err) => {
                        console.log(err);
                        throw new Error(err.message);
                    });
                }

                if (!payment.isConfirmed && verify) {
                    const newPayment = payment;
                    if (isConfirmed) {
                        newPayment.isConfirmed = isConfirmed;
                        // Updating the payment in the database
                        await db.updateOne(payment, newPayment).then(() => {
                            verifyPaymentOutput.isConfirmed = isConfirmed;
                        }).catch((err) => {
                            console.log(err);
                            throw new Error(err.message);
                        });


                        const wallet = await db.findOne(Wallets, { address: payment.address }) as Wallets;
                        const newWallet = wallet;
                        newWallet.amount = (+wallet.amount + +payment.amount).toString();
                        // Updating the wallet in the database
                        await db.updateOne(wallet, newWallet).then(() => {
                            verifyPaymentOutput.amount = newWallet.amount;
                        }).catch((err) => {
                            console.log(err);
                            throw new Error(err.message);
                        });

                    }
                }
            }

            // Sending the Output back to the client
            return verifyPaymentOutput

        } else {
            // If the payment is not found, send a NOT_FOUND status
            throw new Error("Payment not found");
        }

    }
};
