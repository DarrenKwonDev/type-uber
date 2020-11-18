import React from 'react'
import { graphql } from "react-apollo"
import { IS_LOGGED_IN } from "./AppQueries"
import AppPresenter from "./AppPresenter"
import GlobalStyle from '../../globalStyles'

const AppContainer: React.FC<any> = ({ data }) => {
    return (
        <>
            <GlobalStyle />
            <div>
                <div>
                    {JSON.stringify(data)}
                </div>
                <AppPresenter isLoggedIn={data.auth.isLoggedIn} />
                <button>what</button>
            </div>
        </>
    )
}

// 매번 IS_LOGGED_IN를 날리도록 처리
export default graphql(IS_LOGGED_IN)(AppContainer)
