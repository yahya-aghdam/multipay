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
  
  type Payment_CreatePaymentOutput {
    paymentId: String!
    coin: String!
    amount: String!
    expiration: String!
    clientId: String!
    address: String!
    time: String!
  }

  type Payment_VerifyPaymentOutput {
    coin: String!
    amount: String!
    expiration: String!
    paymentId: String!
    clientId: String!
    address: String!
    isPaid: Boolean!
    isConfirmed: Boolean!
  }

  type Query {
    payments: [Payment!]!
    paymentById(paymentId: String!): Payment
  }

  type Mutation {
    createPayment(
      coin: String!
      amount: String!
      clientId: String!
    ): Payment_CreatePaymentOutput!

    verifyPayment(
      paymentId: String!
    ): Payment_VerifyPaymentOutput!
  }
`;
