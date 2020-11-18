import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import {
    Container,
    Header,
    Logo,
    Title,
    Footer,
    Subtitle,
    FakeInput,
    PhoneLogin,
    Grey,
    SocialLogin,
    SocialLink
} from "./style/Styled"

interface IProps extends RouteComponentProps<any> {
    isLoggedIn: boolean
}

function OutHomePresenter(props: IProps) {
    return (
        <Container>
            <Header>
                <Logo>
                    <Title>uber</Title>
                </Logo>
            </Header>
            <Footer>
                <PhoneLogin>
                    <Subtitle>Get moving with Nuber</Subtitle>
                    <FakeInput>
                        🇰🇷 +82 <Grey>Enter your mobile number</Grey>
                    </FakeInput>
                </PhoneLogin>
                <SocialLogin>
                    <SocialLink>Or connect with social</SocialLink>
                </SocialLogin>
            </Footer>
        </Container>
    )
}

export default OutHomePresenter
