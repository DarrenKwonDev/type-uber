import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env") }); // dotenv를 상단에 config해줘야 다른 파일에서도 동작함

import { Options } from "graphql-yoga";
import { createConnection } from "typeorm";
import connectionOptions from "./ormConfig";
import app from "./app";
import decodeJWT from "./api/utils/decodeJWT";

const PORT: number | string | undefined = process.env.PORT;
const PLAYGROUND_ENDPOINT: string = "/playground";
const GRAPHQL_ENDPOINT: string = "/graphql";
const SUBSCRIPTION_ENDPOINT: string = "/subscription";

const appOptions: Options = {
  port: PORT,
  playground: PLAYGROUND_ENDPOINT,
  endpoint: GRAPHQL_ENDPOINT,
  subscriptions: {
    path: SUBSCRIPTION_ENDPOINT,
    onConnect: async (connectionParams) => {
      // onConnect에는 graphql req에서 넘어온 'X-JWT' 헤더가 있다.
      const token = connectionParams["X-JWT"];

      if (token) {
        const user = await decodeJWT(token);

        if (user) {
          return { currentUser: user }; //currentUser는 req.connection.context.currentUser로 들어가게 됨
        }
      }
      throw new Error("No jwt. Can't subscribe.");
    },
  },
};

const handleAppStart = () => console.log(`Server On: http://localhost:${PORT}`);

createConnection(connectionOptions)
  .then(() => {
    console.log("DB Connetion Success");
    app.start(appOptions, handleAppStart);
  })
  .catch((error) => {
    console.log(error);
  });
