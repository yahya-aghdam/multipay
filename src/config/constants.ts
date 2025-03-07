import linksmith from "linksmith";
import {  PROTO_PORT, PROTO_URL } from "./dotenv";


export const proto_url = linksmith(PROTO_URL, { port: PROTO_PORT })

export const dbDefualtName = "multipay"
export const multiPayTableName = "payments"