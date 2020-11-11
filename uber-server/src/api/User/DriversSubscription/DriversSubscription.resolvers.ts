import { withFilter } from "graphql-yoga";

const resolvers = {
  Subscription: {
    DriversSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          return pubSub.asyncIterator("driverUpdate");
        },
        (root, _, { context }) => {
          // root는 pubSub이 publish를 통해 반환한 값을 가지고 있습니다.
          // context는 app에서 반환한 currentUser가 들어 있습니다.
          const {
            currentUser: { lat: userLastLat, lng: userLastLng },
          } = context; // 현재 로그인한 유저 객체
          const {
            DriversSubscription: { lat: driverLastLat, lng: driverLastLng }, // driver에 대한 내용들
          } = root;

          // +- 0.05 인 드라이버만 확인하도록
          const returnValue =
            driverLastLat >= userLastLat - 0.05 &&
            driverLastLat <= userLastLat + 0.05 &&
            driverLastLng >= userLastLat - 0.05 &&
            driverLastLng <= userLastLng + 0.05;

          return returnValue;
        }
      ),
    },
  },
};
export default resolvers;
