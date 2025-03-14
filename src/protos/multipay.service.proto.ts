import { ServerUnaryCall, sendUnaryData, status } from "@grpc/grpc-js";
import { CreatePaymentRequest, CreatePaymentResult, VerifyPaymentRequest, VerifyPaymentResult } from "./multipay";
import { DB } from "../db/mikro_orm";
import { Payment, Wallets } from '../db/entity';
import { expirationTimeStr, nowUnixStr } from "../lib";
import { randomUUID } from "crypto";
import Wallet, { CoinTypeLocal } from "../lib/wallet";
import { WALLET_STRENGTH } from "../config/dotenv";
import Balance from "../lib/balance";


const db = new DB();
const balance = new Balance();

// Auth service for gRPC
export async function createPayment(
    call: ServerUnaryCall<CreatePaymentRequest, CreatePaymentResult>,
    callback: sendUnaryData<VerifyPaymentResult>
) {
    const createPaymentRequest = call.request
    let createPaymentResult: VerifyPaymentResult

    await db.init().then(async () => {

        const payments = await db.findMany(
            Payment,
            {
                expiration: { $lt: nowUnixStr() },
                coin: createPaymentRequest.coin
            },
            { orderBy: { expiration: "asc" } }
        ) as Payment[]

        if (payments.length != 0) {

            const oldestPayment = payments[0]

            const newPayment = {
                coin: createPaymentRequest.coin,
                amount: createPaymentRequest.amount,
                expiration: expirationTimeStr(),
                paymentId: randomUUID(),
                clientId: createPaymentRequest.clientId,
                address: oldestPayment.address,
                isPaid: false,
                isConfirmed: false,
                time: nowUnixStr()
            }

            await db.createOne(Payment, newPayment).then(() => {
                createPaymentResult = newPayment
            }).catch((err) => {
                console.log(err)
                callback({ code: status.INTERNAL, message: err.message }, null)
            })

        } else {
            const wallet = new Wallet(WALLET_STRENGTH);
            const { mnemonic, address } = await wallet.makeWallet(createPaymentRequest.coin as keyof typeof CoinTypeLocal);

            const newWallet = new Wallets();
            newWallet.address = address;
            newWallet.coin = createPaymentRequest.coin;
            newWallet.mnemonic = mnemonic;

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
                    time: new Date().toISOString()
                }

                await db.createOne(Payment, newPayment).then(() => {
                    createPaymentResult = newPayment
                }).catch((err) => {
                    console.log(err)
                    callback({ code: status.INTERNAL, message: err.message }, null)
                })

            }).catch((err) => {
                console.log(err)
                callback({ code: status.INTERNAL, message: err.message }, null)
            })

        }



        callback(null, createPaymentResult)

    }).catch((err) => {
        throw new err
    })



}
// Auth service for gRPC
export async function verifyPayment(
    call: ServerUnaryCall<VerifyPaymentRequest, VerifyPaymentResult>,
    callback: sendUnaryData<VerifyPaymentResult>
) {
    const verifyPaymentRequest = call.request
    let verifyPaymentResult: VerifyPaymentResult

    await db.init().then(async () => {

        const payment = await db.findOne(Payment, { paymentId: verifyPaymentRequest.paymentId }) as Payment

        if (payment) {
            const verify = await balance.verify(payment)

            verifyPaymentResult = {
                coin: payment.coin,
                amount: payment.amount,
                expiration: payment.expiration,
                paymentId: payment.paymentId,
                clientId: payment.clientId,
                address: payment.address,
                isPaid: payment.isPaid,
                isConfirmed: payment.isConfirmed
            }

            if (verify) {
                const newPayment = payment
                newPayment.isPaid = true

                await db.updateOne(payment, newPayment).then(() => {
                    verifyPaymentResult.isPaid = true;
                }).catch((err) => {
                    console.log(err)
                    callback({ code: status.INTERNAL, message: err.message }, null)
                })
            }



            callback(null, verifyPaymentResult)

        } else {
            callback({ code: status.NOT_FOUND }, null)
        }

    }).catch((err) => {
        throw err
    })

}