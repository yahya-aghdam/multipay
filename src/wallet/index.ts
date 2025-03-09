/* eslint-disable @typescript-eslint/no-unused-vars */
import { initWasm } from "@trustwallet/wallet-core"
import { CoinType } from "@trustwallet/wallet-core/dist/src/wallet-core";


export default class Wallet {
    public strength: number | string

    constructor(strength: number | string) {
        this.strength = strength
    }

    public async makeWallet(coinType: keyof typeof CoinTypeLocal): Promise<{ mnemonic: string, address: string }> {
        const core = await initWasm();
        const { HDWallet, HexCoding, CoinType, AnyAddress } = core;

        const wallet = HDWallet.create(+this.strength, "");
        const mnemonic = wallet.mnemonic();
        const key = wallet.getKeyForCoin(CoinType[coinType]);
        const publicKey = key.getPublicKeySecp256k1(false);
        const address = AnyAddress.createWithPublicKey(publicKey, CoinType[coinType]);

        return {
            mnemonic,
            address: address.description()
        }
    }
}

export class CoinTypeLocal {
    value: number | undefined;
    static aeternity: CoinType;
    static aion: CoinType;
    static binance: CoinType;
    static bitcoin: CoinType;
    static bitcoinCash: CoinType;
    static bitcoinGold: CoinType;
    static callisto: CoinType;
    static cardano: CoinType;
    static cosmos: CoinType;
    static pivx: CoinType;
    static dash: CoinType;
    static decred: CoinType;
    static digiByte: CoinType;
    static dogecoin: CoinType;
    static eos: CoinType;
    static wax: CoinType;
    static ethereum: CoinType;
    static ethereumClassic: CoinType;
    static fio: CoinType;
    static goChain: CoinType;
    static groestlcoin: CoinType;
    static icon: CoinType;
    static ioTeX: CoinType;
    static kava: CoinType;
    static kin: CoinType;
    static litecoin: CoinType;
    static monacoin: CoinType;
    static nebulas: CoinType;
    static nuls: CoinType;
    static nano: CoinType;
    static near: CoinType;
    static nimiq: CoinType;
    static ontology: CoinType;
    static poanetwork: CoinType;
    static qtum: CoinType;
    static xrp: CoinType;
    static solana: CoinType;
    static stellar: CoinType;
    static tezos: CoinType;
    static theta: CoinType;
    static thunderCore: CoinType;
    static neo: CoinType;
    static viction: CoinType;
    static tron: CoinType;
    static veChain: CoinType;
    static viacoin: CoinType;
    static wanchain: CoinType;
    static zcash: CoinType;
    static firo: CoinType;
    static zilliqa: CoinType;
    static zelcash: CoinType;
    static ravencoin: CoinType;
    static waves: CoinType;
    static terra: CoinType;
    static terraV2: CoinType;
    static harmony: CoinType;
    static algorand: CoinType;
    static kusama: CoinType;
    static polkadot: CoinType;
    static filecoin: CoinType;
    static multiversX: CoinType;
    static bandChain: CoinType;
    static smartChainLegacy: CoinType;
    static smartChain: CoinType;
    static tbinance: CoinType;
    static oasis: CoinType;
    static polygon: CoinType;
    static thorchain: CoinType;
    static bluzelle: CoinType;
    static optimism: CoinType;
    static zksync: CoinType;
    static arbitrum: CoinType;
    static ecochain: CoinType;
    static avalancheCChain: CoinType;
    static xdai: CoinType;
    static fantom: CoinType;
    static cryptoOrg: CoinType;
    static celo: CoinType;
    static ronin: CoinType;
    static osmosis: CoinType;
    static ecash: CoinType;
    static iost: CoinType;
    static cronosChain: CoinType;
    static smartBitcoinCash: CoinType;
    static kuCoinCommunityChain: CoinType;
    static bitcoinDiamond: CoinType;
    static boba: CoinType;
    static syscoin: CoinType;
    static verge: CoinType;
    static zen: CoinType;
    static metis: CoinType;
    static aurora: CoinType;
    static evmos: CoinType;
    static nativeEvmos: CoinType;
    static moonriver: CoinType;
    static moonbeam: CoinType;
    static kavaEvm: CoinType;
    static kaia: CoinType;
    static meter: CoinType;
    static okxchain: CoinType;
    static stratis: CoinType;
    static komodo: CoinType;
    static nervos: CoinType;
    static everscale: CoinType;
    static aptos: CoinType;
    static nebl: CoinType;
    static hedera: CoinType;
    static secret: CoinType;
    static nativeInjective: CoinType;
    static agoric: CoinType;
    static ton: CoinType;
    static sui: CoinType;
    static stargaze: CoinType;
    static polygonzkEVM: CoinType;
    static juno: CoinType;
    static stride: CoinType;
    static axelar: CoinType;
    static crescent: CoinType;
    static kujira: CoinType;
    static ioTeXEVM: CoinType;
    static nativeCanto: CoinType;
    static comdex: CoinType;
    static neutron: CoinType;
    static sommelier: CoinType;
    static fetchAI: CoinType;
    static mars: CoinType;
    static umee: CoinType;
    static coreum: CoinType;
    static quasar: CoinType;
    static persistence: CoinType;
    static akash: CoinType;
    static noble: CoinType;
    static scroll: CoinType;
    static rootstock: CoinType;
    static thetaFuel: CoinType;
    static confluxeSpace: CoinType;
    static acala: CoinType;
    static acalaEVM: CoinType;
    static opBNB: CoinType;
    static neon: CoinType;
    static base: CoinType;
    static sei: CoinType;
    static arbitrumNova: CoinType;
    static linea: CoinType;
    static greenfield: CoinType;
    static mantle: CoinType;
    static zenEON: CoinType;
    static internetComputer: CoinType;
    static tia: CoinType;
    static mantaPacific: CoinType;
    static nativeZetaChain: CoinType;
    static zetaEVM: CoinType;
    static dydx: CoinType;
    static merlin: CoinType;
    static lightlink: CoinType;
    static blast: CoinType;
    static bounceBit: CoinType;
    static zkLinkNova: CoinType;
    static pactus: CoinType;
    static sonic: CoinType;
    static polymesh: CoinType;
}