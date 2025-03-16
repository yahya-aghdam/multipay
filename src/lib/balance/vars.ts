
export const coinData = {
    tron: {
        accounts: "https://api.trongrid.io/v1/accounts",
        block: "https://api.trongrid.io/walletsolidity/getnowblock",
        networkConfirmationNumber: 20
    },
    ethereum: {
        accounts: "https://api.etherscan.io/v2/api",
        block: "https://api.etherscan.io/v2/api",
        networkConfirmationNumber: 1
    }

}

export const noAction = { "amount": "0", "blockNumber": 0, "isConfirmed": false }