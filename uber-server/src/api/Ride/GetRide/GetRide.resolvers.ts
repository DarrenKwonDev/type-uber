import User from "../../../entities/User";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";
import { GetRideResponse, GetRideQueryArgs } from "../../../types/graph";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
  Query: {
    GetRide: privateResolver(
      async (_, args: GetRideQueryArgs, { req }): Promise<GetRideResponse> => {
        const user: User = req.user;
        try {
          const ride = await Ride.findOne({
            id: args.rideId,
          });

          if (ride) {
            if (ride.passengerId === user.id || ride.driverId === user.id) {
              return {
                ok: true,
                error: null,
                ride,
              };
            } else {
              return {
                ok: false,
                error: "Not Authorized",
                ride: null,
              };
            }
          } else {
            return {
              ok: false,
              error: "Ride not found",
              ride: null,
            };
          }
        } catch (error) {
          return {
            ok: false,
            error: error.message,
            ride: null,
          };
        }
      }
    ),
  },
};

// const resolvers: Resolvers = {
//   Query: {
//     GetRide: privateResolver(
//       async (_, args: GetRideQueryArgs, { req }): Promise<GetRideResponse> => {
//         const user: User = await req.user;

//         try {
//           const ride = await Ride.findOne({ id: args.rideId });

//           // 왜 안되니...
//           console.log(ride);

//           if (ride) {
//             // 해당 ride를 이용 중인 유저와 드라이버만 조회할 수 있어야 함
//             if (ride.passengerId === user.id || ride.driverId === user.id) {
//               return {
//                 ok: true,
//                 error: null,
//                 ride,
//               };
//             } else {
//               return {
//                 ok: false,
//                 error: "Not Authorized",
//                 ride: null,
//               };
//             }
//           } else {
//             return {
//               ok: false,
//               error: "Ride not found",
//               ride: null,
//             };
//           }
//         } catch (error) {
//           return { ok: false, error: error.message, ride: null };
//         }
//       }
//     ),
//   },
// };

export default resolvers;
