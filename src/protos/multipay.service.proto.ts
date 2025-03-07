
import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js";
import { CreatePaymentRequest, CreatePaymentResult, VerifyPaymentRequest, VerifyPaymentResult } from "./multipay";

// Auth service for gRPC
export async function createPayment(
    call: ServerUnaryCall<CreatePaymentRequest, CreatePaymentResult>,
    callback: sendUnaryData<VerifyPaymentResult>
) {
    const tokenRequest = call.request
    let tokenResult: VerifyPaymentResult 



    callback(null, tokenResult)

}
// Auth service for gRPC
export async function verifyPayment(
    call: ServerUnaryCall<VerifyPaymentRequest, VerifyPaymentResult>,
    callback: sendUnaryData<VerifyPaymentResult>
) {
    const tokenRequest = call.request
    let vaerfyResult: VerifyPaymentResult 



    callback(null, vaerfyResult)

}