import { withFilter } from "graphql-yoga";

const resolvers = {
  Subscription: {
    NearbyRideSubscription: {
      subscribe: withFilter(
        (_, __, { pubSub }) => {
          return pubSub.asyncIterator("rideRequest");
        },
        (root, _, { context }) => {
          // root는 pubSub이 publish를 통해 반환한 값을 가지고 있습니다.
          // context는 app에서 반환한 currentUser가 들어 있습니다.

          const {
            currentUser: { lat: userLat, lng: userLng },
          } = context; // 해당 subscription을 호출한 driver.

          const {
            NearbyRideSubscription: { pickUpLat, pickUpLng },
          } = root; // publish한 곳의 정보

          // +- 0.05 인 드라이버만 확인하도록
          const returnValue =
            pickUpLat >= userLat - 0.05 &&
            pickUpLat <= userLat + 0.05 &&
            pickUpLng >= userLng - 0.05 &&
            pickUpLng <= userLng + 0.05;

          return returnValue;
        }
      ),
    },
  },
};

export default resolvers;
