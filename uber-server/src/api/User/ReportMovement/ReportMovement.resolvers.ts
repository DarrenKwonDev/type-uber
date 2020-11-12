import User from "../../../entities/User";
import { ReportMovementMutationArgs, ReportMovementResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import cleanNullArgs from "../../utils/cleanNullArgs";
import privateResolver from "../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    ReportMovement: privateResolver(
      async (_, args: ReportMovementMutationArgs, { req, pubSub }): Promise<ReportMovementResponse> => {
        const user: User = req.user;
        const notNull = cleanNullArgs(args);

        console.log(user);

        try {
          //TODO: User entity 부분이 lastOrientation, lastLng 등으로 되어 있는데 이거 이렇게 넣으면 안될텐데
          // 우선 notNull에서 받은 orientation, lng 꼴로 일단 넣을 수 있도록 User entity를 수정함.
          // User.graphql 또한 수정함
          await User.update({ id: user.id }, { ...notNull });

          // 업데이트 한 user 정로를 반환하도록하자.
          const updatedUser = await User.findOne({ id: user.id });

          // subscription 이름과 완전히 동일해야 함. 여기서는 DriversSubscription.graphql에 이용되는 publish임.
          pubSub.publish("driverUpdate", { DriversSubscription: updatedUser });

          return {
            ok: true,
            error: null,
          };
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
