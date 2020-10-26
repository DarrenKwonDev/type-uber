import User from "../../../entities/User";
import { Resolvers } from "src/types/resolvers";
import { FacebookConnectResponse, FacebookConnectMutationArgs } from "../../../types/graph";

const resolvers: Resolvers = {
  Mutation: {
    FacebookConnect: async (_, args: FacebookConnectMutationArgs): Promise<FacebookConnectResponse> => {
      // 이미 같은 fbId를 가진 유저가 있는지 체크함 (1번째 try/catch)
      try {
        // 동일한 fbId를 가진 유저가 있는지 체크
        const existingUser = await User.findOne({ fbId: args.fbId });
        if (existingUser) {
          return {
            ok: true,
            error: null,
            token: "Comming soon!, already existed",
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
        await User.create({
          ...args,
          profilePhoto: `https://graph.facebook.com/${args.fbId}/picture?type=square`,
        }).save();

        return {
          ok: true,
          error: null,
          token: "Comming soon!, created",
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
