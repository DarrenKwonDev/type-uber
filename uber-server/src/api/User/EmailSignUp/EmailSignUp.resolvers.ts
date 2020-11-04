import { Resolvers } from "../../../types/resolvers";
import { EmailSignUpMutationArgs, EmailSignUpResponse } from "../../../types/graph";
import User from "../../../entities/User";
import createJWT from "../../utils/createJWT";

const resolvers: Resolvers = {
  Mutation: {
    EmailSignUp: async (_, args: EmailSignUpMutationArgs): Promise<EmailSignUpResponse> => {
      const { email } = args;
      try {
        const existingUser = await User.findOne({ email });

        //TODO: 해당 email을 이용한 유저가 DB에 있으므로 가입처리시키면 안된다.
        if (existingUser) {
          return {
            ok: false,
            error: "You already create account by using this email. login instead",
            token: null,
          };
        } else {
          //TODO: 토큰 만들자
          const newUser = await User.create({ ...args }).save();
          const token = createJWT(newUser.id);

          return {
            ok: true,
            error: null,
            token,
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
