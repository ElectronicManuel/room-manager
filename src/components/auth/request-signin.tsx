import * as React from 'react';
import { Container, Message, Button } from 'semantic-ui-react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

class RequestSignInComponent extends React.Component<RouteComponentProps<any, any>, any> {
    render() {
        return (
            <Container>
                <Message error>Du musst angemeldet sein um diese Seite zu sehen</Message>
                <Button floated='left' primary onClick={() => {this.props.history.push('/login')}}>Anmelden</Button>
            </Container>
        );
    }
}

export default withRouter(RequestSignInComponent);