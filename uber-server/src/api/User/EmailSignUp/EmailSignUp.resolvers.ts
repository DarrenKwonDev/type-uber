import { Resolvers } from "../../../types/resolvers";
import { EmailSignUpMutationArgs, EmailSignUpResponse } from "../../../types/graph";
import User from "../../../entities/User";
import createJWT from "../../utils/createJWT";
import Verification from "../../../entities/Verification";
import { sendVerificationEmail } from "../../utils/sendEmail";

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
          //TODO: 기존에 없는 유저이므로 새로 가입시키면 된다.
          const phoneVerification = await Verification.findOne({ payload: args.phoneNumber, verified: true });

          console.log(phoneVerification);

          if (phoneVerification) {
            // phoneVerification이 있다면 email 검증 시작
            const newUser = await User.create({ ...args }).save();

            if (newUser.email) {
              const emailVerification = await Verification.create({ target: "EMAIL", payload: newUser.email }).save();
              await sendVerificationEmail(newUser.fullName, emailVerification.key);
            }

            const token = createJWT(newUser.id);

            return {
              ok: true,
              error: null,
              token,
            };
          } else {
            // phoneVerification이 없으므로 팅겨내기
            return {
              ok: false,
              error: "You should verify your phone number",
              token: null,
            };
          }
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
