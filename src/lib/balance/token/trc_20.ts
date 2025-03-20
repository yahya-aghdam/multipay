/* eslint-disable @typescript-eslint/no-explicit-any */
import linksmith from "linksmith";
import { fixTimeToMiliSec } from "../..";
import { coinData } from "../../../config/constants";
import { Payment } from "../../../db/entities/payments";

// Function to filter Tron Tokens transactions based on payment details
export function filterTronTokensTransactions(transactions: any[], payment: Payment): any[] {
    return transactions.filter(tx => {

        const timestamp = fixTimeToMiliSec(tx.block_timestamp);

        let recieverAddress: string | undefined;
        if (tx.to != undefined) {
            recieverAddress = tx.to
        }

        return timestamp > +payment.time && timestamp < +payment.expiration && payment.address == recieverAddress;
    });
}

export function amountToNormalTronToken(tx: any): string {
    const decimal = tx.token_info.decimals;
    const amount = tx.value / 10 ** decimal;
    return amount.toString();
}

// Function to get the last 5 transactions for a Tokens
export async function getLastTransactionsTronTokens(payment: Payment): Promise<Response> {
    const finalUrl = linksmith(coinData.tronToken.accounts, {
        paths: [payment.address, "transactions", "trc20"],
        queryParams: { limit: "1", order_by: "block_timestamp,desc", only_confirmed: "true" }
    });
    return await fetch(finalUrl);
}