import { DB } from '../../db/mikro_orm';
import { Wallets } from '../../db/entities/wallets';
import Wallet from '../../lib/wallet';
import { WALLET_STRENGTH } from '../../config/dotenv';
import { CoinTypeLocal } from '../../lib/wallet/utils';

export const WalletService = {
    getAllWallets: async (db: DB,) => {
        return await db.findMany(Wallets, {}, {});
    },

    getWalletByAddress: async (db: DB, address: string) => {
        return await db.findOne(Wallets, { address });
    },

    createWallet: async (
        db: DB,
        coin: string,
    ) => {
        const wallet = new Wallet(WALLET_STRENGTH);
        const { mnemonic, address } = await wallet.make(coin as keyof typeof CoinTypeLocal);
        const newWallet = {
            address,
            mnemonic,
            coin,
            amount: '0',
        };
        await db.createOne(Wallets, newWallet);
        return wallet;
    },
};
