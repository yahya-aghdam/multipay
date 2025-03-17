import { initWasm } from "@trustwallet/wallet-core"
import { CoinTypeLocal } from "./utils";


// Defining the Wallet class
export default class Wallet {
    // Defining a public property to hold the strength of the wallet
    public strength: number | string;

    // Constructor to initialize the Wallet class with the given strength
    constructor(strength: number | string) {
        this.strength = strength;
    }

    // Public method to create a wallet for a specific coin type
    public async makeWallet(coinType: keyof typeof CoinTypeLocal): Promise<{ mnemonic: string, address: string }> {
        // Initializing the Trust Wallet Core WebAssembly module
        const core = await initWasm();
        // Destructuring necessary components from the core
        const { HDWallet, CoinType } = core;

        // Creating a new HD wallet with the specified strength
        const wallet = HDWallet.create(+this.strength, "");
        // Getting the mnemonic phrase of the wallet
        const mnemonic = wallet.mnemonic();

        // Creating an address from the public key for the specified coin type
        const address = wallet.getAddressForCoin(CoinType[coinType]);

        // Returning the mnemonic and address
        return {
            mnemonic,
            address: address
        };
    }
}
