import { ConnectionOptions } from "typeorm"

const connectionOptions: ConnectionOptions = {
    type: "postgres",
    host: process.env.DB_ENDPOINT || "localhost",
    port: 5432,
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || "",
    database: "uber",
    synchronize: true,
    logging: true,
    entities: [
        "./entities/**/*.*"
    ]
}

export default connectionOptions

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
