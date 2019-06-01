import React from 'react'
import { fetchSoldiers } from '../../actions/soldierActions';
import { connect } from 'react-redux';
import SoldiersList from '../soldiersList';
import '../../assets/css/MainNew.css';

class ViewSoldier extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            type: this.props.type || 'new',
            name: this.props.name || '',
            mashId: this.props.name || -1,
            bloodType: this.props.bloodType || '',
            role: this.props.role || ''
        }
    }
    render(){
        return(
            <div>
                <SoldiersList items={this.props.soldiers}/>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    soldiers: state.soldiers.items
  });
  
  export default connect(mapStateToProps, {fetchSoldiers})(ViewSoldier);