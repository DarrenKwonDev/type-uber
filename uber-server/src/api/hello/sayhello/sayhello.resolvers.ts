import { HelloResponse, SayHelloQueryArgs } from "src/types/graph"

const resolvers = {
    Query: {
        sayHello: (parent, args:SayHelloQueryArgs): HelloResponse => {
            return { 
                text: `hello ${args.name}`,
                error: false
            }
        }
    }
}

export default resolvers