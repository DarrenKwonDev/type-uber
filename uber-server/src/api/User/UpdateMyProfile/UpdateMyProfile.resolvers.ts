import User from "../../../entities/User";
import { UpdateMyProfileMutationArgs, UpdateMyProfileResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import cleanNullArgs from "../../utils/cleanNullArgs";
import privateResolver from "../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (_, args: UpdateMyProfileMutationArgs, context): Promise<UpdateMyProfileResponse> => {
        const user: User = context.req.user;

        const notNull = cleanNullArgs(args);

        // @BeforeUpdate 리스너 사용을 위해 인스턴스 업데이트를 하기 위함
        if (notNull.password !== null && args.password !== null) {
          user.password = args.password;
          user.save(); // 인스턴스를 조작하였으므로 @BeforeUpdate가 트리거 됨
          delete notNull.password; // 평문 password를 저장하면 안되므로 notNull 객체에서 지워주자
        }

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
