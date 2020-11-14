import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";
import { SendChatMessageMutationArgs, SendChatMessageResponse } from "../../../types/graph";
import User from "../../../entities/User";
import Message from "../../../entities/Message";
import Chat from "../../../entities/Chat";

const resolvers: Resolvers = {
  Mutation: {
    SendChatMessage: privateResolver(
      async (_, args: SendChatMessageMutationArgs, { req, pubSub }): Promise<SendChatMessageResponse> => {
        const user: User = req.user;

        try {
          const chat = await Chat.findOne({ id: args.chatId });
          if (chat) {
            if (chat.passengerId === user.id || chat.driverId === user.id) {
              // 누군가가 메세지를 보냈다는 것임
              const message = await Message.create({
                text: args.text,
                chat,
                user,
              }).save();

              // MessageSubscription이 동작해야 함

              console.log(message);
              pubSub.publish("newChatMessage", { MessageSubscription: message });

              return { ok: true, error: null, message };
            } else {
              return { ok: false, error: "you are not authorized", message: null };
            }
          } else {
            return { ok: false, error: "chat not found", message: null };
          }
        } catch (error) {
          return { ok: false, error: error.message, message: null };
        }
      }
    ),
  },
};

export default resolvers;
