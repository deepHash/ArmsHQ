import React from 'react'
import {addNewSoldier} from '../../actions/soldierActions';
import { connect } from 'react-redux';
import '../../assets/css/main.css';
import { Form, Button } from 'react-bootstrap';

class EditSolider extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            type: this.props.type || 'new',
            name: this.props.name || '',
            meshId: this.props.meshId || -1,
            bloodType: this.props.bloodType || '',
            role: this.props.role || ''
        }
    }

    renderTitle(){
        var title = '';
        switch(this.state.type){
            case 'new':
                title = 'New Soldier'
                break;
            default:
                title = 'Edit Soldier'
        }
        return <h2>{title}</h2>
    }

    renderButtonText(){
        var title = '';
        switch(this.state.type){
            case 'new':
                title = 'Create'
                break;
            default:
                title = 'Save'
        }
        return title;
    }

    onNameChange(event){
        const name = event.target.value;
        this.setState({name})
    }

    onMeshIdChange(event){
        const meshId = event.target.value;
        if(meshId > 0)
            this.setState({meshId})
    }

    onBloodTypeChange(event){
        const bloodType = event.target.value;
        this.setState({bloodType})
    }
    onRoleChange(event){
        const role = event.target.value;
        this.setState({role})
    }
    onImgChange(event){
        const image = event.target.value;
        this.setState({image})
    }
    onSubmitForm(){
        switch(this.state.type){
            case 'new':
                this.onCreate(this.state)
                break;
            default:
                this.onEdit();
        }
    }
    onEdit(){
        console.log('edit');
    }

    onCreate({name,meshId,bloodType,role,image}){
        this.props.addNewSoldier({name,meshId,bloodType,role,image});
        this.setState({name:'',meshId:'-1',bloodType:'',role:''});
        this.props.onAddSoldier();
    }
    render(){
        return(
            <Form>
                {this.renderTitle()}
                <Form.Group controlId="formGridName">
                    <Form.Label>Name: </Form.Label>
                    <Form.Control type="text" value={this.state.name} onChange={this.onNameChange.bind(this)}/>
                </Form.Group>
                <Form.Group controlId="formGridMeshID">
                    <Form.Label>Mesh ID: </Form.Label>
                    <Form.Control type="number" value={this.state.meshId} onChange={this.onMeshIdChange.bind(this)}/>
                </Form.Group>

                <Form.Group controlId="formGridBloodType">
                    <Form.Label>Blood Type: </Form.Label>
                    <Form.Control type="text" value={this.state.bloodType} onChange={this.onBloodTypeChange.bind(this)}/>
                </Form.Group>

                <Form.Group controlId="formGridRole">
                    <Form.Label>Role: </Form.Label>
                    <Form.Control type="text" value={this.state.role} onChange={this.onRoleChange.bind(this)}/>
                </Form.Group>

                <Button variant="outline-secondary" block type="button" onClick={this.onSubmitForm.bind(this)}>{this.renderButtonText()}</Button>
            </Form>
        )
    }
}

export default connect(null,{addNewSoldier})(EditSolider);