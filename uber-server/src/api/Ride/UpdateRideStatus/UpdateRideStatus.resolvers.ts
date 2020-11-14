import Chat from "../../../entities/Chat";
import Ride from "../../../entities/Ride";
import User from "../../../entities/User";
import { UpdateRideStatusMutationArgs, UpdateRideStatusResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (_, args: UpdateRideStatusMutationArgs, { req, pubSub }): Promise<UpdateRideStatusResponse> => {
        const user: User = req.user;

        // 운전자만 ride status를 수정할 수 있다.
        if (user.isDriving) {
          try {
            let ride: Ride | undefined;

            // 운전자가 ACCEPTED하는 로직

            if (args.status === "ACCEPTED") {
              ride = await Ride.findOne(
                {
                  id: args.rideId,
                  status: "REQUESTING",
                },
                { relations: ["passenger"] }
              );

              if (ride) {
                ride.driver = user;
                user.isTaken = true;
                user.save();

                console.log("채팅방이 생성됩니다");

                // 운전 요청을 수락했으니 Chat Room 생성 후 저장
                const chat = await Chat.create({ driver: user, passenger: ride.passenger }).save();
                ride.chat = chat;
                ride.save();

                console.log(ride);
              }
            } else {
              ride = await Ride.findOne({
                id: args.rideId,
                driver: user,
              });

              console.log("Accpeted가 아니지만 ride 생성");
              console.log("Accpeted가 아니지만 ride 생성");
              console.log("Accpeted가 아니지만 ride 생성");
              console.log("Accpeted가 아니지만 ride 생성");
              console.log("Accpeted가 아니지만 ride 생성");
            }

            // 운전자가 ACCEPTED 포함, status 변경시 전체적으로 실행되어야 할 로직

            if (ride) {
              ride.status = args.status;
              ride.save();

              console.log("RideStatusSubscription이 동작해야 합니다");
              // save한 뒤의 내용물을 subscription하게 해야 한다.
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
