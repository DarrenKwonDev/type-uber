import User from "../../../entities/User";
import { Resolvers } from "../../../types/resolvers";
import { FacebookConnectResponse, FacebookConnectMutationArgs } from "../../../types/graph";
import createJWT from "../../utils/createJWT";

const resolvers: Resolvers = {
  Mutation: {
    FacebookConnect: async (
      _,
      args: FacebookConnectMutationArgs
    ): Promise<FacebookConnectResponse> => {
      // 이미 같은 fbId를 가진 유저가 있는지 체크함 (1번째 try/catch)
      try {
        // 동일한 fbId를 가진 유저가 있는지 체크
        const existingUser = await User.findOne({ fbId: args.fbId });
        const token = createJWT((existingUser as User).id);
        if (existingUser) {
          return {
            ok: true,
            error: null,
            token,
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }

      // 이미 존재하는 유저가 없으므로 새로 만들어야 함 (2번째 try/catch)
      try {
        const newUser = await User.create({
          ...args,
          profilePhoto: `https://graph.facebook.com/${args.fbId}/picture?type=square`,
        }).save();

        const token = createJWT(newUser.id);

        return {
          ok: true,
          error: null,
          token,
        };
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }
    },
  },
};

export default resolvers;
