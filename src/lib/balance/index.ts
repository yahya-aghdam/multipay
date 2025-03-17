/* eslint-disable @typescript-eslint/no-explicit-any */
import { Payment } from "../../db/entity"
import { coinData, noAction } from "./vars"
import {
    filterBinanceSmartChainTransactions,
    filterEthereumTransactions,
    filterTronTransactions,
    getLast5TransactionsTron,
    getLastBlockNumberBinanceSmartChain,
    getLastBlockNumberEthereum,
    getLastBlockNumberTron,
    getLastTransactionsBinanceSmartChain,
    getLastTransactionsEthereum,
    sunAmountToNormal,
    weiAmountToNormal
} from "./utils"

export default class Balance {

    private coinHandlers: Record<string, (payment: Payment) => Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }>> = {
        "tron": this.getTronBalance.bind(this),
        "ethereum": this.getEthereumBalance.bind(this),
        "smartchain": this.getBinanceSmartChainBalance.bind(this),
    }

    // Client
    public async verify(payment: Payment): Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }> {
        const handler = this.coinHandlers[payment.coin]
        if (handler) {
            return await handler(payment)
        } else {
            return noAction
        }
    }

    private async getBalance(
        payment: Payment,
        getLastTransactions: (payment: Payment) => Promise<Response>,
        keyOfData: string,
        filterTransactions: (transactions: any[], payment: Payment) => any[],
        convertAmount: (amount: any) => string,
        getLastBlockNumber: () => Promise<number>,
        networkConfirmationNumber: number,
        extractAmount: (transaction: any) => any,
        extractBlockNumber: (transaction: any) => number,

    ): Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }> {

        if (!payment.isPaid) {
            const lastTransactions = await getLastTransactions(payment)

            if (lastTransactions.status == 200) {
                const res = await lastTransactions.json()
                const transactions = res[keyOfData]

                const filteredTransactions = filterTransactions(transactions, payment)

                if (filteredTransactions.length > 0) {
                    const amount = extractAmount(filteredTransactions[0])
                    const blockNumber = extractBlockNumber(filteredTransactions[0])
                    const amountToNormal = convertAmount(amount)
                    
                    let verify = false
                    if (amountToNormal >= payment.amount) {
                        verify = true
                    }

                    return { verify, blockNumber, isConfirmed: false }
                } else {
                    return noAction
                }
            } else {
                console.log("Error in getting balance:", lastTransactions)
                return noAction
            }
        } else {
            if (!payment.isConfirmed) {
                const lastBlockNumber = await getLastBlockNumber()
                let isConfirmed = false
                if ((payment.blockNumber + networkConfirmationNumber) <= lastBlockNumber) {
                    isConfirmed = true
                }
                return { "verify": payment.isPaid, "blockNumber": payment.blockNumber, isConfirmed }
            } else {
                return { "verify": payment.isPaid, "blockNumber": payment.blockNumber, "isConfirmed": payment.isConfirmed }
            }
        }
    }

    // Tron
    private async getTronBalance(payment: Payment): Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }> {
        return await this.getBalance(
            payment,
            getLast5TransactionsTron,
            "data",
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
            "result",
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
            "result",
            filterBinanceSmartChainTransactions,
            weiAmountToNormal,
            getLastBlockNumberBinanceSmartChain,
            coinData.ethereum.networkConfirmationNumber,
            (transaction) => transaction.value,
            (transaction) => transaction.blockNumber
        )
    }



}
