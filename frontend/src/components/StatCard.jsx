import React from 'react';

const StatCard = ({ title, value, label, loading }) => {
    return (
        <div className="card" style={{ textAlign: 'center' }}>
            <h3>{title}</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{loading ? '...' : value}</p>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>{label}</span>
        </div>
    );
};

export default StatCard;
