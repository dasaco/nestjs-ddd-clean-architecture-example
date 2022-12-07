import dotenv from 'dotenv';

const output = dotenv.config();

if (output.error) {
  console.debug(output.error.message);
}

function getNumberEnvVar(varName: string, defaultValue?: number): number {
  if (varName in process.env && process.env[varName]) {
    const numberValue = Number.parseInt(process.env[varName]!, 10);

    if (numberValue) {
      return numberValue;
    }
  }

  if (defaultValue === undefined) {
    throw new Error(`ENV VAR not found: ${varName}`);
  }

  return defaultValue;
}

function getStringEnvVar(varName: string, defaultValue?: string): string {
  if (varName in process.env && process.env[varName]) {
    // Typescript doesn't make this type safe
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return process.env[varName]!;
  }

  if (defaultValue === undefined) {
    throw new Error(`ENV VAR not found: ${varName}`);
  }

  return defaultValue;
}

function getBoolEnvVar(varName: string, defaultValue?: boolean): boolean {
  if (varName in process.env && process.env[varName]) {
    return process.env[varName] === 'true';
  }

  if (defaultValue === undefined) {
    throw new Error(`ENV VAR not found: ${varName}`);
  }

  return defaultValue;
}

export interface IConfig {
  port: string;
  nodeEnv: string;
  debug: boolean;
  basePath: string;
  db: {
    hostWriter: string;
    port: number;
    database: string;
    username: string;
    password: string;
    logging: boolean;
    synchronize: boolean;
  };
}

const getConfigs: () => IConfig = () => ({
  port: getStringEnvVar('PORT'),
  nodeEnv: getStringEnvVar('NODE_ENV'),
  debug: getBoolEnvVar('DEBUG', false),
  basePath: '/api',
  db: {
    hostWriter: getStringEnvVar('DB_HOST_WRITER'),
    port: getNumberEnvVar('DB_PORT'),
    database: getStringEnvVar('DB_NAME'),
    username: getStringEnvVar('DB_USERNAME'),
    password: getStringEnvVar('DB_PASSWORD'),
    logging: getBoolEnvVar(
      'DB_LOGGING',
      getStringEnvVar('NODE_ENV') === 'development',
    ),
    synchronize: getStringEnvVar('NODE_ENV') === 'test',
  },
});

export default getConfigs;
