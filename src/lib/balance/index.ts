/* eslint-disable @typescript-eslint/no-explicit-any */

import { dataKeyHandler } from ".."
import { balanceNoAction, coinData } from "../../config/constants"
import { Payment } from "../../db/entities/payments"
import { getLastTransactionsBinanceSmartChain, filterBinanceSmartChainTransactions, getLastBlockNumberBinanceSmartChain } from "./coin/binance"
import { getLastTransactionsEthereum, filterEthereumTransactions, weiAmountToNormal, getLastBlockNumberEthereum } from "./coin/ethereum"
import { getLastTransactionsPactus, filterPactusTransactions, pactusAmountToNormal, getLastBlockNumberPactus } from "./coin/pactus"
import { getLast5TransactionsTron, filterTronTransactions, sunAmountToNormal, getLastBlockNumberTron } from "./coin/tron"
import { getLastTransactionsBinanceSmartChainTokens, filterBinanceSmartChainTokenTransactions, amountToNormalBinanceToken } from "./token/bep_20"
import { getLastTransactionsTronTokens, filterTronTokensTransactions, amountToNormalTronToken } from "./token/trc_20"


export default class Balance {

    private coinHandlers: Record<string, (payment: Payment) => Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }>> = {
        "tron": this.getTronBalance.bind(this),
        "ethereum": this.getEthereumBalance.bind(this),
        "smartchain": this.getBinanceSmartChainBalance.bind(this),
        "pactus": this.getPactusBalance.bind(this),
        "usdt_bep20": this.getBinanceSmartChainTokensBalance.bind(this),
        "usdt_trc20": this.getTronTokenBalance.bind(this),
    }

    // Client
    public async verify(payment: Payment): Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }> {
        const handler = this.coinHandlers[payment.coin]
        if (handler) {
            return await handler(payment)
        } else {
            return balanceNoAction
        }
    }

    private async getBalance(
        payment: Payment,
        getLastTransactions: (payment: Payment) => Promise<Response>,
        keysOfData: string[],
        filterTransactions: (transactions: any[], payment: Payment) => any[],
        convertAmount: (amount: any) => string,
        getLastBlockNumber: () => Promise<number>,
        networkConfirmationNumber: number,
        extractAmount: (transaction: any) => any,
        extractBlockNumber: (transaction: any) => number,

    ): Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }> {

        const lastTransactions = await getLastTransactions(payment)

        if (lastTransactions.status == 200) {
            const res = await lastTransactions.json()
            const transactions = dataKeyHandler(keysOfData, res)

            const filteredTransactions = filterTransactions(transactions, payment)
            console.log("🚀 ~ Balance ~ filteredTransactions:", filteredTransactions)

            if (filteredTransactions.length > 0) {
                const amount = extractAmount(filteredTransactions[0])
                const blockNumber = extractBlockNumber(filteredTransactions[0])
                const amountToNormal = convertAmount(amount)
                console.log("🚀 ~ Balance ~ amountToNormal:", amountToNormal)

                let verify = false
                if (amountToNormal >= payment.amount) {
                    verify = true
                }

                const lastBlockNumber = await getLastBlockNumber()
                let isConfirmed = false
                if (((payment.blockNumber + networkConfirmationNumber) <= lastBlockNumber) && verify) {
                    isConfirmed = true
                }

                return { verify, blockNumber, isConfirmed }
            } else {
                return balanceNoAction
            }
        } else {
            console.log("Error in getting balance:", lastTransactions)
            return balanceNoAction
        }
    }

    // * Coins
    // Tron
    private async getTronBalance(payment: Payment): Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }> {
        return await this.getBalance(
            payment,
            getLast5TransactionsTron,
            ["data"],
            filterTronTransactions,
            sunAmountToNormal,
            getLastBlockNumberTron,
            coinData.tron.networkConfirmationNumber,
            (transaction) => transaction.raw_data.contract[0].parameter.value.amount,
            (transaction) => transaction.blockNumber
        )
    }

    // Ethereum
    private async getEthereumBalance(payment: Payment): Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }> {
        return await this.getBalance(
            payment,
            getLastTransactionsEthereum,
            ["result"],
            filterEthereumTransactions,
            weiAmountToNormal,
            getLastBlockNumberEthereum,
            coinData.ethereum.networkConfirmationNumber,
            (transaction) => transaction.value,
            (transaction) => transaction.blockNumber
        )
    }

    // Binance
    private async getBinanceSmartChainBalance(payment: Payment): Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }> {
        return await this.getBalance(
            payment,
            getLastTransactionsBinanceSmartChain,
            ["result"],
            filterBinanceSmartChainTransactions,
            weiAmountToNormal,
            getLastBlockNumberBinanceSmartChain,
            coinData.binance.networkConfirmationNumber,
            (transaction) => transaction.value,
            (transaction) => transaction.blockNumber
        )
    }


    // Pactus
    private async getPactusBalance(payment: Payment): Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }> {
        return await this.getBalance(
            payment,
            getLastTransactionsPactus,
            ["data", "data"],
            filterPactusTransactions,
            pactusAmountToNormal,
            getLastBlockNumberPactus,
            coinData.pactus.networkConfirmationNumber,
            (transaction) => transaction.value,
            (transaction) => transaction.blockHeight
        )
    }

    // * Tokens
    // Tron Tokens
    private async getTronTokenBalance(payment: Payment): Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }> {
        return await this.getBalance(
            payment,
            getLastTransactionsTronTokens,
            ["data"],
            filterTronTokensTransactions,
            amountToNormalTronToken,
            async () => Date.now(),
            coinData.tronToken.networkConfirmationNumber,
            (transaction) => transaction,
            (transaction) => transaction.block_timestamp
        )
    }


    // Binance Tokens
    private async getBinanceSmartChainTokensBalance(payment: Payment): Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }> {
        return await this.getBalance(
            payment,
            getLastTransactionsBinanceSmartChainTokens,
            ["result"],
            filterBinanceSmartChainTokenTransactions,
            amountToNormalBinanceToken,
            getLastBlockNumberBinanceSmartChain,
            coinData.binance.networkConfirmationNumber,
            (transaction) => transaction.value,
            (transaction) => transaction.blockNumber
        )
    }

}
