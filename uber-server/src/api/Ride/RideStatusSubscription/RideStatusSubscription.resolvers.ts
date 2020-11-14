import { withFilter } from "graphql-yoga";

const resolvers = {
  Subscription: {
    RideStatusSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          return pubSub.asyncIterator("rideUpdate");
        },
        (root, args, { context }) => {
          // root는 pubSub이 publish를 통해 반환한 값을 가지고 있습니다.
          // context는 app에서 반환한 currentUser가 들어 있습니다.
          const { currentUser } = context; // 해당 subscription을 호출한 driver.

          const {
            RideStatusSubscription: { driverId, passengerId },
          } = root;

          // 운전자나 탑승자만 확인해야 함
          const returnValue = currentUser.id === driverId || currentUser.id === passengerId;

          return returnValue;
        }
      ),
    },
  },
};

export default resolvers;
