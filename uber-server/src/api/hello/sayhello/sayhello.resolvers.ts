import { Greeting } from "src/types/graph"

const resolvers = {
    Query: {
        sayHello: (): Greeting => {
            return { 
                text: "hello",
                error: false
            }
        }
    }
}

export default resolvers