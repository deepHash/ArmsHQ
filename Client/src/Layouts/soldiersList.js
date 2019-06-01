
import React, { Component } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import '../assets/css/Search.css';
const styles = theme => ({
    searchIcon: {
        width: theme.spacing.unit * 9,
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      inputRoot: {
        color: 'inherit',
        width: '100%',
      },
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

});
export default class SoldiersList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtered: [],
        }
        this.handleChange = this.handleChange.bind(this);
        
    }

    componentDidMount() {
        this.setState({
          filtered: this.props.items
        });
        console.log(this.state.list)
      }
      
      componentWillReceiveProps(nextProps) {
        this.setState({
          filtered: nextProps.items
        });
      }

      handleChange = (event) => {
        const { target: { name, value } } = event;
            // Variable to hold the original version of the list
        let currentList = [];
            // Variable to hold the filtered list before putting into state
        let newList = [];

            // If the search bar isn't empty
        if (event.target.value !== "") {
        currentList = this.props.items;
        if (!currentList) return newList;
        newList = currentList.filter(item => {
            const lc = item.name.toLowerCase();
            const filter = event.target.value.toLowerCase();
            return lc.includes(filter);
        });
        } else {
                // If the search bar is empty, set newList to original task list
        newList = this.props.items;
        }
            // Set the filtered state based on what our rules added to newList
        this.setState({
        filtered: newList
        });
    }


      render() {
        const { classes } = this.props;

        return (
            <div className="root">
            <div className="searchIcon">
                <SearchIcon className="searchIcon"/>
            </div>
            <InputBase
                placeholder="Search…"
                styles={{
                    root: styles.inputRoot,
                    input: styles.inputInput,
                }}
                onChange={this.handleChange}
                />
                <ul>
                    {this.state.filtered.map(item => (
                        <li className="list-group-item" data-category={item} key={item.mashId}>{item.name}</li>
                    ))}
                </ul>
             
            </div>
        )
    }
}