/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApolloServer } from 'apollo-server';
import { paymentResolvers } from './payment/payment.resolvers';
import { paymentTypeDefs } from './payment/payment.typeDefs';
import { walletResolvers } from './wallet/wallet.resolvers';
import { walletTypeDefs } from './wallet/wallet.typeDefs';
import { DB } from '../db/mikro_orm';


export async function graphQlServer(db:DB)  {

    const server = new ApolloServer({
        typeDefs: [paymentTypeDefs, walletTypeDefs],
        resolvers: [paymentResolvers, walletResolvers],
        context: ({ req }) => ({
            db, 
        }),
    });

    // Start the Apollo server
    server.listen().then(({ url }) => {
        console.log(`graphQl server running on: ${url}`);
    });
};

