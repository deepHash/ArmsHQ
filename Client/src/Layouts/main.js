import React from 'react';
import Map from './Map/MapView';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { fade } from '@material-ui/core/styles/colorManipulator';
import MenuIcon from '@material-ui/icons/Menu';
import Pages from './helper/pages';

import EditSoldier from './Soldiers/EditSoldier';

import '../assets/css/main.css';
import { connect } from 'react-redux';
import { changePage } from '../actions/pagesActions';
import ViewSoldier from './Soldiers/ViewSoldier';
const drawerWidth = 240;




const styles = theme => ({
  root: {
    display: 'flex',
  },
  span:{
    color:"#ffffff"
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
    appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    backgroundColor:'#2B3835',
    fontColor:'#ffffff'
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor:'#2B3835'
  },
  toolbar:{
    backgroundColor:"#2d7f70"
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor:'#2B3835',
    padding: theme.spacing.unit * 3,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
    backgroundColor:'#2B3835'
  },
  menuButtonHidden: {
    display: 'none',
    backgroundColor:'#2B3835'
  },
  title: {
    flexGrow: 1,
    position:'absolute',
    fontFamily:'Special Elite',
    fontSize:'-webkit-xxx-large',
    color:'#ffffff',
    marginLeft:'20px'
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  Icons: {
    paddingTop:'3px',
    position: 'absolute',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: '0px',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
    // searchIcon: {
    //   width: theme.spacing.unit * 9,
    //   position: 'absolute',
    //   pointerEvents: 'none',
    //   display: 'flex',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    // },
    // inputRoot: {
    //   color: 'inherit',
    //   width: '100%',
    // },
    inputInput: {
      paddingTop: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      paddingBottom: theme.spacing.unit,
      paddingLeft: theme.spacing.unit * 10,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 120,
        '&:focus': {
          width: 200,
        },
      },
    },
   
  },
 
});

class Main extends React.Component {

  renderLeftPage(){
    switch(this.props.currPage){
      case 'Edit Force':
        return(<EditSoldier />);
        break;
      case 'Manage Force':
        return(<ViewSoldier />);
        break;
    }
  }
  
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            {/* <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classes.menuButton }
            >
              <MenuIcon />
            </IconButton> */}

            {/* <IconButton color="inherit">
              <Badge badgeContent={0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
          </Toolbar>
          </AppBar>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor="right" 
          >
          {/* <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon className="searchIcon"/>
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </div>
       */}
        <div className={classes.toolbar} />
        <SoldiersSearchContainer></SoldiersSearchContainer>
        {this.renderLeftPage()}

        </Drawer>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor="left" 
          >
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              ARMS
            </Typography >
      
        <div className={classes.toolbar} />

        {/* <SoldierInfo></SoldierInfo> */}

        {/* <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text} >
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text}/>
            </ListItem>
          ))}
        </List> 
        
        <Divider />*/}
        <List>
          {Pages.map(({text,MeterialUi}, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{MeterialUi}</ListItemIcon>
              <ListItemText primary={text} onClick={this.props.changePage.bind(this,text)}/>
            </ListItem>
          ))}
        </List>
        
      </Drawer>
        <main className={classes.content}>
          <div className='appBarSpacer' />
          <Typography variant="h4" gutterBottom component="h2">
            <Map/>
          </Typography>
        </main>
      </div>
    );
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  currPage: state.pages.curr
});


{/* export default connect(mapStateToProps,{changePage})(withStyles(styles)(Main)) */}
