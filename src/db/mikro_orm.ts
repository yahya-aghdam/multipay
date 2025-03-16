import { Connection, EntityManager, EntityName, IDatabaseDriver, MikroORM, Options } from '@mikro-orm/core';
import { getDriver } from '../lib';
import { Payment, Wallets } from './entity';
import { dbDefualtName } from '../config/constants';
import { DB_NAME, DB_URL } from '../config/dotenv';



// Defining the DB class to manage database operations
export class DB {

    // Defining the configuration options for MikroORM
    private config: Options = {
        // Setting the database name, using the default if not provided
        dbName: DB_NAME || dbDefualtName,
        // Setting the client URL for the database connection
        clientUrl: DB_URL,
        // Disabling debug mode
        debug: false,
        // Getting the database driver based on the URL
        driver: getDriver(DB_URL),
        // Allowing global context for the ORM
        allowGlobalContext: true,
        // Specifying the entities to be managed by MikroORM
        entities: [Payment, Wallets]
    };

    // Defining a variable to hold the MikroORM instance
    private orm: MikroORM | undefined;

    // Defining a variable to hold the entity manager
    private entityManager!: EntityManager<IDatabaseDriver<Connection>>;

    // Initializing the ORM and entity manager
    public async init() {
        // Initializing MikroORM with the configuration
        this.orm = await MikroORM.init(this.config);
        // Creating a fork of the entity manager for isolated operations
        this.entityManager = this.orm.em.fork();
    }

    // Finding a single entity based on the provided filter
    public async findOne(entity: EntityName<object>, filter: object) {
        return await this.entityManager.findOne(entity, filter);
    }

    // Finding multiple entities based on the provided filter and options
    public async findMany(entity: EntityName<object>, filter: object, options: object | undefined) {
        return await this.entityManager.find(entity, filter, options);
    }

    // Updating a single entity with the provided data
    public async updateOne(target: Payment | Wallets, data: Payment | Wallets) {
        // Assigning the new data to the target entity
        this.entityManager.assign(target, data);
        // Persisting the changes and flushing them to the database
        return await this.entityManager.persistAndFlush(target);
    }

    // Creating a new entity with the provided data
    public async createOne(entity: EntityName<object>, data: object) {
        // Creating the new entity
        this.entityManager.create(entity, data);
        // Flushing the changes to the database
        await this.entityManager.flush();
    }
}