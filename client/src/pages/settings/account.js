import React from 'react';

class AccountSettings extends React.Component {
    render() {
        return(
            <h2>Account Settings for {this.props.username}</h2>
        );
    }
}

export default AccountSettings;