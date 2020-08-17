import React, { Component } from 'react';
import styles from "./Table.module.css";
import Button from "../../components/Buttons/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faPlus, faSearch} from "@fortawesome/free-solid-svg-icons"
import TableRow from './TableRow';

class Table extends Component {
    constructor(props){
        super(props);

        this.state = {
            rows: props.rows,       //Array of objects with keys=headers
            header: props.header,    //Array of strings with header names
            showButtonModal: false
        }

        this.buttonClicked = this.buttonClicked.bind(this);
    }

    buttonClicked(){
        this.toggleButtonModal()
    }

    toggleButtonModal(){
        this.setState(state => ({ showButtonModal: !state.showButtonModal}))
    }
    fetchRowInfo(rowInfo){
        this.render();  
    }

    componentDidUpdate(prevVal){
        if(prevVal.rows != this.props.rows){
            this.setState({rows: this.props.rows})
        }
    }

    renderTableHeader() {

        return <tr>
            {this.state.header.map((header, index) => {
                return <th key={index}> {header.replace("_"," ").toUpperCase()}</th>
            })}
        </tr>
    }

    renderTableRows() {
        return this.state.rows.map((drugInfo, index) => {
            return(
                <TableRow key={index} keyID={index} data={drugInfo} header={this.props.header} viewable={this.props.viewable} onClick={this.props.onRowClick ? () => {this.props.onRowClick(drugInfo)} : () => {}}> </TableRow>

            )
        })
    }
    
    render() {
        return (
            <div className={`${styles.root} ${ this.props.tabbed ? styles.tabbed : ""}`}>
                {this.props.moduleName &&
                    <div className={styles.moduleHeader}>
                        <div className={styles.moduleName}>{this.props.moduleName}</div>
                        <div className={styles.additionalFields}>
                            {this.props.additionalFields}
                        </div>
                </div> }
                <div className={`${!this.props.moduleName ? styles.fullHeight : styles.headerHeight} `}>
                    <table className={styles.table} cellSpacing="0">
                        <thead  className={styles.tableHeader}>{this.renderTableHeader()}</thead>

                        <tbody style={{minHeight: this.props.height ? this.props.height : "auto"}} className={styles.tableRows}>{this.renderTableRows()}</tbody>

                    </table>
                </div>
            </div>
        );
    }
}

export default Table;