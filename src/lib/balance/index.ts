import linksmith from "linksmith";
import { Payment } from "../../db/entity";
import { coinData, noAction } from "./vars";
import { filterTronTransactions, getLastBlockNumberTron, sunAmountToNormal } from "./utils";


export default class Balance {

    private coinHandlers: Record<string, (payment: Payment) => Promise<{ amount: string, blockNumber: number, isConfirmed: boolean }>> = {
        "tron": this.getTronBalance.bind(this),
        // ethereum: handleEthereum,
        // usdt_trc20: handleUsdtTrc20
    };

    private async processCoin(payment: Payment): Promise<{ amount: string, blockNumber: number, isConfirmed: boolean }> {
        const handler = this.coinHandlers[payment.coin]; // Get function from map
        if (handler) {
            return await handler(payment); // Execute function
        } else {
            return noAction;
        }
    }


    // Tron
    private async getTronBalance(payment: Payment): Promise<{ amount: string, blockNumber: number, isConfirmed: boolean }> {

        if (!payment.isPaid) {
            const finalUrl = linksmith(coinData.tron.accounts, {
                paths: [payment.address, "transactions"],
                queryParams: { "limit": "5", "order_by": "block_timestamp,desc" }
            })

            const last5Transactions = await fetch(finalUrl)

            if (last5Transactions.status == 200) {
                const transactions = (await last5Transactions.json()).data
                const filteredTransactions = filterTronTransactions(transactions, payment);

                if (filteredTransactions.length > 0) {
                    const amount = filteredTransactions[0].raw_data.contract[0].parameter.value.amount;
                    const blockNumber = filteredTransactions[0].blockNumber;

                    return { amount: sunAmountToNormal(amount), blockNumber, isConfirmed: false };
                } else {
                    return noAction;
                }
            } else {
                console.log("Error in getting balance:", last5Transactions)
                return noAction;
            }
        } else {
            if (!payment.isConfirmed) {
                const lastBlockNumber = await getLastBlockNumberTron();
                let isConfirmed = false;
                if ((payment.blockNumber + coinData.tron.networkConfirmationNumber) <= lastBlockNumber) {
                    isConfirmed = true;
                }
                return { "amount": payment.amount, "blockNumber": payment.blockNumber, isConfirmed };
            } else {
                return { "amount": payment.amount, "blockNumber": payment.blockNumber, "isConfirmed": payment.isConfirmed };
            }
        }
    }

    // Client
    public async verify(payment: Payment): Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }> {
        const { amount, blockNumber, isConfirmed } = await this.processCoin(payment);

        if (amount >= payment.amount) {
            return { verify: true, blockNumber, isConfirmed };
        } else {
            return { verify: false, blockNumber, isConfirmed };
        }
    }
}
