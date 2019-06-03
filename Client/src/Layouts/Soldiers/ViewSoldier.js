import React from 'react'
import { fetchSoldiers } from '../../actions/soldierActions';
import { connect } from 'react-redux';
import { ListGroupItem, ListGroup } from 'react-bootstrap';
import SoldiersList from '../soldiersList';
import '../../assets/css/MainNew.css';
import { MDBIcon } from "mdbreact";
import { MDBBtn } from "mdbreact";

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
    SelectSoldier = (soldier) => {
        this.props.onSelectSoldier(soldier);
    }
    // CloseLeftCard = () => {
    //     this.props.onExitLeftCard();
    // }   
    render(){
        let k = 0;
        return(
            <div>
                {/* <MDBBtn id="exitBtn" onClick={() => this.CloseLeftCard()} floating size="sm" gradient="purple" className="md-toolbar"><MDBIcon  icon="times" /></MDBBtn> */}
                <ListGroup>
                    {this.props.soldiers.map(( item ) => (
                    <ListGroupItem className="list-group-item" key={k++}
                        onClick={(e) => this.SelectSoldier(item)}>
                        <h5>{item.name}</h5>
                    </ListGroupItem>
                    ))}
                </ListGroup>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    soldiers: state.soldiers.items,
  });
  
  export default connect(mapStateToProps, {fetchSoldiers})(ViewSoldier);