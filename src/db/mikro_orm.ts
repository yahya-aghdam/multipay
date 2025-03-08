import { Connection, EntityManager, EntityName, IDatabaseDriver, MikroORM, Options } from '@mikro-orm/core';
import {  getDriver } from '../lib';
import { Payment, Wallets } from './entity';
import { dbDefualtName } from '../config/constants';
import { DB_NAME, DB_URL } from '../config/dotenv';



export class MikroOrm {
   
    private config: Options = {
        dbName: DB_NAME || dbDefualtName, 
        clientUrl: DB_URL,
        debug: true, 
        driver: getDriver(DB_URL), 
        allowGlobalContext: true,
        entities: [Payment, Wallets]
    };
    private orm: MikroORM | undefined;
    private entityManager!: EntityManager<IDatabaseDriver<Connection>>;

    constructor() {
        this.initialize();
    }

    private async initialize() {
        this.orm = await MikroORM.init(this.config);
        this.entityManager = this.orm.em.fork();
    }

    public async findOne(entity: EntityName<object>, filter: object) {
        return await this.entityManager.findOne(entity, filter);
    }

    public async findMany(entity: EntityName<object>, filter: object) {
        return await this.entityManager.find(entity, filter);
    }

    public async updateOne(data: object) {
        return await this.entityManager.persistAndFlush(data);
    }

    public async createOne(entity: EntityName<object>, data: object) {
        this.entityManager.create(entity, data);
        await this.entityManager.flush()
    }

}



