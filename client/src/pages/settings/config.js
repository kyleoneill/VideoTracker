import React from 'react';
import {
    Table
} from 'react-bootstrap';
import ModalConfirmDelete from '../../components/confirmDelete';
import NewCategory from '../../components/modalNewCategory';

class ConfigSettings extends React.Component {
    render() {
        return(
            <>
                <h4>Config Settings for {this.props.username}</h4>
                <div className="category-display">
                    <h5>Categories</h5>
                    <NewCategory callback={this.props.categoryCreate} />
                    <Table striped bordered className="center">
                        <thead>
                            <tr>
                                <th>Category Name</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.categories && this.props.categories.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <td key={index + "-category"}>{value.name}</td>
                                        <td key={index + "-remove"} className="entity remove">
                                            <ModalConfirmDelete objectType={"Category"} objectName={value.name} onConfirm={() => this.props.categoryDelete(value.name)}/>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </>
        );
    }
}

export default ConfigSettings;