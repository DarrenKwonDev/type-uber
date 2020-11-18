import ApolloClient, { Operation } from "apollo-boost";

// Pass your GraphQL endpoint to uri
// 해당 설정은 apollo-link를 사용한 것이며, 자세한 설명은 https://www.apollographql.com/docs/link/overview/#gatsby-focus-wrapper 에서 확인 가능함.

const LS_JWT_NAME = "jwt";

const client = new ApolloClient({
  // 백엔드를 거치지 않고 client 단에서 hoc에서 덧씌워주는 방식으로 처리하기 때문에 local state라고 합니다.
  clientState: {
    // State에서 defaults는 redux로 치면 initialState와 비슷한 설정임.
    // defaults는 resolvers의 context.cacahe에 들어감
    defaults: {
      auth: {
        __typename: "Auth",
        isLoggedIn: Boolean(localStorage.getItem(LS_JWT_NAME)),
      },
    },
    // clientState를 조작하기 위한 resolvers들. clientstate들은 context 부분의 cache에 쌓임.
    resolvers: {
      Mutation: {
        logUserIn: (root, { token }, { cache }) => {
          localStorage.setItem(LS_JWT_NAME, token);
          cache.writeData({
            data: {
              auth: {
                __typename: "Auth",
                isLoggedIn: true,
              },
            },
          });
          return null;
        },
        logUserOut: (root, args, { cache }) => {
          localStorage.removeItem(LS_JWT_NAME);
          cache.writeData({ data: { __typename: "Auth", isLoggedIn: false } });
          return null;
        },
      },
    },
  },
  //  모든 req에 header를 달아주고 싶으므로 설정하자. req 객체를 모든 오퍼레이션에서 접근할 수 있도록 허용해 줌. 유용~
  request: async (operation: Operation) => {
    operation.setContext({
      headers: {
        "X-JWT": localStorage.getItem(LS_JWT_NAME) || "",
      },
    });
  },
  uri: "http://localhost:5000/playground",
});

export default client;
