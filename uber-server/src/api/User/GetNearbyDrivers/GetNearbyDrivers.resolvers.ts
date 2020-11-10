import { Between, getRepository } from "typeorm";
import User from "../../../entities/User";
// import { GetNearbyDriversResponse } from "../../../types/graph";
import { Resolvers } from "../../../types/resolvers";
import privateResolver from "../../utils/privateResolver";

const resolvers: Resolvers = {
  Query: {
    GetNearbyDrivers: privateResolver(
      // Promise<GetNearbyDriversResponse>가 안됨
      async (_, __, context): Promise<any> => {
        const user: User = await context.req.user;
        const { lat, lng } = user;

        // 가까운 드라이버는 여러 명이 존재할 수 있으므로 find 메서드 사용
        // 옵션에 대해서는 https://github.com/typeorm/typeorm/blob/master/docs/find-options.md#advanced-options 참고

        try {
          const drivers: User[] = await getRepository(User).find({
            isDriving: true,
            lat: Between(lat - 0.05, lat + 0.05),
            lng: Between(lng - 0.05, lng + 0.05),
          });

          return {
            ok: true,
            error: null,
            drivers,
          };
        } catch (error) {
          return {
            ok: true,
            error: error.message,
            drivers: null,
          };
        }
      }
    ),
  },
};

export default resolvers;
