/* eslint-disable @typescript-eslint/no-explicit-any */
import linksmith from "linksmith";
import { fixTimeToMiliSec } from "../..";
import { coinData, tokenList } from "../../../config/constants";
import { BSC_SACN_API_KEY } from "../../../config/dotenv";
import { Payment } from "../../../db/entity";

// Function to get the last transactions for an Ethereum payment address
export async function getLastTransactionsBinanceSmartChainTokens(payment: Payment): Promise<Response> {
    const finalUrl = linksmith(coinData.binance.accounts, {
        queryParams: {
            apikey: BSC_SACN_API_KEY,
            module: "account",
            chainid: "1",
            action: "tokentx",
            contractaddress: tokenList.smartchain[payment.coin],
            address: payment.address,
            offset: "1",
            sort: "desc",
            startblock: "0",
            endblock: "99999999",
            page: "1",
        }
    });

    return await fetch(finalUrl);
}


export function amountToNormalBinanceToken(tx: any): string {
    const decimal = tx.tokenDecimal;
    const amount = tx.value / 10 ** decimal;
    return amount.toString();
}


export function filterBinanceSmartChainTokenTransactions(transactions: any[], payment: Payment): any[] {
    return transactions.filter(tx => {
        const timestamp = fixTimeToMiliSec(tx.timeStamp);
        const recieverAddress= tx.to;

        return timestamp > +payment.time && timestamp < +payment.expiration && payment.address == recieverAddress;
    });
}