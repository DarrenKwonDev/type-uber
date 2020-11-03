import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import path from "path";

const allTypes: GraphQLSchema[] = loadFilesSync(path.join(__dirname, "./api/**/*.graphql"));

const allResolvers = loadFilesSync(
  path.join(__dirname, "./api/**/*.resolvers.*") // 배포시에 ts는 js로 변환되므로 확장자는 *로
);

const mergedTypes = mergeTypeDefs(allTypes);
const mergedResolvers = mergeResolvers(allResolvers);

const schema = makeExecutableSchema({ typeDefs: mergedTypes, resolvers: mergedResolvers });

export default schema;
