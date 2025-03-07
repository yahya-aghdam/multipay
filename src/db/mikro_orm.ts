import { Connection, EntityManager, IDatabaseDriver, MikroORM, Options } from '@mikro-orm/core';
import { isObjectEmpty, getDriver } from '../lib';
import { MultiPay } from './entity';
import { dbDefualtName } from '../config/constants';
import { DB_NAME, DB_URL } from '../config/dotenv';



export class DbMikroOrm {
   
    private config: Options = {
        dbName: DB_NAME || dbDefualtName, 
        clientUrl: DB_URL,
        debug: true, 
        driver: getDriver(DB_URL), 
        allowGlobalContext: true
    };
    private orm: MikroORM | undefined;
    private entityManager!: EntityManager<IDatabaseDriver<Connection>>;
    private entity = MultiPay

    constructor() {
        this.initialize();
    }

    private async initialize() {
        this.orm = await MikroORM.init(this.config);
        this.entityManager = this.orm.em.fork();
        this.entity = MultiPay
        this.config.entities = [this.entity]
    }

    public async findOne(filter: any) {
        return await this.entityManager.findOne(this.entity, filter);
    }

    public async findMany(filter: any) {
        return await this.entityManager.find(this.entity, filter);
    }

    public async updateOne(data: any) {
        return await this.entityManager.persistAndFlush(data);
    }

    public async createOne(data: any) {
        this.entityManager.create(this.entity, data);
        await this.entityManager.flush()
    }

}



