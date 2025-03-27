
import { exec } from "child_process";
import linksmith from "linksmith";
import { promisify } from "util";
import { fixTimeToMiliSec } from "../..";
import { coinData } from "../../../config/constants";
import { Payment } from "../../../db/entities/payments";

// Function to get the last transactions for an Pactus payment address
export async function getLastTransactionsPactus(payment: Payment): Promise<Response> {
    const finalUrl = linksmith(coinData.pactus.accounts, {
        paths: [payment.address, "txs"],
        queryParams: {
            page_size: "1",
            page_no: "1",
        }
    });
    return await fetch(finalUrl);
}

// Function to convert Wei (Ethereum's smallest unit) to Ether
export function pactusAmountToNormal(amount: string): string {
    return (+amount / 1e9).toString();
}

// Function to get the last block number on the Pactus blockchain
export async function getLastBlockNumberPactus(): Promise<number> {
    const finalUrl = linksmith(coinData.pactus.block, {
        paths: ["blockchain", "get_blockchain_info"]
    });

    // curl
    const execAsync = promisify(exec)
    const { stdout } = await execAsync(`curl -k "${finalUrl}"`);
    const data = JSON.parse(stdout);

    if (data) {
        return data.lastBlockHeight;
    } else {
        return 0;
    }
}

export function filterPactusTransactions(transactions: any[], payment: Payment): any[] {
    return transactions.filter(tx => {
        const timestamp = fixTimeToMiliSec(tx.createdAt);
        let recieverAddress: string | undefined;
        if (tx.to != undefined) {
            recieverAddress = tx.to;
        }

        return timestamp > +payment.time && timestamp < +payment.expiration && payment.address == recieverAddress;
    });
}