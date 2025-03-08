import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';
import { randomUUID } from 'crypto';



@Entity() 
export class Payment {

    @PrimaryKey() 
    _id: string = randomUUID();

    @Index() 
    @Property() 
    payment_id!: string; 

    @Property() 
    coin!: string; 

    @Property() 
    amount!: string; 

    @Property() 
    expiration!: string; 

    @Property() 
    client_id!: string; 

    @Property() 
    address!: string; 

    @Property() 
    is_paid: boolean = false

    @Property() 
    is_confirmed: boolean = false
}


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
    is_open: boolean = true

    @Property()
    useable_time!: string;
}
