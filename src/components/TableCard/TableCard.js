import React from 'react';
import PropTypes from 'prop-types';
import Card from 'components/Card/Card'
import styles from './TableCard.module.css';
import textStyles from 'components/TextStyles.module.css'

function TableCard({children, headers, title, data}) {
    return (
        <Card>
            <div className={styles.header}>
                <span className={textStyles.cardHeader}>{title}</span>
                <div>
                    {children}
                </div>
            </div>
            <table className={styles.table} cellSpacing="0">
                <thead className={`${textStyles.tableHeader} ${styles.theader}`}>
                    <tr key="headerRow">
                        {headers.map((val, index) => {return <th key={index}>{val}</th>})}
                    </tr>
                </thead>
                <tbody>
                    {data.map((val, index) => {
                        return <tr key={index}>
                            {val.map((v, index) => {
                                return <td key={index}>{v}</td>
                            })}
                        </tr>
                    })}
                </tbody>
            </table>
        </Card>
    );
}

TableCard.propTypes = {
    headers: PropTypes.array.isRequired
};

export default TableCard;