import { Connection, EntityManager, EntityName, IDatabaseDriver, MikroORM, Options } from '@mikro-orm/core';
import { getDriver } from '../lib';
import { Payment, Wallets } from './entity';
import { dbDefualtName } from '../config/constants';
import { DB_NAME, DB_URL } from '../config/dotenv';



export class DB {

    private config: Options = {
        dbName: DB_NAME || dbDefualtName,
        clientUrl: DB_URL,
        debug: false,
        driver: getDriver(DB_URL),
        allowGlobalContext: true,
        entities: [Payment, Wallets]
    };
    private orm: MikroORM | undefined;
    private entityManager!: EntityManager<IDatabaseDriver<Connection>>;



    public async init() {
        this.orm = await MikroORM.init(this.config);
        this.entityManager = this.orm.em.fork();
    }

    public async findOne(entity: EntityName<object>, filter: object) {
        return await this.entityManager.findOne(entity, filter);
    }

    public async findMany(entity: EntityName<object>, filter: object, options: object | undefined) {
        return await this.entityManager.find(entity, filter, options);
    }

    public async updateOne(target: Payment | Wallets, data: Payment | Wallets) {
        this.entityManager.assign(target, data)
        return await this.entityManager.persistAndFlush(target);
    }

    public async createOne(entity: EntityName<object>, data: object) {
        this.entityManager.create(entity, data);
        await this.entityManager.flush()
    }

}



