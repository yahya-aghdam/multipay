import { graphql_url } from "../config/constants";
import { DB } from "../db/mikro_orm";
import { startGraphQlServer } from "../qraphql/server.apollo";
import { coin } from "./consts";

beforeAll(async () => {
    const db = new DB();
    await db.init();

    startGraphQlServer(db)
});
 
describe("GraphQL API", () => {
    test("should fetch all payments", async () => {
        const response = await fetch(graphql_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query Payments {
                        payments {
                            _id
                            paymentId
                            coin
                            amount
                            expiration
                            clientId
                            address
                            isPaid
                            blockNumber
                            isConfirmed
                            time
                        }
                    }
                `,
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
    }); 

    test("should return 400 status code for invalid query", async () => {
        const response = await fetch(graphql_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query PaymentById {
                        paymentById(paymentId: null) {
                            _id
                            paymentId
                            coin
                            amount
                            expiration
                            clientId
                            address
                            isPaid
                            blockNumber
                            isConfirmed
                            time
                        }
                    }

                `,
            }),
        });

        expect(response.status).toBe(400);
    });


    test("should fetch all wallets", async () => {
        const response = await fetch(graphql_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query Wallets {
                        wallets {
                            _id
                            address
                            mnemonic
                            coin
                            amount
                        }
                    }
                `,
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
    });
 

    test(`should fetch all wallets by coin ${coin}`, async () => {
        const response = await fetch(graphql_url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                query: `
                    query WalletBy {
                        walletBy(coin: "${coin}") {
                            _id
                            address
                            mnemonic
                            coin
                            amount
                        }
                    }
                `,
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
    });

});