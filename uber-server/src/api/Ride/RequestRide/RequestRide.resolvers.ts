import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";
import { RequestRideMutationArgs, RequestRideResponse } from "../../../types/graph";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
  Mutation: {
    RequestRide: privateResolver(
      async (_, args: RequestRideMutationArgs, { req }): Promise<RequestRideResponse> => {
        const user: User = req.user;
        try {
          const ride: Ride = await Ride.create({ ...args, passenger: user }).save();

          if (ride) {
            return { ok: true, error: null, ride };
          } else {
            return { ok: false, error: "Can't create Ride instance", ride: null };
          }
        } catch (error) {
          return { ok: false, error: error.message, ride: null };
        }
      }
    ),
  },
};

export default resolvers;
