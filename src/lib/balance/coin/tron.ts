/* eslint-disable @typescript-eslint/no-explicit-any */
import { TronWeb } from "tronweb";
import { fixTimeToMiliSec } from "../..";
import { Payment } from "../../../db/entity";
import linksmith from "linksmith";
import { coinData } from "../../../config/constants";

// Function to convert Sun (Tron's smallest unit) to normal Tron amount
export function sunAmountToNormal(data: number): string {
    const amount = data / 1_000_000;
    return amount.toFixed(8);
}

// Function to filter Tron transactions based on payment details
export function filterTronTransactions(transactions: any[], payment: Payment): any[] {
    return transactions.filter(tx => {
        const timestamp = fixTimeToMiliSec(tx.block_timestamp);
        const amount = tx.raw_data.contract[0].parameter.value.amount;
        let recieverAddress: string | undefined;
        if (tx.raw_data.contract[0].parameter.value.to_address != undefined) {
            recieverAddress = tx.raw_data.contract[0].parameter.value.to_address;
        }
        const toAddressHex = TronWeb.address.toHex(payment.address);

        return timestamp > +payment.time && timestamp < +payment.expiration && amount !== 1 && toAddressHex == recieverAddress;
    });
}

// Function to get the last 5 transactions for a Tron payment address
export async function getLast5TransactionsTron(payment: Payment): Promise<Response> {
    const finalUrl = linksmith(coinData.tron.accounts, {
        paths: [payment.address, "transactions"],
        queryParams: { limit: "5", order_by: "block_timestamp,desc" }
    });
    return await fetch(finalUrl);
}

// Function to get the last block number on the Tron blockchain
export async function getLastBlockNumberTron(): Promise<number> {
    const response = await fetch(coinData.tron.block);
    const data = await response.json();
    return data.block_header.raw_data.number;
}