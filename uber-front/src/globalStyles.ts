import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
    ${reset}
   * {
      box-sizing: border-box;
    }
    body{
        font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
        font-size: 1rem;
    }
    a{ 
        color:inherit;
        text-decoration:none;
    }
    input,
    button{
        &:focus, &:active {
            outline:none
        }
    }
`;

export default GlobalStyle;
