import { GraphQLServer } from "graphql-yoga";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";

class App {
    public app: GraphQLServer
    private middlewares = ():void => {
        this.app.express.use(cors())
        this.app.express.use(logger("dev"))
        this.app.express.use(helmet())
    }
    contructor() {
        this.app = new GraphQLServer({});
        this.middlewares()
    }
}

export default new App().app