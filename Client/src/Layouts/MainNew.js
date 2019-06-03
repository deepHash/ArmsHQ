import React, { Component } from 'react';

import Map from './Map/MapView';
import { fetchSoldiers } from '../actions/soldierActions';
import Pages from './helper/pages';
import EditSoldier from './Soldiers/EditSoldier';
import { connect } from 'react-redux';
import { changePage } from '../actions/pagesActions';
import ViewSoldier from './Soldiers/ViewSoldier';
import SoldierCard from './Soldiers/SoldierCard';

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Card from 'react-bootstrap/Card'

import '../assets/css/MainNew.css';
import SoldiersList from './soldiersList';

class MainNew extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            type: this.props.type || 'new',
            name: this.props.name || '',
            mashId: this.props.name || -1,
            bloodType: this.props.bloodType || '',
            role: this.props.role || '',
            setNewPos: false,
            openSoldierCard:false,
            openLeftCard:false,
            soldierCardName:undefined,
            soldierCardMeshID:undefined,
            soldierCardRole:undefined,
            soldierCardBlood:undefined,
            soldierCardPulse:undefined,
            soldierCardAcc:undefined,
        }
        this.RemoveFloatingCard = this.RemoveFloatingCard.bind();
    }

    RemoveFloatingCard(){
        this.setState({
            currPage:undefined
       })   
    }

    renderFloatingCard(){
        console.log("2222222222222")
        console.log(this.props.currPage)
        switch(this.props.currPage){
            case undefined:
                return(null);
                
            case 'View All Soldiers':
                return(<ViewSoldier onSelectSoldier={this.handleSelectSoldier} />)
            
            case 'Add Force':
                return(< EditSoldier />);    
        }
      }

      handleSelectSoldier = (soldier) => {
          this.setState({setNewPos: soldier.gps})
          this.setState({openSoldierCard: true})
          this.setState({soldierCardName:soldier.name})
          this.setState({soldierCardMeshID: soldier.meshID})
          this.setState({soldierCardRole: soldier.role})
          this.setState({soldierCardBlood: soldier.blood})
          this.setState({soldierCardPulse: soldier.pulse})
          this.setState({soldierCardAcc: soldier.acc})
      }
      handleExitSoldierCard = () => {
        this.setState({openSoldierCard: false})
    }
    handleExitLeftCard = () => {
        this.setState({openLeftCard: true})

    }
    // handleCheckBeforeChangePage = () => {
    //     if(this.props.currPage)
    //         if (this.state.openLeftCard)
    //         return "block" 
    //     return "none" ;
    // }

  render() {
    return (
        <div>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand onClick={this.props.changePage.bind(this,undefined)}>ARMS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={this.props.changePage.bind(this,undefined)}>Home</Nav.Link>
                        {Pages.map(({text}, index) => (
                            <Nav.Link onClick={this.props.changePage.bind(this,text)}>
                                {text}
                            </Nav.Link>
                        ))}
                    </Nav>
                    {/* search bar */}
                    <SoldiersList onSelectSoldier={this.handleSelectSoldier} items={this.props.soldiers}/>
                </Navbar.Collapse>
            </Navbar>
           <div>
                <Card id="FloatingCard" style={{display: this.props.currPage===undefined? "none":this.state.currPage===false ? "none": "block"}}>
                        {this.renderFloatingCard()}
                </Card>
                <Map pos={this.state.setNewPos}/>
                <Card id="FloatingCardSoldier" style={{display:this.state.openSoldierCard === undefined ? "none" : this.state.openSoldierCard === false ?"none":"block"}}>
                    < SoldierCard onExitSoldierCard={this.handleExitSoldierCard} name={this.state.soldierCardName} meshID={this.state.soldierCardMeshID} role={this.state.soldierCardRole} blood={this.state.soldierCardBlood} pulse={this.state.soldierCardPulse} acc={this.state.soldierCardAcc}/>
                </Card>
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