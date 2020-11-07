import { Resolvers } from "../../../types/resolvers";
import { GetMyProfileResponse } from "../../../types/graph";
import authResolver from "../../utils/resolverMiddleware";

const resolvers: Resolvers = {
  Query: {
    GetMyProfile: authResolver(
      async (_, __, context): Promise<GetMyProfileResponse> => {
        const { user } = context.req;

        return { ok: true, error: null, user: user };
      }
    ),
  },
};

export default resolvers;
