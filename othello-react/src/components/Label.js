
import React from 'react';

const Label = ({ label }) => {
    return (
        <>
            <h2 className='label'>{label}</h2>
        </>
    );
};

const Piece = ({ color }) => {
    return (
        <>
            {color === 0 ? (
                <div className='hint-disk'></div>
            ) : color === 1 ? (
                <div className='black-disk'></div>
            ) : (
                <div className='white-disk'></div>
            )}
        </>
    );
};

export { Label as default, Piece };
