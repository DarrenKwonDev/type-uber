import User from "../../../entities/User";
import { UpdateMyProfileMutationArgs, UpdateMyProfileResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (_, args: UpdateMyProfileMutationArgs, context): Promise<UpdateMyProfileResponse> => {
        const user: User = context.req.user;

        // 주의할 점이, args 중 입력하지 않은 부분을 그대로 업데이트 시켜버린다면
        // 기존값을 null로 overwrite해버릴 수 있습니다.

        // 때문에 null이 아닌 것만 notNull에 담은 후 뿌려줍시다.
        const notNull = {};
        Object.keys(args).forEach((key) => {
          if (args[key] !== null) {
            notNull[key] = args[key];
          }
        });

        try {
          await User.update({ id: user.id }, { ...notNull });

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
