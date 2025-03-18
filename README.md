# multipay

Multipay is a multi cryptocurrency payment gateway as a microservice that facilitates the creation and management of wallets, balance checking, and payment verification and confirmation for various cryptocurrencies. It leverages [Trust Wallet Core](https://github.com/TrustWallet/wallet-core) for wallet functionalities and uses [gRPC](https://grpc.io/) for communication. Also it uses some nodes for balance checking and payment confirmion.

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
  - [Example of gRPC request](#example-of-grpc-request)
    - [coin types](#coin-types)
    - [Add payment](#add-payment)
    - [Verify payment](#verify-payment)
    - [Get payment details](#get-payment-details)
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

### Get payment details

You can add any type of filter you want

Message body:

| Field        | Type     | Description                |
| ------------ | -------- | -------------------------- |
| `coin`       | `string` | Name of coin               |
| `amount`     | `string` | Amount of payment          |
| `expiration` | `string` | Expiration time of payment |
| `paymentId`  | `string` | ID of payment              |
| `clientId`   | `string` | ID of client               |
| `address`    | `string` | Address of payment         |
| `time`       | `string` | Time of payment            |
| `offset`     | `int32`  | Offset of payments         |
| `limit`      | `int32`  | Limit of payments          |
| `sort`       | `string` | Sort of payments           |
| `orderBy`    | `string` | Order by of payments       |

example:

```json
{
    "coin": "ethereum",
    "clientId": "testClientId",
    "offset": 3,
    "limit": 10,
    "sort": "desc",
    "orderBy": "amount"
}
```

Response:

```json
{
    "data": [
        {
            "coin": "ethereum",
            "amount": "0.001",
            "expiration": "1742146248273",
            "paymentId": "53d10ad5-3be0-4ef3-ac30-6a88afb4e364",
            "clientId": "testClientId",
            "address": "0xFF49d5Ff0Da6cB8825ba644F0262a514Ec7830C0",
            "time": "1742145048273"
        }
    ]
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
