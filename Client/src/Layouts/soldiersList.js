
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
            // list: [
            //     "Go to the store",
            //     "Wash the dishes",
            //     "Learn some code"
            //   ]
            
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
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
        console.log("blaa")
            // Variable to hold the original version of the list
        let currentList = [];
            // Variable to hold the filtered list before putting into state
        let newList = [];

            // If the search bar isn't empty
        if (event.target.value !== "") {
                // Assign the original list to currentList
        currentList = this.props.items;

                // Use .filter() to determine which items should be displayed
                // based on the search terms
        if (!currentList) return newList;
        newList = currentList.filter(item => {
                    // change current item to lowercase
            const lc = item.toLowerCase();
                    // change search term to lowercase
            const filter = event.target.value.toLowerCase();
                    // check to see if the current list item includes the search term
                    // If it does, it will be added to newList. Using lowercase eliminates
                    // issues with capitalization in search terms and search content
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
                        <li className="list-group-item" data-category={item} key={item}>{item}</li>
                    ))}
                </ul>
             
            </div>
        )
    }
}