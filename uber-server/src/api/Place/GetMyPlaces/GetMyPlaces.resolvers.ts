// import Place from "../../../entities/Place";
import User from "../../../entities/User";
// import { GetMyPlacesResposne } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";

// GetMyPlacesResposne 프로미스로 넣으니 타입에러가 나네
const resolvers: Resolvers = {
  Query: {
    GetMyPlaces: privateResolver(
      async (_, __, context): Promise<any> => {
        try {
          const user: User = (await User.findOne({ id: context.req.user.id }, { relations: ["places"] })) as User;

          if (user) {
            return {
              ok: true,
              error: null,
              places: user.places,
            };
          } else {
            return {
              ok: false,
              error: "User not found",
              places: null,
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            places: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
