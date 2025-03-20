import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';
import { randomUUID } from 'crypto';



@Entity()
export class Payment {

    @PrimaryKey()
    _id: string = randomUUID();

    @Index()
    @Property()
    paymentId!: string;

    @Property()
    coin!: string ;

    @Property()
    amount!: string;

    @Property()
    expiration!: string;

    @Property()
    clientId!: string;

    @Property()
    address!: string;

    @Property()
    isPaid: boolean = false

    @Property()
    blockNumber!: number;

    @Property()
    isConfirmed: boolean = false

    @Property()
    time!: string;
}