import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import AddPlace from "../../Routes/AddPlace"
import EditAccount from "../../Routes/EditAccount";
import FindAddress from "../../Routes/FindAddress";
import Home from "../../Routes/Home";
import Login from "../../Routes/Login";
import PhoneLogin from "../../Routes/PhoneLogin";
import Places from "../../Routes/Places";
import Ride from "../../Routes/Ride";
import Settings from "../../Routes/Settings";
import SocialLogin from "../../Routes/SocialLogin";
import VerifyPhone from "../../Routes/VerifyPhone";

interface IProps {
    isLoggedIn: boolean
}

function AppPresenter({ isLoggedIn }: IProps) {
    return <>
        <BrowserRouter>
            {isLoggedIn ? <LoggedInRoutes /> : <LoggedOutRoutes />}
        </BrowserRouter>
    </>
}

// 로그인된 상태일 때 사용할 router들
function LoggedInRoutes() {
    return <Switch>
        <Route path={"/"} exact={true} component={Home} />
        <Route path={"/ride"} exact={true} component={Ride} />
        <Route path={"/edit-account"} exact={true} component={EditAccount} />
        <Route path={"/settings"} exact={true} component={Settings} />
        <Route path={"/places"} exact={true} component={Places} />
        <Route path={"/add-place"} exact={true} component={AddPlace} />
        <Route path={"/find-address"} exact={true} component={FindAddress} />
        <Redirect from={"*"} to={"/"} />
    </Switch>
}

// 로그아웃된 상태일 때 사용할 router들
function LoggedOutRoutes() {
    return <Switch>
        <Route path={"/"} exact={true} component={Login} />
        <Route path={"/phone-login"} component={PhoneLogin} />
        <Route path={"/verify-phone/:number"} component={VerifyPhone} />
        <Route path={"/social-login"} component={SocialLogin} />
        <Redirect from={"*"} to={"/"} />
    </Switch>

}



export default AppPresenter