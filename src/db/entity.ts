import { Entity, PrimaryKey, Property, Index } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { multiPayTableName } from '../config/constants';


// Define the MultiPay entity class with MikroORM annotations
@Entity({ tableName: multiPayTableName }) // This decorator specifies that the class is an entity with a custom table name
export class MultiPay {

    @PrimaryKey() // Marks this field as the primary key for the entity
    _id: string = randomUUID(); // Automatically generates a unique ID for each record using UUID

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
