import React from 'react';

class AccountSettings extends React.Component {
    render() {
        return(
            <h4>Account Settings for {this.props.username}</h4>
        );
    }
}

export default AccountSettings;