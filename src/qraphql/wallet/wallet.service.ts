import { DB } from '../../db/mikro_orm';
import { Wallets } from '../../db/entities/wallets';

export const WalletService = {
    getAllWallets: async (db: DB,) => {
        return await db.findMany(Wallets, {}, {});
    },

    getWalletByAddress: async (db: DB, address: string) => {
        return await db.findOne(Wallets, { address });
    },
};
