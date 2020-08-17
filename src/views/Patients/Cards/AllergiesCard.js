import React from 'react';
import TableCard from 'components/TableCard/TableCard';
import Pill from 'components/Pill/Pill';
import Button from 'components/Buttons/Button'

function AllergiesCard(props) {
    const data = [
        ['Almonds', <Pill text="Level 10" color="#E32121"/>],
        ['Joshua Renlli', <Pill text="Level 10" color="#E32121"/>],
        ['Hey', <Pill text="Level 10" color="#E32121"/>],
        ['Hey', <Pill text="Level 10" color="#E32121"/>],
        ['Hey', <Pill text="Level 10" color="#E32121"/>]
    ]
    return (
        <TableCard headers={['Name', 'Severity']} title="Allergies" data={data}>
            <Button text="View" secondary></Button>
        </TableCard> 
    );
}

export default AllergiesCard;