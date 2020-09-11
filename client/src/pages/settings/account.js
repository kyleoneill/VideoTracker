import React from 'react';
import ChangePassword from '../../components/modalChangePassword';

class AccountSettings extends React.Component {
    render() {
        return(
            <>
                <h4>Account Settings for {this.props.username}</h4>
                <ChangePassword callback={this.props.changePassword}/>
            </>
        );
    }
}

export default AccountSettings;