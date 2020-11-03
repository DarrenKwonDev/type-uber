import { GraphQLServer } from "graphql-yoga";
import cors from "cors";
import logger from "morgan";
import schema from "./schema";

class App {
  public app: GraphQLServer;
  private middlewares = (): void => {
    this.app.express.use(cors());
    this.app.express.use(logger("dev"));
  };
  constructor() {
    this.app = new GraphQLServer({ schema });
    this.middlewares();
  }
}

export default new App().app;
