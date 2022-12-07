import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import getConfigs from './config';

const dbConfig: () => DataSourceOptions = () => {
  const configs = getConfigs();
  return {
    type: 'mysql',
    host: configs.db.hostWriter,
    port: configs.db.port,
    username: configs.db.username,
    password: configs.db.password,
    database: configs.db.database,
    entities: ['dist/**/*.orm-entity{.ts,.js}'],
    migrationsTableName: 'migrations',
    migrations: ['dist/migrations/*.js'],
    logging: configs.db.logging,
    synchronize: configs.db.synchronize,
    namingStrategy: new SnakeNamingStrategy(),
    bigNumberStrings: false,
  };
};

export default dbConfig;
