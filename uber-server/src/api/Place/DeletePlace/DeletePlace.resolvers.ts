import Place from "../../../entities/Place";
import User from "../../../entities/User";
import { DeletePlaceMutationArgs, DeletePlaceResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    DeletePlace: privateResolver(
      async (_, args: DeletePlaceMutationArgs, context): Promise<DeletePlaceResponse> => {
        const user: User = await context.req.user;

        try {
          const place = await Place.findOne({ id: args.placeId });

          if (place) {
            if ((place.userId = user.id)) {
              place.remove(); // 삭제!
              return { ok: true, error: null };
            } else {
              return {
                ok: false,
                error: "Not Authorized",
              };
            }
          } else {
            return {
              ok: false,
              error: "can't find place",
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
          };
        }
      }
    ),
  },
};

export default resolvers;
