import { gql } from 'apollo-server';

export const paymentTypeDefs = gql`
  type Payment {
    _id: String!
    paymentId: String!
    coin: String!
    amount: String!
    expiration: String!
    clientId: String!
    address: String!
    isPaid: Boolean!
    blockNumber: Int!
    isConfirmed: Boolean!
    time: String!
  }

  type Query {
    payments: [Payment!]!
    paymentById(paymentId: String!): Payment
  }

  type Mutation {
    createPayment(
      paymentId: String!
      coin: String!
      amount: String!
      expiration: String!
      clientId: String!
      address: String!
      blockNumber: Int!
      time: String!
    ): Payment!
  }
`;
