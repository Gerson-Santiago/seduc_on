import React from 'react';
import MainContent from '../../components/layout/MainContent';

const Dashboard = () => {
    return (
        <div className="dashboard-view">
            {/* O MainContent carrega os cards e gráficos */}
            <MainContent />
        </div>
    );
};

export default Dashboard;