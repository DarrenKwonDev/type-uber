import Place from "../../../entities/Place";
import User from "../../../entities/User";
import { AddPlaceResponse, AddPlaceMutationArgs } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    AddPlace: privateResolver(
      async (_, args: AddPlaceMutationArgs, context): Promise<AddPlaceResponse> => {
        const user: User = context.req.user;

        try {
          await Place.create({ ...args, user }).save();

          return {
            ok: true,
            error: null,
          };
        } catch (error) {
          return {
            ok: error,
            error: error.messages,
          };
        }
      }
    ),
  },
};

export default resolvers;
