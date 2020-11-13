import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { UpdateRideStatusMutationArgs, UpdateRideStatusResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";

// const resolvers: Resolvers = {
//   Mutation: {
//     UpdateRideStatus: privateResolver(
//       async (_, args: UpdateRideStatusMutationArgs, { req }): Promise<UpdateRideStatusResponse> => {
//         const user: User = req.user;

//         // 드라이버만이 rideStatus를 수정할 수 있다.
//         if (user.isDriving) {
//           try {
//             let ride: Ride | undefined;

//             // driver가 ACCEPTED를 누르면 status를 바꾸고 해당 ride(일감)에 운전자를 할당한다.
//             if (args.status === "ACCEPTED") {
//               ride = await Ride.findOne({ id: args.rideId, status: "REQUESTING" });

//               if (ride) {
//                 ride.driver = user; // 저장은 하단 status 바꾸면서 할거임. 굳이 save 두번할 필요 x

//                 // 한편 운전자는 ride(일감)을 선택했으므로 isTakne을 true로
//                 user.isTaken = true;
//                 user.save();
//               }
//             } else {
//               // 수락이 아니라 취소등 다른 status로 바꾸기 위함. 당연히 내가 운전하고 있는 것만 바꿔야 함
//               ride = await Ride.findOne({ id: args.rideId, driver: user });
//             }

//             // 앞서 찾은 ride의 status를 바꿔보자
//             if (ride) {
//               ride.status = args.status;
//               ride.save();
//               return {
//                 ok: true,
//                 error: null,
//               };
//             } else {
//               // 수정하고자 하는 ride가 없음
//               return {
//                 ok: false,
//                 error: "Can't find ride",
//               };
//             }
//           } catch (error) {
//             return {
//               ok: false,
//               error: error.message,
//             };
//           }
//         } else {
//           // 요청한 사람이 driver가 아님
//           return {
//             ok: false,
//             error: "You're not a driver",
//           };
//         }
//       }
//     ),
//   },
// };

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (_, args: UpdateRideStatusMutationArgs, { req, pubSub }): Promise<UpdateRideStatusResponse> => {
        const user: User = req.user;

        if (user.isDriving) {
          try {
            let ride: Ride | undefined;

            if (args.status === "ACCEPTED") {
              ride = await Ride.findOne({
                id: args.rideId,
                status: "REQUESTING",
              });

              if (ride) {
                ride.driver = user;
                user.isTaken = true;
                user.save();
              }
            } else {
              ride = await Ride.findOne({
                id: args.rideId,
                driver: user,
              });
            }
            if (ride) {
              ride.status = args.status;
              ride.save();
              pubSub.publish("rideUpdate", { RideStatusSubscription: ride });
              return {
                ok: true,
                error: null,
              };
            } else {
              return {
                ok: false,
                error: "Cant update ride",
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message,
            };
          }
        } else {
          return {
            ok: false,
            error: "You are not driving",
          };
        }
      }
    ),
  },
};

export default resolvers;
