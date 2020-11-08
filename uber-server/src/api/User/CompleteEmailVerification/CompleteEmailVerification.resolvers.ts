import User from "../../../entities/User";
import Verification from "../../../entities/Verification";
import { CompleteEmailVerificationMutationArgs, CompleteEmailVerificationResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    CompleteEmailVerification: privateResolver(
      async (_, args: CompleteEmailVerificationMutationArgs, context, info): Promise<CompleteEmailVerificationResponse> => {
        const user: User = context.req.user;
        if (user.email) {
          try {
            const verification = await Verification.findOne({ key: args.key, payload: user.email });

            if (verification) {
              user.verifiedEmail = true;
              user.save();
              return { ok: true, error: null };
            } else {
              return { ok: false, error: "Can't verify email" };
            }
          } catch (error) {
            return { ok: false, error: error.message };
          }
        } else {
          return { ok: false, error: "No email to verify" };
        }
      }
    ),
  },
};

export default resolvers;
