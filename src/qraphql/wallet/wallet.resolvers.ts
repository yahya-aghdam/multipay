
import { DB } from "../../db/mikro_orm";
import { WalletService } from "./wallet.service";

export const walletResolvers = {
    Query: {
        wallets: async (_: any, __: any, { db }: { db: DB }) => {
            return await WalletService.getAllWallets(db);
        },
        walletBy: async (_: any, { address, coin }: any, { db }: { db: DB }) => {
            return await WalletService.getWalletBy(db, address, coin);
        },
    },
};
