const privateResolver = (resolverFunc) => async (parent, args, context, info) => {
  if (!context.req.user) {
    throw new Error("No JWT. I refuse to proceed");
  }

  // req.user가 있다면 전달받은 resolverFunc을 실행한다.
  const resolved = await resolverFunc(parent, args, context, info);

  return resolved;
};

export default privateResolver;
