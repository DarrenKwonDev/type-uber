import { withFilter } from "graphql-yoga";
import Chat from "../../../../entities/Chat";

const resolvers = {
  Subscription: {
    MessageSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          return pubSub.asyncIterator("newChatMessage");
        },
        async (root, _, { context }) => {
          // root는 pubSub이 publish를 통해 반환한 값을 가지고 있습니다.
          // context는 app에서 반환한 currentUser가 들어 있습니다.
          const { currentUser } = context; // 해당 subscription을 호출한 driver.

          const {
            MessageSubscription: { chatId },
          } = root; // publish한 곳의 정보

          try {
            const chat = await Chat.findOne({ id: chatId });
            if (chat) {
              return chat.driverId === currentUser.id || chat.passengerId === currentUser.id;
            } else {
              return false;
            }
          } catch (error) {
            return false;
          }
        }
      ),
    },
  },
};

export default resolvers;
