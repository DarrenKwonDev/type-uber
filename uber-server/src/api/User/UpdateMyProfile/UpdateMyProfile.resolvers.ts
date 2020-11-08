import User from "../../../entities/User";
import { UpdateMyProfileMutationArgs, UpdateMyProfileResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";

interface InotNull {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  profilePhoto?: string;
  age?: number;
}

const resolvers: Resolvers = {
  Mutation: {
    UpdateMyProfile: privateResolver(
      async (_, args: UpdateMyProfileMutationArgs, context): Promise<UpdateMyProfileResponse> => {
        const user: User = context.req.user;

        // 주의할 점이, args 중 입력하지 않은 부분을 그대로 업데이트 시켜버린다면
        // 기존값을 null로 overwrite해버릴 수 있습니다.
        // 때문에 null이 아닌 것만 notNull에 담은 후 뿌려줍시다.
        const notNull: InotNull = {};
        Object.keys(args).forEach((key) => {
          if (args[key] !== null) {
            notNull[key] = args[key];
          }
        });

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
