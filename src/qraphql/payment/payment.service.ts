import { Payment } from "../../db/entities/payments";
import { DB } from "../../db/mikro_orm";

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
        const payment = new Payment();
        payment.coin = coin;
        payment.amount = amount;
        payment.clientId = clientId;
        payment.isPaid = false; 
        payment.isConfirmed = false; 

        await db.createOne(Payment, payment); 
        return payment;
    },

};
