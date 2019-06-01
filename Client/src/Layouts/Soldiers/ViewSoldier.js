import React from 'react'

class ViewSolider extends React.Component{
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
                {this.state.name}
            </div>
        )
    }
}

export default ViewSolider;