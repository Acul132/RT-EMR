import React from 'react';
import TableCard from 'components/TableCard/TableCard';
import Button from 'components/Buttons/Button'

function MedicationsCard(props) {
    const data = [
        ['Hey', '1010'],
        ['Hey', '1010'],
        ['Hey', '1010'],
        ['Hey', '1010'],
        ['Hey', '1010'] 
    ]
    return (
        <TableCard headers={['Name', 'Dose']} title="Medications" data={data}>
            <Button text="View" secondary></Button>            
        </TableCard> 
    );
}

export default MedicationsCard;