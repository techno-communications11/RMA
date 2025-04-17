import React from 'react';

const ShippingStatus = ({ labelCreatedCount, inTransitCount, deliveredCount }) => {
    return (
        <div>
            <h1>Shipping Status</h1>
            <p>Label Created: {labelCreatedCount}</p>
            <p>In Transit: {inTransitCount}</p>
            <p>Delivered: {deliveredCount}</p>
            <h1 className='text-center'> Comming soon..</h1>
        </div>
    );
};

export default ShippingStatus;