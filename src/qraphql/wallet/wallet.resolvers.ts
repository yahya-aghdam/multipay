/* eslint-disable @typescript-eslint/no-explicit-any */
import { DB } from "../../db/mikro_orm";
import { WalletService } from "./wallet.service";

export const walletResolvers = {
    Query: {
        wallets: async (_: any, __: any, { db }: { db: DB }) => {
            return await WalletService.getAllWallets(db);
        },
        walletByAddress: async (_: any, { address }: { address: string }, { db }: { db: DB }) => {
            return await WalletService.getWalletByAddress(db, address);
        },
    },
    Mutation: {
        createWallet: async (
            _: any,
            { coin }: any,
            { db }: { db: DB }
        ) => {
            return await WalletService.createWallet(db, coin);
        },
    },
};
