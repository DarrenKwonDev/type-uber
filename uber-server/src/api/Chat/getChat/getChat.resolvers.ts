import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";
import { GetChatQueryArgs, GetChatResponse } from "../../../types/graph";
import User from "../../../entities/User";
import Chat from "../../../entities/Chat";
import Ride from "../../../entities/Ride";

const resolvers: Resolvers = {
  Query: {
    GetChat: privateResolver(
      async (_, args: GetChatQueryArgs, { req, context }): Promise<GetChatResponse> => {
        const user: User = req.user;
        // ----- 개발을 위해 임시적으로
        await User.update({ id: 1 }, { isRiding: false, isTaken: false });
        Ride.delete({});
        user.isTaken = false;
        user.save();
        // ----- 개발을 위해 임시적으로

        try {
          const chat = await Chat.findOne({ id: args.chatId }, { relations: ["messages"] });

          if (chat) {
            if (chat.passengerId === user.id || chat.driverId === user.id) {
              return { ok: true, error: null, chat };
            } else {
              return { ok: false, error: "you are not authorized", chat: null };
            }
          } else {
            return { ok: false, error: "Chat not found", chat: null };
          }
        } catch (error) {
          return { ok: false, error: error.message, chat: null };
        }
      }
    ),
  },
};

export default resolvers;
