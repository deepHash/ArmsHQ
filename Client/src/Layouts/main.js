import React, { Component } from 'react';

import Map from './Map/MapView';
import { fetchSoldiers } from '../actions/soldierActions';
import Pages from './Router/pages';
import EditSoldier from './Soldiers/EditSoldier';
import { connect } from 'react-redux';
import { changePage } from '../actions/pagesActions';
import ViewSoldier from './Soldiers/ViewSoldier';
// import ViewForce from './ViewForce';
import SoldierCard from './Soldiers/SoldierCard';
import SoldiersList from './Soldiers/SoldiersList';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
import SplitButton from 'react-bootstrap/SplitButton'
import Card from 'react-bootstrap/Card'

import '../assets/css/main.css';

class MainNew extends Component{
    constructor(props){
        super(props);
        this.state = {
            forceIDSelected: undefined,
            forcePosition: true,
            setNewPos: false,
            openSoldierCard:false,
            openLeftCard:false,
            soldierCardName:undefined,
            soldierCardMeshID:undefined,
            soldierCardRole:undefined,
            soldierCardBlood:undefined,
            soldierCardForceID:undefined,
            soldierCardPulse:undefined,
            soldierCardImg:undefined,
            // soldierCardAccX:undefined,
            // soldierCardAccY:undefined,
            // soldierCardAccZ:undefined,

        }
        this.RemoveFloatingCard = this.RemoveFloatingCard.bind();
    }
    
    componentDidMount(){
        this.props.fetchSoldiers();
    }
    
    GetForces = () => {
        var forcesList=[]
        this.props.soldiers.forEach(soldier => {
            if((soldier.isCommander==true) && (forcesList.includes(soldier.forceID)==false) ){
                forcesList.push({'id':soldier.forceID,'commander':soldier.name})            
            }
           
        });    
        console.log(forcesList)
        return forcesList;
    }

    RemoveFloatingCard(){
        this.setState({
            currPage:undefined
       })   
    }

    renderFloatingCard(){
        switch(this.props.currPage){
            case undefined:
                return(null);          
            case 'View All Soldiers':
                return(< ViewSoldier onSelectSoldier={this.handleSelectSoldier} />)
            case 'Add Soldier':
                return(< EditSoldier onAddSoldier={this.handleAddSoldier} />);    
            // case 'View Force':
            //     return(< ViewForce onSelectForce={this.handleSelectForce} />);    
        }
    }

    handleUpdateData = (soldier, type) => {
        switch(type){
            case "pulse":
                if(this.state.soldierCardMeshID == soldier.meshID)
                    this.setState({soldierCardPulse: soldier.pulse});
                break;
            case "emergency":
                this.handleSelectSoldier(soldier);
                break;
            case "position":
                this.setState({forcePosition: false});
                break;
        }
    }

    handleAddSoldier = () => {
        //@Todo update the soldiers array after a new soldier was added
        this.props.fetchSoldiers();
    }

    handleSelectSoldier = (soldier) => {
        this.setState({setNewPos: soldier.gps,
                       openSoldierCard: true,
                       soldierCardName:soldier.name,
                       soldierCardMeshID: soldier.meshID,
                       soldierCardRole: soldier.role,
                       soldierCardBlood: soldier.bloodType,
                       soldierCardForceID: soldier.forceID,
                       soldierCardPulse: soldier.pulse,
                       soldierCardImg: soldier.image
        })
        // if(this.state.soldier){
        //     if (this.state.soldier.acc){
        //         this.setState({soldierCardAccX: soldier.acc.x})
        //         this.setState({soldierCardAccY: soldier.acc.y})
        //         this.setState({soldierCardAccZ: soldier.acc.z})
        //     }
        // }
    }
    handleSelectForce = (forceID) => {
        this.setState({forceIDSelected: forceID})
    }

    handleExitSoldierCard = () => {
        this.setState({openSoldierCard: false})
    }

    handleExitLeftCard = () => {
        this.setState({openLeftCard: true})
    }

  render() {
    var forces=this.GetForces()

    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand onClick={this.props.changePage.bind(this,undefined)}>ARMS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={this.props.changePage.bind(this,undefined)}>Home</Nav.Link>
                       
                        {Pages.map(({text}, index) => (
                            <Nav.Link onClick={this.props.changePage.bind(this,text)} key={index}>
                                {text}
                            </Nav.Link>
                        ))}
                         <DropdownButton id="dropdown-item-button" title="View Force">
                            {forces.map(( item ) => (
                                <Dropdown.Item as="button"
                                    onClick={(e) => this.handleSelectForce(item.id)}>
                                   Force #{item.id}, Commander {item.commander}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </Nav>
                    {/* search bar */}
                    <SoldiersList onSelectSoldier={this.handleSelectSoldier} items={this.props.soldiers}/>
                </Navbar.Collapse>
            </Navbar>
           <div>
                <Card id="FloatingCard" style={{display: this.props.currPage===undefined? "none":this.state.currPage===false ? "none": "block"}}>
                        {this.renderFloatingCard()}
                </Card>
                <Map focusOnForce={this.state.forceIDSelected} pos={this.state.setNewPos} forcePos={this.state.forcePosition} soldiers={this.props.soldiers} onNewData={this.handleUpdateData} />
                <Card id="FloatingCardSoldier" style={{display:this.state.openSoldierCard === undefined ? "none" : this.state.openSoldierCard === false ?"none":"block"}}>
                    < SoldierCard onExitSoldierCard={this.handleExitSoldierCard} 
                        name={this.state.soldierCardName} 
                        meshID={this.state.soldierCardMeshID} 
                        role={this.state.soldierCardRole} 
                        blood={this.state.soldierCardBlood}
                        forceID={this.state.soldierCardForceID}  
                        pulse={this.state.soldierCardPulse} 
                        image={this.state.soldierCardImg}/>
                        {/* accX={this.state.soldierCardAccX}
                        accY={this.state.soldierCardAccY}
                        accZ={this.state.soldierCardAccZ} */}
                        
                </Card>
                <SplitButton
                    drop="up"
                    variant="secondary"
                    title={`Last Alert: `}
                    id="dropdown-button-drop-up"
                    key='up'
                >
                    <Dropdown.Item eventKey="1">Action</Dropdown.Item>
                    <Dropdown.Item eventKey="2">Another action</Dropdown.Item>
                    <Dropdown.Item eventKey="3">Something else here</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item eventKey="4">Separated link</Dropdown.Item>
                </SplitButton>
         </div>       
        </div>
    );
  }
}


  const mapStateToProps = state => ({
    currPage: state.pages.curr,
    soldiers: state.soldiers.items
  });
  
  export default connect(mapStateToProps,{changePage,fetchSoldiers})(MainNew)