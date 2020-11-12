import { Between } from "typeorm";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { GetNearbyRideResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";

const resolvers: Resolvers = {
  Query: {
    GetNearbyRide: privateResolver(
      async (_, __, { req }): Promise<GetNearbyRideResponse> => {
        const user: User = req.user;

        // 드라이버가 일감을 찾는 것이므로 드라이버만 가능하게 하자
        if (user.isDriving) {
          const { lat, lng } = user;

          try {
            // 내 주변 일감을 찾아보자
            const ride = await Ride.findOne({
              status: "REQUESTING",
              pickUpLat: Between(lat - 0.05, lat + 0.05),
              pickUpLng: Between(lng - 0.05, lng + 0.05),
            });
            if (ride) {
              return { ok: true, error: null, ride };
            } else {
              // 주변에 일감이 없는 건 에러가 아니다. 단순히 null을 리턴한다.
              return { ok: true, error: null, ride: null };
            }
          } catch (error) {
            return { ok: false, error: error.message, ride: null };
          }
        } else {
          return { ok: false, error: "you are not a driver!", ride: null };
        }
      }
    ),
  },
};

export default resolvers;
