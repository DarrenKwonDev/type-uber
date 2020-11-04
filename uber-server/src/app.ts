import { GraphQLServer } from "graphql-yoga";
import cors from "cors";
import logger from "morgan";
import schema from "./schema";
import decodeJWT from "./api/utils/decodeJWT";
import { NextFunction, Response } from "express";

class App {
  public app: GraphQLServer;

  private jwtMiddleware = async (req, res: Response, next: NextFunction): Promise<void> => {
    // TODO: header를 x-jwt로 설정해야함. 주의할 것
    const token = req.get("X-JWT");
    if (token) {
      // 일단 헤더에 jwt 넣어 보내면 user 식별은 되는 것으로 확인 됨
      const user = await decodeJWT(token);

      if (user) {
        console.log("user가 존재합니다. req 객체에 user를 추가합니다.");
        req.user = user;
      } else {
        console.log("찾는 user가 없습니다.");
        req.user = undefined;
      }
    }

    next();
  };

  private middlewares = (): void => {
    this.app.express.use(cors());
    this.app.express.use(logger("dev"));
    this.app.express.use(this.jwtMiddleware);
  };

  constructor() {
    // TODO: express 미들웨어를 거쳐 얻은 req 객체를 모든 resolvers에서 사용할 수 있도록 context에 넣어주자.
    //https://github.com/prisma-labs/graphql-yoga#graphqlserver 참고. context 관해 1줄 읽어볼 것
    this.app = new GraphQLServer({
      schema,
      context: (req) => {
        return {
          req: req.request,
        };
      },
    });
    this.middlewares();
  }
}

export default new App().app;
