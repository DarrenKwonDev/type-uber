import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import { RequestEmailVerificationResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";
import { sendVerificationEmail } from "../../utils/sendEmail";

const resolvers: Resolvers = {
  Mutation: {
    RequestEmailVerification: privateResolver(
      async (_, __, context, info): Promise<RequestEmailVerificationResponse> => {
        const user: User = context.req.user;
        if (user.email && !user.verifiedEmail) {
          try {
            const oldVerification = await Verification.findOne({ payload: user.email });
            if (oldVerification) {
              oldVerification.remove();
            }

            const newVerification = await Verification.create({ payload: user.email, target: "EMAIL" }).save();
            await sendVerificationEmail(user.fullName, newVerification.key);
            return { ok: true, error: null };
          } catch (error) {
            return { ok: false, error: error.message };
          }
        } else {
          if (user.verifiedEmail) {
            return { ok: false, error: "You already verified your email" };
          }
          return { ok: false, error: "Your user has no email to verify" };
        }
      }
    ),
  },
};

export default resolvers;
