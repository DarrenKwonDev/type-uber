import { Resolvers } from "../../../types/resolvers";
import { GetMyProfileResponse } from "../../../types/graph";
import privateResolver from "../../utils/privateResolver";

const resolvers: Resolvers = {
  Query: {
    GetMyProfile: privateResolver(
      async (_, __, context): Promise<GetMyProfileResponse> => {
        const { user } = context.req;

        return { ok: true, error: null, user: user };
      }
    ),
  },
};

export default resolvers;
