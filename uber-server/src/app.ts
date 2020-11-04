import { GraphQLServer } from "graphql-yoga";
import cors from "cors";
import logger from "morgan";
import schema from "./schema";
// import User from "./entities/User";
import decodeJWT from "./api/utils/decodeJWT";

class App {
  public app: GraphQLServer;

  private jwtMiddleware = async (req, res, next): Promise<void> => {
    // TODO: header를 x-jwt로 설정해야함. 주의할 것
    const token = req.get("X-JWT");
    if (token) {
      const user = await decodeJWT(token);
      console.log(user); // 일단 헤더에 jwt 넣어 보내면 user 식별은 되는 것으로 확인 됨
    }
    next();
  };

  private middlewares = (): void => {
    this.app.express.use(cors());
    this.app.express.use(logger("dev"));
    this.app.express.use(this.jwtMiddleware);
  };

  constructor() {
    this.app = new GraphQLServer({ schema });
    this.middlewares();
  }
}

export default new App().app;
