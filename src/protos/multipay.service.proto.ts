/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { CreatePaymentRequest, CreatePaymentResult, VerifyPaymentRequest, VerifyPaymentResult } from "./multipay";

// Auth service for gRPC
export async function createPayment(
    call: ServerUnaryCall<CreatePaymentRequest, CreatePaymentResult>,
    callback: sendUnaryData<VerifyPaymentResult>
) {
    const createPaymentRequest = call.request
    let createPaymentResult: VerifyPaymentResult

    createPaymentResult = {
        coin: "etherum",
        amount: "10",
        expiration: "10",
        paymentId: "1234",
        clientId: "1234",
        address: "0x1234",
        isPaid: false,
        isConfirmed: false
    }


    callback(null, createPaymentResult)

}
// Auth service for gRPC
export async function verifyPayment(
    call: ServerUnaryCall<VerifyPaymentRequest, VerifyPaymentResult>,
    callback: sendUnaryData<VerifyPaymentResult>
) {
    const verifyPaymentRequest = call.request
    let verifyPaymentResult: VerifyPaymentResult

    verifyPaymentResult = {
        coin: "etherum",
        amount: "10",
        expiration: "10",
        paymentId: "1234",
        clientId: "1234",
        address: "0x1234",
        isPaid: false,
        isConfirmed: false
    }


    callback(null, verifyPaymentResult)

}