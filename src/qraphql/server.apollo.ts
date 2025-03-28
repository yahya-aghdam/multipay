/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloServer } from 'apollo-server';
import { paymentResolvers } from './payment/payment.resolvers';
import { paymentTypeDefs } from './payment/payment.typeDefs';
import { walletResolvers } from './wallet/wallet.resolvers';
import { walletTypeDefs } from './wallet/wallet.typeDefs';
import { DB } from '../db/mikro_orm';
import { GRAPHQL_PORT } from '../config/dotenv';


export async function startGraphQlServer(db: DB): Promise<void> {

    const server = new ApolloServer({
        typeDefs: [paymentTypeDefs, walletTypeDefs],
        resolvers: [paymentResolvers, walletResolvers],
        context: ({ req }) => ({
            db, 
        }),
    });

    // Start the Apollo server
    server.listen({  port: GRAPHQL_PORT }).then(({ url }) => {
        console.log(`graphQl server running on: ${url}`);
    });
};

