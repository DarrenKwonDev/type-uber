import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";
import { RequestRideMutationArgs, RequestRideResponse } from "../../../types/graph";
import User from "../../../entities/User";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
  Mutation: {
    RequestRide: privateResolver(
      async (_, args: RequestRideMutationArgs, { req, pubSub }): Promise<RequestRideResponse> => {
        const user: User = req.user;

        // 요청 상태라면 또 요청을 날릴 수 없음.
        if (!user.isRiding) {
          try {
            const ride: Ride = await Ride.create({ ...args, passenger: user }).save();

            // 유저가 라이딩을 요청하였으므로 true로 바꿔주자
            user.isRiding = true;
            user.save();

            pubSub.publish("rideRequest", { NearbyRideSubscription: ride });

            return { ok: true, error: null, ride };
          } catch (error) {
            return { ok: false, error: error.message, ride: null };
          }
        } else {
          return { ok: false, error: "you can't request two ride", ride: null };
        }
      }
    ),
  },
};

export default resolvers;
