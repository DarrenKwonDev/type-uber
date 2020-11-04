import User from "../../../entities/User";
import { EmailSignInMutationArgs, EmailSignInResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import createJWT from "../../utils/createJWT";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignIn: async (_, args: EmailSignInMutationArgs): Promise<EmailSignInResponse> => {
      const { email, password } = args;
      try {
        const user = await User.findOne({ email });

        // 유저가 없는 경우
        if (!user) {
          return {
            ok: false,
            error: "No User found with that email",
            token: null,
          };
        }

        // DB에 유저가 있다면? password check 진행
        const checkPassword = await user.comparePassword(password);
        if (checkPassword) {
          const token = createJWT(user.id);
          return {
            ok: true,
            error: null,
            token,
          };
        } else {
          return {
            ok: false,
            error: "Wrong password",
            token: null,
          };
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }
    },
  },
};

export default resolvers;
