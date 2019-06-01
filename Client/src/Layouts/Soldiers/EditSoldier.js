import React from 'react'
import {addNewSoldier} from '../../actions/soldierActions';
import { connect } from 'react-redux';
import '../../assets/css/MainNew.css';

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

    onCreate({name,meshId,bloodType,role}){
        this.props.addNewSoldier({name,meshId,bloodType,role})
        this.setState({name:'',meshId:'-1',bloodType:'',role:''})
    }
    render(){
        const {formStyle,inputContainerStyle,inputStyle} = styles;
        return(
            <form style={formStyle}>
                {this.renderTitle()}
                <div style={inputContainerStyle}>
                    <label>Name: </label>
                    <input style={{...inputStyle,...{width:'65%'}}} type="text" value={this.state.name} onChange={this.onNameChange.bind(this)}/>
                </div>
                <div style={inputContainerStyle}>
                    <label>Mesh Id: </label>
                    <input style={{...inputStyle,...{width:'30%'}}} type="number" value={this.state.meshId} onChange={this.onMeshIdChange.bind(this)}/>
                </div>

                <div style={inputContainerStyle}>
                    <label>Blood Type: </label>
                    <input style={{...inputStyle,...{width:'40%'}}} type="text" value={this.state.bloodType} onChange={this.onBloodTypeChange.bind(this)}/>
                </div>

                <div style={inputContainerStyle}>
                    <label>Role: </label>
                    <input style={{...inputStyle,...{width:'65%'}}} type="text" value={this.state.role} onChange={this.onRoleChange.bind(this)}/>
                </div>

                <button type="button" onClick={this.onSubmitForm.bind(this)}>{this.renderButtonText()}</button>
            </form>
        )
    }
}


const styles = {
    formStyle:{
        padding: '10px 25px' 
    },
    inputContainerStyle:{
        display: 'flex',
        justifyContent: 'flex-start',
        margin: '5px 0px'
    },
    inputStyle:{
        marginLeft: '7px',
        border:'0px',
        borderRadius: '2px',        
        padding: '3px 5px'
    }
}
export default connect(null,{addNewSoldier})(EditSolider);