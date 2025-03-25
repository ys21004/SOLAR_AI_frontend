import React from 'react';

const Dashboard = ({ maintenanceHistory }) => {
  return (
    <div className="dashboard">
      <h2>Recent Inspections</h2>
      <div className="maintenance-history">
        {maintenanceHistory.length === 0 ? (
          <p>No maintenance records found.</p>
        ) : (
          <ul>
            {maintenanceHistory.map((record, index) => (
              <li key={index} className="maintenance-record">
                <div className="record-header">
                  <span className="date">{record.date}</span>
                  <span className={`status ${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </div>
                <div className="record-details">
                  <span>Panel ID: {record.panelId}</span>
                  <span>Technician: {record.technician}</span>
                  <span>Type: {record.type}</span>
                  {record.dc_power && <span>DC Power: {record.dc_power}W</span>}
                  {record.ac_power && <span>AC Power: {record.ac_power}W</span>}
                  {record.ambient_temperature && (
                    <span>Ambient Temp: {record.ambient_temperature}°C</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 