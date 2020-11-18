import React from "react";
import styled from "styled-components";

const Thing = styled.div<{ theme: any }>`
    background-color: ${props => props.theme.blueColor}
`

interface IProps {
    isLoggedIn: boolean
}

function AppPresenter({ isLoggedIn }: IProps) {
    return <>
        {isLoggedIn ? <Thing>you loged in</Thing> : <Thing>you logged out</Thing>}
    </>
}


export default AppPresenter