/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TronWeb } from "tronweb";
import linksmith from "linksmith";
import { Payment } from "../db/entity";


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
            return { "amount": "0", "blockNumber": 0, "isConfirmed": false };
        }
    }


    // Tron
    private async getTronBalance(payment: Payment): Promise<{ amount: string, blockNumber: number, isConfirmed: boolean }> {


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

        async function getLastBlockNumber(): Promise<number> {
            const response = await fetch(coinData.tron.block)
            const data = await response.json()
            return data.block_header.raw_data.number
        }


        const finalUrl = linksmith(coinData.tron.accounts, {
            paths: [payment.address, "transactions"],
            queryParams: { "limit": "5", "order_by": "block_timestamp,desc" }
        })

        const last5Transactions = await fetch(finalUrl)

        if (last5Transactions.status === 200) {
            const transactions = (await last5Transactions.json()).data
            const filteredTransactions = filterTronTransactions(transactions, payment);

            if (filteredTransactions.length > 0) {
                const amount = filteredTransactions[0].raw_data.contract[0].parameter.value.amount;
                const blockNumber = filteredTransactions[0].blockNumber;
                const lastBlockNumber = await getLastBlockNumber();
                let isConfirmed = false;
                if (blockNumber + coinData.tron.networkConfirmationNumber <= lastBlockNumber) {
                    isConfirmed = true;
                }
                return { amount: sunAmountToNormal(amount), blockNumber, isConfirmed };
            } else {
                return { "amount": "0", "blockNumber": 0, "isConfirmed": false };
            }
        } else {
            console.log("Error in getting balance:", last5Transactions)
            return { "amount": "0", "blockNumber": 0, "isConfirmed": false };
        }
    }

    public async verify(payment: Payment): Promise<{ verify: boolean, blockNumber: number, isConfirmed: boolean }> {
        const { amount, blockNumber, isConfirmed } = await this.processCoin(payment);

        if (amount >= payment.amount) {
            return { verify: true, blockNumber, isConfirmed };
        } else {
            return { verify: false, blockNumber, isConfirmed };
        }
    }
}



// * vars
const coinData = {
    tron: {
        accounts: "https://api.trongrid.io/v1/accounts",
        block: "https://api.trongrid.io/walletsolidity/getnowblock",
        networkConfirmationNumber: 20
    }
}

const coins = [
    "tron",
    "etherum",
    "usdt_trc20"
]