# multipay

Multipay is a multi cryptocurrency payment gateway as a microservice that facilitates the creation and management of wallets, balance checking, and payment verification and confirmation for various cryptocurrencies. It leverages [Trust Wallet Core](https://github.com/TrustWallet/wallet-core) for wallet functionalities and uses [gRPC](https://grpc.io/) for communication. Also it uses some nodes for balance checking and payment confirmion.

## Supported Cryptocurrencies

- ✅ Tron
- ✅ Ethereum
- 🔜 Doge
- 🔜 USDT TRC-20
- 🔜 BNB
- 🔜 USDT BEP-20

## Table of Contents

- [multipay](#multipay)
  - [Supported Cryptocurrencies](#supported-cryptocurrencies)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [`.env` file](#env-file)
  - [Usage](#usage)
    - [Development](#development)
    - [Production](#production)
  - [Example of gRPC request](#example-of-grpc-request)
    - [coin types](#coin-types)
    - [Add payment](#add-payment)
    - [Verify payment](#verify-payment)
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
ETHER_SCAN_API_KEY=your_ether_scan_api_key # if you support Ethereum sign in the https://etherscan.io and paste your api key in here
```

## Usage

### Development

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

| Coin name             | Type     | value        |
| --------------------- | -------- | ------------ |
| `Tron`                | `string` | `tron`       |
| `Ethereum`            | `string` | `ethereum`   |
| `Binance smart chain` | `string` | `smartchain` |

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
