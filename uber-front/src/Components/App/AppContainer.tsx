import React from 'react'
import { graphql } from "react-apollo"
import { IS_LOGGED_IN } from "./AppQueries"
import AppPresenter from "./AppPresenter"
import GlobalStyle from '../../globalStyles'

const AppContainer: React.FC<any> = ({ data }) => {
    console.log(data);

    return (
        <>
            <GlobalStyle />
            <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
        </>
    )
}

// 매번 IS_LOGGED_IN를 날리도록 처리
export default graphql(IS_LOGGED_IN)(AppContainer)
