export interface Payment {
    _id: string;
    paymentId: string;
    coin: string;
    amount: string;
    expiration: string;
    clientId: string;
    address: string;
    isPaid: boolean;
    blockNumber: number;
    isConfirmed: boolean;
    time: string;
}

export interface Payment_CreatePaymentOutput {
    paymentId: string;
    coin: string;
    amount: string;
    expiration: string;
    clientId: string;
    address: string;
    time: string;
}

export interface Payment_VerifyPaymentOutput {
    coin: string;
    amount: string;
    expiration: string;
    paymentId: string;
    clientId: string;
    address: string;
    isPaid: boolean;
    isConfirmed: boolean;
}