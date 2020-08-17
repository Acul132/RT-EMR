import React, { Component } from 'react';
import styles from './Dropdown.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons"


class Dropdown extends Component {
    constructor(props){
        super(props)

        this.state = {
            list: props.list,
            listOpen: false,
            title: this.props.title,
            selectedItem: ''
        }
    }

    componentWillMount(){
        document.addEventListener('mousedown', this.handleClick, false)
    }

    componentWillUnmount(){
        document.removeEventListener('mousedown', this.handleClick, false)
    }

    handleClick = (e) => {
        if (this.node.contains(e.target)){
            return
        }
        this.handleClickOutside();
    }

    handleClickOutside(){
        this.setState({
            listOpen: false
        })
    }

    componentDidUpdate(prevValue){
        if(prevValue.list != this.props.list){
            this.setState({list: this.props.list, selectedItem: ''})
            if(!this.props.list.includes(this.state.selectedItem)){
                this.setState({selectedItem: ''})
            }
        }
    }

    selectItem(itemName){
        if(itemName === this.state.selectedItem){
            this.setState({listOpen: false, selectedItem:''})
        }
        else{
            this.setState({listOpen: false, selectedItem:itemName})
        }
        this.props.onSelect(itemName)
        this.filterRows(itemName)
    }

    toggleList(){
        this.setState(prevState => ({listOpen: !prevState.listOpen}))
    }

    handleSearchFilter(event) {
        this.setState({selectedItem:event.target.value})
        this.filterRows(event.target.value)
    }

    filterRows(filter){
        if(filter === "")
            this.setState({list: this.props.list})
        else
            this.setState({list: this.props.list.filter(row => row.toUpperCase().includes(filter.toUpperCase()))})
    }

    render() {
        const {listOpen, title} = this.state
        return (
            <div ref={node => this.node = node} className={styles.dropdown}>
                <div className={styles.header} onClick={() => this.toggleList()}>
                    <div className={`${styles.title} ${(this.state.selectedItem === '') ? styles.placeholder : styles.selected }`}>
                        {!this.props.searchable && <span>{(this.state.selectedItem === '') ? title : this.state.selectedItem}</span>}
                        {this.props.searchable && <input className={styles.searchInput} type="text" placeholder={this.props.title} value={this.state.selectedItem} onChange={this.handleSearchFilter.bind(this)}>
                        </input>}
                    </div>
                    {listOpen
                        ? <div><FontAwesomeIcon icon={faChevronUp} className={styles.chevronIcon}/></div>
                        : <div><FontAwesomeIcon icon={faChevronDown} className={styles.chevronIcon}/></div>
                    }
                </div>
                {listOpen && this.state.list.length > 0 && <ul className={styles.list}>
                    {this.state.list.map((item, index) => (
                        <li className={styles.listItem} key={index} onClick={() => this.selectItem(item)}>{item}</li>
                        ))}
                </ul>}
            </div>
        );
    }
}

export default Dropdown;