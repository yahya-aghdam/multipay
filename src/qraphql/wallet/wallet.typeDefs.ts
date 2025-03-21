import { gql } from 'apollo-server';

export const walletTypeDefs = gql`
  type Wallet {
    _id: String!
    address: String!
    mnemonic: String!
    coin: String!
    amount: String!
  }

  type Query {
    wallets: [Wallet!]!
    walletBy(address: String,coin: String): [Wallet!]!
  }

`;
