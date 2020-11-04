import { Resolvers } from "../../../types/resolvers";
import { CompletePhoneNumberVerificationMutationArgs, CompletePhoneNumberVerificationResponse } from "../../../types/graph";
import Verification from "../../../entities/Verification";
import User from "../../../entities/User";

const resolvers: Resolvers = {
  Mutation: {
    CompletePhoneNumberVerification: async (
      _,
      args: CompletePhoneNumberVerificationMutationArgs
    ): Promise<CompletePhoneNumberVerificationResponse> => {
      const { phoneNumber, key } = args;
      //TODO: try/catch 구문 내부에 try/catch를 또 쓰는 것은 가독성이 좋지 않기에 try/catch를 2개로 분리

      try {
        const verification = await Verification.findOne({ payload: phoneNumber, key });
        //TODO: 인증이 되지 않았으므로 false 반환
        if (!verification) {
          return {
            ok: false,
            error: "Verification key not valid",
            token: null,
          };
        } else {
          //TODO: 인증이 되었으므로 verified를 true로 변경하되 return 하지 않음.
          // 다음 try/catch를 거쳐야 하기 때문
          verification.verified = true;
          verification.save();
        }
      } catch (error) {
        return {
          ok: false,
          error: error.message,
          token: null,
        };
      }

      //TODO: 위 try/catch문을 통과했다는 것은 곧 인증은 되었다는 의미임

      try {
        const user = await User.findOne({ phoneNumber });

        //TODO: 유저가 있는 경우 verifiedPhonenNumber를 true로 바꿔서 인증 완료로 수정
        if (user) {
          user.verifiedPhoneNumber = true;
          user.save();
          return {
            ok: true,
            error: null,
            token: "Comming soon",
          };
        } else {
          return {
            ok: true,
            error: null,
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
