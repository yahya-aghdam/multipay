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
        block: "https://api.etherscan.io/v2/api",
        // Number of network confirmations required for Ethereum transactions
        networkConfirmationNumber: 1
    }
}

// Exporting a default action object with default values for amount, block number, and confirmation status
export const noAction = {
    "amount": "0",
    "blockNumber": 0,
    "isConfirmed": false
}