import Place from "../../../entities/Place";
import User from "../../../entities/User";
import { EditPlaceMutationArgs, EditPlaceResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import cleanNullArgs from "../../utils/cleanNullArgs";
import privateResolver from "../../utils/privateResolver";

const resolvers: Resolvers = {
  Mutation: {
    EditPlace: privateResolver(
      async (_, args: EditPlaceMutationArgs, context): Promise<EditPlaceResponse> => {
        const user: User = context.req.user;

        try {
          // 수정하고자 하는 place를 찾습니다.
          const place = await Place.findOne({ id: args.placeId });

          // place가 있다면 현재 유저 테이블의 id와 place userId가 일치하는 지 체킹하여
          // place를 수정하려는 사람이 생성한 place인지 체킹합니다.
          if (place) {
            if (place.userId === user.id) {
              // ...args로 뿌리면 placeId까지 들어가니까
              const notNull = cleanNullArgs({ name: args.name, isFav: args.isFav });

              // update
              await Place.update({ id: place.userId }, { ...notNull });
              return { ok: true, error: null };
            } else {
              return { ok: false, error: "Not authorized. Can't find user's place" };
            }
          } else {
            return { ok: false, error: "place not found" };
          }
        } catch (error) {
          return { ok: false, error: error.message };
        }
      }
    ),
  },
};

export default resolvers;
