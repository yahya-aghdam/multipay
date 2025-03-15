/* eslint-disable @typescript-eslint/no-explicit-any */
import { TronWeb } from "tronweb";
import { Payment } from "../../db/entity";
import { coinData } from "./vars";


export function sunAmountToNormal(data: number): string {
    const amount = data / 1_000_000;
    return amount.toFixed(8);
}

export function normalAmountToSun(data: number): string {
    const amount = data * 1_000_000;
    return amount.toFixed(0);
}

export function filterTronTransactions(transactions: any[], payment: Payment): any[] {
    return transactions.filter(tx => {
        const timestamp = tx.block_timestamp;
        const amount = tx.raw_data.contract[0].parameter.value.amount;
        let recieverAddress: string | undefined;
        if (tx.raw_data.contract[0].parameter.value.to_address != undefined) {
            recieverAddress = tx.raw_data.contract[0].parameter.value.to_address
        }
        const toAddressHex = TronWeb.address.toHex(payment.address)

        return +timestamp > +payment.time && +timestamp < +payment.expiration && amount !== 1 && toAddressHex == recieverAddress;
    });

}

export async function getLastBlockNumberTron(): Promise<number> {
    const response = await fetch(coinData.tron.block)
    const data = await response.json()
    return data.block_header.raw_data.number
}
