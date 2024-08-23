import {Options} from 'sequelize'

export type ServerConfig = {
  maintenance: boolean;
  host: string;
  port: number;
  corsOptions: CorsOptions;
  docs: DocsOptions;
  fileLimits: FileLimitOptions;
  mail: MailOptions;
  db: Options;
  jwt: JwtOptions;
  operational: OperationalOptions;
};

export type OperationalOptions = {
  maxLogInAttempts: number;
}

type JwtOptions = {
  secretKey: string;
  expiresIn: string;
}

type PoolOptions = {
  max: number;
  min: number;
  idle: number;
}

type DocsOptions = {
  show: boolean;
  options: any;
};

type FileLimitOptions = {
  jsonLimit: string;
  bodyParserLimit: string;
};

type CorsOptions = {
  enabled: boolean;
  origins: string | boolean | RegExp | (string | RegExp)[];
  methods: string | string[];
};

export type CommandResponses = {
    error: boolean;
    continue: boolean;
    errorCode?: string;
    data?: any;
    message?: string;
}

export type HTTPRequest = {
    url: string;
    method: any;
    data: any
    headers: any,
    timeout: number,
    continue?:  boolean
}

export type MailOptions = {
  url: string;
}