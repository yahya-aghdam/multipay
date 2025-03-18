import linksmith from "linksmith";
import { PROTO_PORT, PROTO_URL } from "./dotenv";

// Constructing the proto_url by combining PROTO_URL and PROTO_PORT using linksmith
export const proto_url = linksmith(PROTO_URL, { port: PROTO_PORT });

// Defining a constant for the default database name
export const dbDefualtName = "multipay";

export const allowedCoins = ["ethereum", "tron", "smartchain", "usdt_trc20", "usdt_bep20", "pactus"];

export const customCoins = ["pactus"];

export const tokenList: { [key: string]: { [key: string]: string } } = {
    "smartchain": {
        "usdt_bep20": "0x55d398326f99059fF775485246999027B3197955",
    },
    "tron": {
        "usdt_trc20": "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
    }
}

export const notSupportedCoins: { [key: string]: string } = {
    "smartchain": "ethereum",
    "usdt_trc20": "tron",
    "usdt_bep20": "ethereum",
}

// Exporting an object containing data related to different cryptocurrencies
export const coinData = {
    // Data related to Tron
    tron: {
        // API endpoint for Tron accounts
        accounts: "https://api.trongrid.io/v1/accounts",
        // API endpoint for getting the current block on the Tron blockchain
        block: "https://api.trongrid.io/walletsolidity/getnowblock",
        // Number of network confirmations required for Tron transactions
        networkConfirmationNumber: 20
    },
    // Data related to Ethereum
    ethereum: {
        // API endpoint for Ethereum accounts
        accounts: "https://api.etherscan.io/v2/api",
        // API endpoint for getting the current block on the Ethereum blockchain
        block: "https://api.etherscan.io/api",
        // Number of network confirmations required for Ethereum transactions
        networkConfirmationNumber: 1
    },
    // Data related to Binance Smart Chain
    binance: {
        // API endpoint for Binance Smart Chain accounts
        accounts: "https://api.bscscan.com/api",
        // API endpoint for getting the current block on the Binance Smart Chain blockchain
        block: "https://api.bscscan.com/api",
        // Number of network confirmations required for Binance Smart Chain transactions
        networkConfirmationNumber: 1
    },
    // Data related to pactus
    pactus: {
        // API endpoint for pactus accounts
        accounts: "https://api.pacviewer.com/v1/accounts",
        // API endpoint for getting the current block on the pactus blockchain
        block: "https://bootstrap1.pactus.org:8080/pactus",
        // Number of network confirmations required for pactus transactions
        networkConfirmationNumber: 3
    },

    tronToken: {
        // API endpoint for Tron accounts
        accounts: "https://api.trongrid.io/v1/accounts",
        // API endpoint for getting the current block on the Tron blockchain
        block: "https://api.trongrid.io/walletsolidity/getnowblock",
        // 60seconds
        networkConfirmationNumber: 60000
    }
}

// Exporting a default action object with default values for amount, block number, and confirmation status
export const balanceNoAction = {
    "verify": false,
    "blockNumber": 0,
    "isConfirmed": false
}

