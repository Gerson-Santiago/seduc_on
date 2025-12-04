import React from 'react';
import StatCard from './StatCard';

const StatSection = ({ title, stats, loading }) => {
    return (
        <>
            <h2 style={{ fontSize: '1.2rem', marginTop: '20px', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                {title}
            </h2>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        label={stat.label}
                        loading={loading}
                    />
                ))}
            </div>
        </>
    );
};

export default StatSection;
