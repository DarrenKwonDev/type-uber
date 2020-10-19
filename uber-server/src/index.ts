import dotenv from "dotenv";
dotenv.config() // dotenv를 상단에 config해줘야 다른 파일에서도 동작함
import { Options } from "graphql-yoga";
import { createConnection } from "typeorm"
import connectionOptions from "./ormConfig";
import app from "./app";


const PORT: number | string | undefined = process.env.PORT;
const PLAYGROUND_ENDPOINT: string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql"

const appOptions: Options = {
    port: PORT,
    playground: PLAYGROUND_ENDPOINT,
    endpoint: GRAPHQL_ENDPOINT
}

const handleAppStart = () => console.log(`Server On: http://localhost:${PORT}`)

createConnection(connectionOptions).then(() => {
    console.log("DB Connetion Success")
    app.start(appOptions, handleAppStart)
})
