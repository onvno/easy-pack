import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'

import auth from './auth/base/auth'; 
import rootReducers from './rootReducer';
import storeFactory from './storeFactory';
// import router from './routers';

import App from "./app";
import './index.less';

let store = storeFactory()(rootReducers);
let root = document.getElementById('root');


/**
 * 需要校验用户是否登录
 * 未登录时，需要重定向到SSO登录页面
 */
const renderApp = () => {
    ReactDOM.render(
        <Provider store={store}>
            <HashRouter>
                {/* <div>
                <div>Header</div>
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <Route path="/about" component={About} />
                    </Switch>
                </div> */}
                <Route path="/" component={App} />
            </HashRouter>
        </Provider>,
        root
    )  
}

auth(store, ()=> {
    renderApp();
    if(module && module.hot) {
        module.hot.accept(['./index'], () => {
            renderApp();
        });
    }
})