import React from "react";
import {BrowserRouter, HashRouter} from "react-router-dom";
import {Route, Switch} from "react-router";
import {NavbarComponent} from "./components/NavbarComponent";

import HomePage from "./pages/HomePage";
import DownloadsPage from "./pages/DownloadsPage";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";

export default class App extends React.Component {

    render() {
        return (
            <div className='content'>
                <BrowserRouter>
                    <NavbarComponent/>
                    <Switch>
                        <Route exact path='/home' component={HomePage}/>
                        <Route exact path='/home/downloads' component={DownloadsPage}/>
                        <Route exact path='/home/about' component={AboutPage}/>
                        <Route exact path='/admin' component={AdminPage}/>
                        <Route exact path='/' component={HomePage}/>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}
