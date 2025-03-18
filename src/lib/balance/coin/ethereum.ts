/* eslint-disable @typescript-eslint/no-explicit-any */
import linksmith from "linksmith";
import { fixTimeToMiliSec } from "../..";
import { Payment } from "../../../db/entity";
import { ETHER_SCAN_API_KEY } from "../../../config/dotenv";
import { coinData } from "../../../config/constants";

// Function to get the last transactions for an Ethereum payment address
export async function getLastTransactionsEthereum(payment: Payment): Promise<Response> {
    const finalUrl = linksmith(coinData.ethereum.accounts, {
        queryParams: {
            apikey: ETHER_SCAN_API_KEY,
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

// Function to convert Wei (Ethereum's smallest unit) to Ether
export function weiAmountToNormal(wei: string): string {
    return (+wei / 1e18).toString();
}

// Function to get the last block number on the Ethereum blockchain
export async function getLastBlockNumberEthereum(): Promise<number> {
    const finalUrl = linksmith(coinData.ethereum.block, {
        queryParams: {
            apikey: ETHER_SCAN_API_KEY,
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

export function filterEthereumTransactions(transactions: any[], payment: Payment): any[] {
    return transactions.filter(tx => {
        const timestamp = fixTimeToMiliSec(tx.timeStamp);
        let recieverAddress: string | undefined;
        if (tx.to != undefined) {
            recieverAddress = tx.to;
        }

        return timestamp > +payment.time && timestamp < +payment.expiration && payment.address == recieverAddress;
    });
}