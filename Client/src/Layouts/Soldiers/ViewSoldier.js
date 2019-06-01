import React from 'react'
import { fetchSoldiers } from '../../actions/soldierActions';
import { connect } from 'react-redux';
import SoldiersList from '../soldiersList';

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
                {/* {this.state.name} */}
                <div className="root">
                <div className="search">
                {/* <div className="searchIcon">
                <SearchIcon className="searchIcon"/>
                </div> */}
                {/* <InputBase
                placeholder="Search…"
                classes={{
                    root: "inputRoot",
                    input: "inputInput",
                }}
                onChange={this.handleChange}
                /> */}
            
                <div className="toolbar" />
                <div className="content">
                    <div className="container">
                    <section className="section">
                    <SoldiersList items={this.props.soldiers}/>
                        {/* <ul>
                        {this.state.list.map(item => (
                            <li key={item}>{item}</li>
                        ))}
                        </ul> */}
                    </section>
                    </div>
                </div> 
            </div>
            </div>
        </div>
        )
    }
}

const mapStateToProps = state => ({
    soldiers: state.soldiers.items
  });
  
  export default connect(mapStateToProps, {fetchSoldiers})(ViewSoldier);