import jwt from "jsonwebtoken";

const createJWT = (userId: number): string => {
  const token = jwt.sign({ id: userId }, process.env.JWT_TOKEN as string);
  return token;
};

export default createJWT;
