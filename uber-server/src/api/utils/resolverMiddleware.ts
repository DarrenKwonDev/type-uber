const authResolver = (resolverFunc) => async (parent, args, context, info) => {
  if (!context.req.user) {
    throw new Error("No JWT. I refuse to proceed");
  }
  const resolved = await resolverFunc(parent, args, context, info);
  return resolved;
};

export default authResolver;
