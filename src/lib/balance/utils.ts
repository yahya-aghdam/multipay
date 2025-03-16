/* eslint-disable @typescript-eslint/no-explicit-any */
import { TronWeb } from "tronweb";
import { Payment } from "../../db/entity";
import { coinData } from "./vars";
import linksmith from "linksmith";
import { ETHER_SCAN_API_KEY } from "../../config/dotenv";


// Tron

// Function to convert Sun (Tron's smallest unit) to normal Tron amount
export function sunAmountToNormal(data: number): string {
    const amount = data / 1_000_000;
    return amount.toFixed(8);
}

// Function to convert normal Tron amount to Sun
export function normalAmountToSun(data: number): string {
    const amount = data * 1_000_000;
    return amount.toFixed(0);
}

// Function to filter Tron transactions based on payment details
export function filterTronTransactions(transactions: any[], payment: Payment): any[] {
    return transactions.filter(tx => {
        const timestamp = tx.block_timestamp;
        const amount = tx.raw_data.contract[0].parameter.value.amount;
        let recieverAddress: string | undefined;
        if (tx.raw_data.contract[0].parameter.value.to_address != undefined) {
            recieverAddress = tx.raw_data.contract[0].parameter.value.to_address;
        }
        const toAddressHex = TronWeb.address.toHex(payment.address);

        return +timestamp > +payment.time && +timestamp < +payment.expiration && amount !== 1 && toAddressHex == recieverAddress;
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

// Ethereum

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
export function weiToEth(wei: string): string {
    return (Number(wei) / 1e18).toFixed(0);
}

// Function to get the last block number on the Ethereum blockchain
export async function getLastBlockNumberEthereum(): Promise<number> {
    const finalUrl = linksmith(coinData.ethereum.accounts, {
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