import React, { Component } from 'react';
import styles from './Table.module.css';
import Checkbox from 'components/Checkbox/Checkbox';
import {useHistory} from "react-router-dom"
function TableRow(props) {
    const history = useHistory()

    const click = () => {
        if(props.viewable) {
            history.push(history.location.pathname + "/" + props.data.id)
        }
        if(props.onClick) {
            props.onClick();
        }
    }

    let loop = props.header ? props.header : Object.keys(props.data)

    return (
        <tr onClick={() => {click()}}>
            {loop.map((item, index) => {
                if(item === "id") return
                return (
                <td key={index}>{props.data[item]}</td>)
            })}
        </tr>
    );
}

export default TableRow;