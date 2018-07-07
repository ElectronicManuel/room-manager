import * as React from 'react';
import { Switch, Route, BrowserRouter as Router, withRouter, Link } from 'react-router-dom';
import LoginComp from './components/auth/login';
import RequestSignIn from './components/auth/request-signin';
import App from './app';

import { firebase, firestore } from './firebase';
import { Loader, Header, Container, Segment, Button, Grid, Menu } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './style.css';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { RouterProps } from 'react-router';

type RootCompState = {
    loading: boolean,
    user?: firebase.User | null,
    userDetails?: RoomManager.User
}

const RootComponent = withRouter(class Root extends React.Component<RouterProps, RootCompState> {

    unsubscribeAuth?: firebase.Unsubscribe
    unsubscribeFromUserData?: () => any

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentWillUnmount() {
        if(this.unsubscribeAuth) this.unsubscribeAuth();
        if(this.unsubscribeFromUserData) this.unsubscribeFromUserData();
    }

    componentWillMount() {
        this.unsubscribeAuth = firebase.auth().onAuthStateChanged(async (user) => {
            if(user) {
                this.unsubscribeFromUserData = firestore.collection('users').doc(user.uid).onSnapshot((snap) => {
                    let userDetails: RoomManager.User | undefined = undefined;

                    const fetchData = snap.data();
                    if(fetchData) {
                        let role: RoomManager.Role = fetchData.role;
                        switch(fetchData.role as string) {
                            case 'verwaltung':
                                role = 'Verwaltung';
                                break;
                            case 'hauswart':
                                role = 'Hauswart';
                                break;
                            default:
                                role = 'User';
                                break;
                        }

                        const displayName = fetchData.displayName;

                        userDetails = {
                            role: role,
                            displayName: displayName,
                        }
                    }
                    this.setState({ loading: false, user, userDetails });
                });
            } else {
                if(this.unsubscribeFromUserData) this.unsubscribeFromUserData();
                this.setState({ loading: false, user: undefined, userDetails: undefined });
            }
        });
    }

    getMenuItems() {
        const menuItems = [
            <Link to='/' key={1}>
                <Menu.Item name='Home' active={this.props.history.location.pathname == '/'} />
            </Link>
        ];
        
        if(this.state.userDetails) {
            if(this.state.userDetails.role == 'Verwaltung') {
                menuItems.push(
                    <Link to='/users' key={3}>
                        <Menu.Item name='Benutzer' active={this.props.history.location.pathname == '/users'} />
                    </Link>
                );
            }
        } else {
            menuItems.push(
                <Link to='/login' key={3}>
                    <Menu.Item name='Anmelden' active={this.props.history.location.pathname == '/login'} />
                </Link>
            );
        }

        return menuItems;
    }

    render() {
        let mainComponent: any;
        
        if (!this.state.userDetails) {
            mainComponent = RequestSignIn;
        } else {
            mainComponent = (props) => (<App userDetails={(this.state.userDetails as RoomManager.User)} />);
        }

        let topBarButton: JSX.Element = <Button floated='right' primary onClick={() => {this.props.history.push('/login')}}>Anmelden</Button>

        if(this.state.userDetails) {
            topBarButton = <Button content='Abmelden' color='red' floated='right' labelPosition='left' onClick={() => {firebase.auth().signOut()}} label={{basic: false, content: this.state.userDetails.displayName, detail: this.state.userDetails.role}} />
        }

        if(this.state.loading) {
            return <Loader indeterminate active={this.state.loading}>Lade Website</Loader>
        }

        return (
            <div>
                <Segment>
                    <Grid stackable>
                        <Grid.Row columns={2}> 
                            <Grid.Column>
                                <Header as='h1'>Room-Manager</Header>
                            </Grid.Column>
                            <Grid.Column>
                                {topBarButton}
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column>
                                <Menu stackable>
                                    {this.getMenuItems()}
                                </Menu>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Container>
                    
                    <Switch>
                        <Route path='/login' component={LoginComp} />
                        <Route path='/register' component={LoginComp} />
                        <Route component={mainComponent}  />
                    </Switch>
                </Container>
            </div>
        )
    }
})

const RouterWrapper: React.SFC = (props) => {

    return (
        <Router>
            <RootComponent />
        </Router>
    )
}
export default RouterWrapper;