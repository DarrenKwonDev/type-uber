import { ConnectionOptions } from "typeorm";

const connectionOptions: ConnectionOptions = {
  type: "postgres",
  host: process.env.DB_ENDPOINT,
  port: 5432, // postgresql 기본 포트
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "uber",
  synchronize: true, // django로 치면 자동으로 migration 하는 것
  logging: false, // 너무 거슬려서 일단 false로
  entities: ["./entities/**/*.*"],
};

export default connectionOptions;

// https://github.com/typeorm/typeorm의 ormconfig.json 구성 부분을 참고할 것
// connection option은 공식문서 https://typeorm.io/#/connection-options 에서 확인 가능

// {
//    "type": "mysql",
//    "host": "localhost",
//    "port": 3306,
//    "username": "test",
//    "password": "test",
//    "database": "test",
//    "synchronize": true,
//    "logging": false,
//    "entities": [
//       "src/entity/**/*.ts"
//    ],
//    "migrations": [
//       "src/migration/**/*.ts"
//    ],
//    "subscribers": [
//       "src/subscriber/**/*.ts"
//    ]
// }
