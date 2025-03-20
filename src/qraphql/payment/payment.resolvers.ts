/* eslint-disable @typescript-eslint/no-explicit-any */
import { DB } from "../../db/mikro_orm";
import { PaymentService } from "./payment.service";

export const paymentResolvers = {
    Query: {
        payments: async (_: any, __: any, { db }: { db: DB }) => {
            return await PaymentService.getAllPayments(db);
        },
        paymentById: async (_: any, { paymentId }: { paymentId: string }, { db }: { db: DB }) => {
            return await PaymentService.getPaymentById(db, paymentId);
        },
    },
    Mutation: {
        createPayment: async (
            _: any,
            {  coin, amount, clientId,}: any,
            { db }: { db: DB }
        ) => {
            return await PaymentService.createPayment(db,  coin, amount, clientId);
        },
    },
};
