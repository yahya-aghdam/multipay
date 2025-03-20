import { Entity, PrimaryKey, Index, Property } from "@mikro-orm/core";
import { randomUUID } from "crypto";


@Entity()
export class Wallets {

    @PrimaryKey()
    _id: string = randomUUID();

    @Index()
    @Property()
    address!: string;

    @Property()
    mnemonic!: string;

    @Property()
    coin!: string;

    @Property()
    amount!: string;
}
