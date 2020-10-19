export const typeDefs = ["type Query {\n  sayBye: String!\n  sayHello(name: String!): HelloResponse!\n}\n\ntype HelloResponse {\n  text: String!\n  error: Boolean!\n}\n"];
/* tslint:disable */

export interface Query {
  sayBye: string;
  sayHello: HelloResponse;
}

export interface SayHelloQueryArgs {
  name: string;
}

export interface HelloResponse {
  text: string;
  error: boolean;
}
