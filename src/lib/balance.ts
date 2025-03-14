/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TronWeb } from "tronweb";
import linksmith from "linksmith";
import { Payment } from "../db/entity";


export default class Balance {

    private coinHandlers: Record<string, (payment: Payment) => Promise<string>> = {
        "tron": this.getTronBalance.bind(this),
        // ethereum: handleEthereum,
        // usdt_trc20: handleUsdtTrc20
    };

    private async processCoin(payment:Payment): Promise<string> {
        const handler = this.coinHandlers[payment.coin]; // Get function from map
        if (handler) {
            return await handler(payment); // Execute function
        } else {
            return "0";
        }
    }


    private async getTronBalance(payment: Payment): Promise<string> {

        function sunAmountToNormal(data: number): string {
            const amount = data / 1_000_000;
            return amount.toFixed(8);
        }

        function normalAmountToSun(data: number): string {
            const amount = data * 1_000_000;
            return amount.toFixed(0);
        }

        function filterTronTransactions(transactions: any[], payment: Payment): any[] {
            return transactions.filter(tx => {
                const timestamp = tx.block_timestamp; // Extract timestamp
                const amount = tx.raw_data.contract[0].parameter.value.amount; // Extract amount
                let recieverAddress: string | undefined;
                if (tx.raw_data.contract[0].parameter.value.to_address != undefined) {
                    recieverAddress = tx.raw_data.contract[0].parameter.value.to_address
                }
                const toAddressHex = TronWeb.address.toHex(payment.address)

                return +timestamp > +payment.time && +timestamp < +payment.expiration && amount !== 1 && toAddressHex == recieverAddress; // Filter conditions
            });
                
        }


        const finalUrl = linksmith(api_urls.tron, {
            paths: [payment.address, "transactions"],
            queryParams: { "limit": "5", "order_by": "block_timestamp,desc" }
        }) 

        const last5Transactions = await fetch(finalUrl)

        if (last5Transactions.status === 200) {
            const transactions = (await last5Transactions.json()).data
            const filteredTransactions = filterTronTransactions(transactions, payment);
            console.log("🚀 ~ Balance ~ getTronBalance ~ filteredTransactions:", filteredTransactions)
            if (filteredTransactions.length > 0) {
                const amount = filteredTransactions[0].raw_data.contract[0].parameter.value.amount;
                return sunAmountToNormal(amount);
            } else {
                return "0";
            }
        } else {
            console.log("Error in getting balance:", last5Transactions)
            return "0";
        }
    }

    public async verify(payment:Payment): Promise<boolean> {
        const amount = await this.processCoin(payment);

        if (amount >= payment.amount) {
            return true;
        } else {
            return false;
        }
    }
}



// * vars
const api_urls = {
    tron: "https://api.trongrid.io/v1/accounts"
}

const coins = [
    "tron",
    "etherum",
    "usdt_trc20"
]