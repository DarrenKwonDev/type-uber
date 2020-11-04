import jwt from "jsonwebtoken";
import User from "../../entities/User";

interface decodeResponse {
  id: number;
  iat: number;
}

const decodeJWT = async (token: string): Promise<User | undefined> => {
  try {
    //TODO: jwt 내부 payload에 든 정보를 이용하여 유저를 식별한다.
    const decoded = jwt.verify(token, process.env.JWT_TOKEN as string) as decodeResponse;
    const { id } = decoded;

    const user = await User.findOne({ id });

    return user;
  } catch (error) {
    console.log(error.message);
    return undefined;
  }
};

export default decodeJWT;
