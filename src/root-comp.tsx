import * as React from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import LoginComp from './components/auth/login';
import RequestSignIn from './components/auth/request-signin';
import App from './app';

import { firebase } from './firebase';
import { Loader, Header, Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './style.css';

type RootCompState = {
    loading: boolean
}

export default class RootComponent extends React.Component<any, RootCompState> {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentWillMount() {
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({ loading: false });
        });
    }

    render() {
        let mainComponent: any = App;
        if (!firebase.auth().currentUser) {
            mainComponent = RequestSignIn;
        }

        return (
            <Router>
                {
                    this.state.loading ?
                        <Loader indeterminate active={this.state.loading}>Lade Website</Loader>
                        :
                        <Container>
                            <Header as='h1'>Room-Manager</Header>
                            <Switch>
                                <Route path='/login' component={LoginComp} />
                                <Route path='/register' component={LoginComp} />
                                <Route component={mainComponent} />
                            </Switch>
                        </Container>
                }
            </Router>
        )
    }
}