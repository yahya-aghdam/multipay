import { initWasm } from "@trustwallet/wallet-core"
import { CoinTypeLocal } from "./utils"
import { customCoins } from "../../config/constants"

// Defining the Wallet class
export default class Wallet {
    // Defining a public property to hold the strength of the wallet
    public strength: number | string

    // Constructor to initialize the Wallet class with the given strength
    constructor(strength: number | string) {
        this.strength = strength
    }

    private walletHandlers: Record<string, () => Promise<{ mnemonic: string, address: string }>> = {
        "pactus": this.pactusWallet.bind(this),
    }

    // Client
    public async make(coinType: keyof typeof CoinTypeLocal): Promise<{ mnemonic: string, address: string }> {
        // Check if the coin is a main coin or a custom coin
        if (this.isMainCoin(coinType)) {
            return this.makeMainCoinWallet(coinType)
        } else {
            return this.makeCustomCoinWallet(coinType)
        }
    }


    // Method to check if the coin is a main coin
    private isMainCoin(coinType: keyof typeof CoinTypeLocal): boolean {
        // Define your main coins here
        return !customCoins.includes(coinType)
    }

    // Method to create a wallet for a main coin
    private async makeMainCoinWallet(coinType: keyof typeof CoinTypeLocal): Promise<{ mnemonic: string, address: string }> {
        // Initializing the Trust Wallet Core WebAssembly module
        const core = await initWasm()
        // Destructuring necessary components from the core
        const { HDWallet, CoinType } = core

        // Creating a new HD wallet with the specified strength
        const wallet = HDWallet.create(+this.strength, "")
        // Getting the mnemonic phrase of the wallet
        const mnemonic = wallet.mnemonic()

        // Creating an address from the public key for the specified coinType type
        const address = wallet.getAddressForCoin(CoinType[coinType])

        // Returning the mnemonic and address
        return {
            mnemonic,
            address: address
        }
    }

    // Method to create a wallet for a custom coin
    private async makeCustomCoinWallet(coinType: keyof typeof CoinTypeLocal): Promise<{ mnemonic: string, address: string }> {
        return await this.walletHandlers[coinType]()
    }

    // Method to create a wallet for a custom coin
    private async pactusWallet(): Promise<{ mnemonic: string, address: string }> {
        // Initializing the Trust Wallet Core WebAssembly module
        const core = await initWasm()
        const { HDWallet, CoinType, CoinTypeExt } = core
        const wallet = HDWallet.create(+this.strength, "")
        const derivationPath = `m/44'/21888'/3'/0'`
        const privateKey = wallet.getKey(CoinType.pactus, derivationPath)
        const mnemonic = wallet.mnemonic()
        const address = CoinTypeExt.deriveAddress(CoinType.pactus, privateKey)

        return {
            mnemonic: mnemonic,
            address: address,
        }
    }
}
