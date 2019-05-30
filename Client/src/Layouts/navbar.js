import React, { Component } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TypoGraphy from '@material-ui/core/Typography';
import '../assets/css/navbar.css'

import '../assets/css/navbar.css'
export default class navbar extends Component {
    
    constructor(props){
        super(props);

    }

    render() {
        const styles = {
            palette: {
                primary: {
                    background: "#d7dae0"
                }
              },
        };
        return (
            <div style = {styles.palette.primary}>
                    <AppBar position="static">
                    <Toolbar>
                        <TypoGraphy variant="title" >
                        My header
                    </TypoGraphy>
                    </Toolbar>
                    </AppBar>

            </div>         
        )
    }
}
