import React, { Component } from 'react';

import Map from './Map/MapView';
import { fetchSoldiers } from '../actions/soldierActions';
import { fetchAlerts } from '../actions/soldierActions';
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
    componentDidUpdate(){
        this.props.fetchAlerts();
    }
    GetForces = () => {
        var forcesList=[]
        this.props.soldiers.forEach(soldier => {
            if((soldier.isCommander==true) && (forcesList.includes(soldier.forceID)==false) ){
                forcesList.push({'id':soldier.forceID,'commander':soldier.name})            
            }
           
        });    
        return forcesList;
    }

    GetAlertsWithSoldiersName = () => {
        var alertList=[]
        this.props.alerts.forEach(alert => {
            this.props.soldiers.forEach(soldier => {
                if(soldier.meshID==alert.meshID){
                    alertList.push({'soldierName':soldier.name,'type':alert.type,'date':alert.date})            
                }
            });  
        });    
        alertList.reverse()
        return alertList;
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
                return(< EditSoldier onAddSoldier={this.handleAddSoldier} soldiers={this.props.soldiers} />);    
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
            case "forceID":
                this.setState({forceIDSelected: undefined});

        }
    }

    handleAddSoldier = () => {
        //@Todo update the soldiers array after a new soldier was added
        this.props.fetchSoldiers();
        this.props.changePage.bind(this,undefined);
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

    // handleExitLeftCard = () => {
    //     this.setState({openLeftCard: !(this.state.openLeftCard)})
    // }

  render() {
    var forces=this.GetForces()
    var alerts=this.GetAlertsWithSoldiersName()
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
                                   Force #{item.id}, Commanding {item.commander}
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
                <DropdownButton
                    drop="up"
                    variant="secondary"
                    title={`Alerts`}
                    id="dropdown-button-drop-up"
                    key='up'
                    role='menu'
                >
                    {alerts.map(( alert ) => (
                        <Dropdown.Item role='menueitem' eventKey="1" >Soldier Name: {alert.soldierName}, Alert Type: {alert.type}, Date: {alert.date}</Dropdown.Item>
                    ))}
                </DropdownButton>
         </div>       
        </div>
    );
  }
}


  const mapStateToProps = state => ({
    currPage: state.pages.curr,
    soldiers: state.soldiers.items,
    alerts: state.soldiers.alerts,
  });
  
  export default connect(mapStateToProps,{changePage,fetchSoldiers,fetchAlerts})(MainNew)