import Verification from "../../../entities/Verification";
import {
  StartPhoneVerificationMutationArgs,
  StartPhoneVerificationResponse,
} from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import { sendVerificationSMS } from "../../utils/sendSMS";

const resolvers: Resolvers = {
  Mutation: {
    //TODO: 문자 인증을 위해 메세지를 보내기
    StartPhoneVerification: async (
      _,
      args: StartPhoneVerificationMutationArgs
    ): Promise<StartPhoneVerificationResponse> => {
      const { phoneNumber } = args;
      try {
        const existingVerification = await Verification.findOne({ payload: phoneNumber });
        if (existingVerification) {
          existingVerification.remove();
        }

        // key의 경우 BeforeInsert 리스너를 통해 자동 생성됨.
        const newVerification = await Verification.create({
          payload: phoneNumber,
          target: "PHONE",
        }).save();

        await sendVerificationSMS(newVerification.payload, newVerification.key);

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
    },
  },
};

export default resolvers;
