import React from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import { Helmet } from "react-helmet"
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
        <>
            <Helmet>
                <title>Login | uber</title>
            </Helmet>
            <Container>
                <Header>
                    <Logo>
                        <Title>uber</Title>
                    </Logo>
                </Header>
                <Footer>
                    <Link to={"/phone-login"}>
                        <PhoneLogin>
                            <Subtitle>Get moving with Nuber</Subtitle>
                            <FakeInput>
                                🇰🇷 +82 <Grey>Enter your mobile number</Grey>
                            </FakeInput>
                        </PhoneLogin>
                    </Link >
                    <Link to={"/social-login"}>
                        <SocialLogin>
                            <SocialLink>Or connect with social</SocialLink>
                        </SocialLogin>
                    </Link >
                </Footer>
            </Container>
        </>
    )
}

export default OutHomePresenter
