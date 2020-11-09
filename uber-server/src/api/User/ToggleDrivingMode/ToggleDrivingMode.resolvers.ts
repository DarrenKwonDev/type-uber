import User from "../../../entities/User";
import { ToggleDrivingModeResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    ToggleDrivingMode: privateResolver(
      async (_, __, context, info): Promise<ToggleDrivingModeResponse> => {
        const user: User = context.req.user;

        user.isDriving = !user.isDriving;
        user.save();

        return {
          ok: true,
          error: null,
        };
      }
    ),
  },
};

export default resolvers;
