
import { DB } from '../../db/mikro_orm';
import { Wallets } from '../../db/entities/wallets';

export const WalletService = {
    getAllWallets: async (db: DB,) => {
        return await db.findMany(Wallets, {}, {});
    },

    getWalletBy: async (db: DB, address: string, coin: string) => {
        const filter: any = {}
        if (address) {
            filter.address = address;
        }
        if (coin) {
            filter.coin = coin;
        }
        return await db.findMany(Wallets, filter, {});
    },
};
