# multipay

Multipay is a multi cryptocurrency payment gateway as a microservice that facilitates the creation and management of wallets, balance checking, and payment verification and confirmation for various cryptocurrencies. It leverages [Trust Wallet Core](https://github.com/TrustWallet/wallet-core) for wallet functionalities and uses [gRPC](https://grpc.io/) for and [graphQL](https://graphql.org/) for payment management.

## Supported Cryptocurrencies

- ✅ Tron
- ✅ Ethereum
- ✅ Binance smart chain
- ✅ Pactus
- ✅ USDT TRC-20
- ✅ USDT BEP-20

## Table of Contents

- [multipay](#multipay)
  - [Supported Cryptocurrencies](#supported-cryptocurrencies)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [`.env` file](#env-file)
  - [Supported databases](#supported-databases)
  - [Usage](#usage)
    - [Development](#development)
    - [Production](#production)
  - [Postman example](#postman-example)
  - [Example of gRPC request](#example-of-grpc-request)
    - [coin types](#coin-types)
    - [Add payment](#add-payment)
    - [Verify payment](#verify-payment)
  - [GraphQL Schema](#graphql-schema)
    - [Types](#types)
    - [Queries](#queries)
    - [Mutations](#mutations)
    - [Example Queries and Mutations](#example-queries-and-mutations)
      - [Query: Get All Payments](#query-get-all-payments)
      - [Query: Get Payment by ID](#query-get-payment-by-id)
      - [Mutation: Create Payment](#mutation-create-payment)
      - [Mutation: Verify Payment](#mutation-verify-payment)
  - [Project Structure](#project-structure)
  - [License](#license)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/yahya-aghdam/multipay.git
    cd multipay
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Build the project:

    ```sh
    npm run build
    ```

4. Start the server:

    ```sh
    npm start
    ```

## `.env` file

```ini
PROTO_URL=your_proto_url
PROTO_PORT=your_proto_port
GRAPHQL_PORT=your_graphql_port
DB_URL=your_db_url
DB_NAME=your_db_name
PAYMENT_EXPIRATION_TIME_MIN=your_payment_expiration_time # in minutes
WALLET_STRENGTH=your_wallet_strength # in bits
ETHER_SCAN_API_KEY=your_ether_scan_api_key # if you support Ethereum sign in  https://etherscan.io and paste your api key in here
BSC_SACN_API_KEY=your_bsc_sacn_api_key # if you support Binance Smart Chain sign in  https://bscscan.com and paste your api key in here
```

## Supported databases

Based on `DB_URL` variable in `.env` file, multipay can use MySQL, PostgreSQL or MongoDB.

- ✅ MySQL
- ✅ PostgreSQL
- ✅ MongoDB

Database connection URL:

| Type       |        default connection url        |
| :--------- | :----------------------------------: |
| mongo      |      mongodb://127.0.0.1:27017       |
| mysql      |     mysql://root@127.0.0.1:3306      |
| postgresql | postgresql://postgres@127.0.0.1:5432 |

## Usage

### Development

You can add your own custom coins in `src/balance/index.ts` file.

To start the development server locally, with hot reloading:

```sh
npm run dev
```

To start the development server using Docker:

```sh
npm run docker:dev
```

### Production

To start the production server locally:

```sh
npm run build
npm run start
```

To start the production server using Docker:

```sh
npm run docker:build
```

## Postman example

You can use this invitation link to test app:
[Postman example](https://app.getpostman.com/join-team?invie_code=a9f908c0257917207a95ea9bb3ddc1f772171fb37d05df712f94700f75d8482d&target_code=08b944b4912a3d2a0233dd587445fca3)

## Example of gRPC request

### coin types

| Coin name                 | Type     | value        |
| ------------------------- | -------- | ------------ |
| Tron (TRX)                | `string` | `tron`       |
| Ethereum (ETH)            | `string` | `ethereum`   |
| Binance smart chain (BNB) | `string` | `smartchain` |
| Pactus (PAC)              | `string` | `pactus`     |
| USDT TRC-20 (USDT)        | `string` | `usdt_trc20` |
| USDT BEP-20 (USDT)        | `string` | `usdt_bep20` |

### Add payment

Message body:

| Field      | Type     | Description                      |
| ---------- | -------- | -------------------------------- |
| `amount`   | `string` | Amount of payment like "0.00256" |
| `clientId` | `string` | ID of client                     |
| `coin`     | `string` | Name of coin like "etherum"      |

Response:

```json
{
    "coin": "ethereum",
    "amount": "0.001",
    "expiration": "1742146248273",
    "paymentId": "53d10ad5-3be0-4ef3-ac30-6a88afb4e364",
    "clientId": "testClientId",
    "address": "0xFF49d5Ff0Da6cB8825ba644F0262a514Ec7830C0",
    "time": "1742145048273"
}
```

### Verify payment

Message body:

| Field       | Type     | Description   |
| ----------- | -------- | ------------- |
| `paymentId` | `string` | ID of payment |

Response:

```json
{
    "coin": "ethereum",
    "amount": "0.001",
    "expiration": "1742146248273",
    "paymentId": "53d10ad5-3be0-4ef3-ac30-6a88afb4e364",
    "clientId": "testClientId",
    "address": "0xFF49d5Ff0Da6cB8825ba644F0262a514Ec7830C0",
    "isPaid": true,
    "isConfirmed": true,
}
```

## GraphQL Schema

The GraphQL schema defines the types and operations available in the API. Here are the main types and operations:

### Types

```graphql
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
```

### Queries

```graphql
type Query {
  payments: [Payment!]!
  paymentById(paymentId: String!): Payment
}
```

### Mutations

```graphql
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
```

### Example Queries and Mutations

#### Query: Get All Payments

```graphql
query {
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
```

#### Query: Get Payment by ID

```graphql
query {
  paymentById(paymentId: "your_payment_id") {
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
```

#### Mutation: Create Payment

```graphql
mutation {
  createPayment(
    coin: "ethereum",
    amount: "0.001",
    clientId: "testClientId"
  ) {
    paymentId
    coin
    amount
    expiration
    clientId
    address
    time
  }
}
```

#### Mutation: Verify Payment

```graphql
mutation {
  verifyPayment(paymentId: "your_payment_id") {
    coin
    amount
    expiration
    paymentId
    clientId
    address
    isPaid
    isConfirmed
  }
}
```

## Project Structure

```text
src/
├── config/           # Configuration files
│   ├── constants.ts
│   └── dotenv.ts
├── db/              # Database related code
│   ├── entity.ts
│   └── mikro_orm.ts
├── lib/             # Core library code
│   ├── balance/     # Balance checking functionality
│   │   ├── utils.ts
│   │   └── vars.ts
│   └── wallet/      # Wallet management
│       └── index.ts
└── protos/          # gRPC protocol definitions
    ├── multipay.proto
    └── multipay.service.proto.ts
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
