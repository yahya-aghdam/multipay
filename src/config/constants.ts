import linksmith from "linksmith";
import { PROTO_PORT, PROTO_URL } from "./dotenv";

// Constructing the proto_url by combining PROTO_URL and PROTO_PORT using linksmith
export const proto_url = linksmith(PROTO_URL, { port: PROTO_PORT });

// Defining a constant for the default database name
export const dbDefualtName = "multipay";

export const allowedCoins = ["ethereum", "tron", "smartchain", "usdt_trc20", "usdt_bep20"];