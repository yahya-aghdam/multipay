
import linksmith from "linksmith";
import { fixTimeToMiliSec } from "../..";
import { coinData } from "../../../config/constants";
import { BSC_SACN_API_KEY } from "../../../config/dotenv";
import { Payment } from "../../../db/entities/payments";

// Function to get the last transactions for an Ethereum payment address
export async function getLastTransactionsBinanceSmartChain(payment: Payment): Promise<Response> {
    const finalUrl = linksmith(coinData.binance.accounts, {
        queryParams: {
            apikey: BSC_SACN_API_KEY,
            module: "account",
            chainid: "1",
            action: "txlist",
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

export async function getLastBlockNumberBinanceSmartChain(): Promise<number> {
    const finalUrl = linksmith(coinData.binance.block, {
        queryParams: {
            apikey: BSC_SACN_API_KEY,
            module: "proxy",
            action: "eth_blockNumber",
        }
    });

    const response = await fetch(finalUrl);
    const data = await response.json();

    if (data.result) {
        const blockNumber = parseInt(data.result, 16);
        return blockNumber;
    } else {
        return 0;
    }
}

export function filterBinanceSmartChainTransactions(transactions: any[], payment: Payment): any[] {
    return transactions.filter(tx => {
        const timestamp = fixTimeToMiliSec(tx.timeStamp);
        let recieverAddress: string | undefined;
        if (tx.to != undefined) {
            recieverAddress = tx.to;
        }

        return timestamp > +payment.time && timestamp < +payment.expiration && payment.address == recieverAddress;
    });
}
