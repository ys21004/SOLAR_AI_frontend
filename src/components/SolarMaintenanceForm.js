import React, { useState } from 'react';

const SolarMaintenanceForm = ({ addMaintenanceRecord, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    panelId: '',
    technicianName: '',
    installationDate: '',
    lastMaintenanceDate: '',
    dc_power: '',
    ac_power: '',
    ambient_temperature: '',
    module_temperature: '',
    irradiation: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Sending form data:', formData);

      const response = await fetch('http://localhost:5001/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit maintenance check');
      }

      const result = await response.json();
      console.log('Response from backend:', result);

      if (result.success) {
        // Add the new record to the local state
        addMaintenanceRecord(result.record);
        
        // Fetch updated history from the backend
        onSubmitSuccess();

        // Reset form
        setFormData({
          panelId: '',
          technicianName: '',
          installationDate: '',
          lastMaintenanceDate: '',
          dc_power: '',
          ac_power: '',
          ambient_temperature: '',
          module_temperature: '',
          irradiation: '',
          description: '',
        });
      }
    } catch (error) {
      console.error('Error submitting maintenance check:', error);
    }
  };

  // Add onChange handlers for all form fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="maintenance-form">
      <div className="form-group">
        <label htmlFor="panelId">Panel ID</label>
        <input
          type="text"
          id="panelId"
          value={formData.panelId}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="technicianName">Technician Name</label>
        <input
          type="text"
          id="technicianName"
          value={formData.technicianName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="dc_power">DC Power (W)</label>
        <input
          type="number"
          id="dc_power"
          value={formData.dc_power}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="ac_power">AC Power (W)</label>
        <input
          type="number"
          id="ac_power"
          value={formData.ac_power}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="ambient_temperature">Ambient Temperature (°C)</label>
        <input
          type="number"
          id="ambient_temperature"
          value={formData.ambient_temperature}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="module_temperature">Module Temperature (°C)</label>
        <input
          type="number"
          id="module_temperature"
          value={formData.module_temperature}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="irradiation">Irradiation (W/m²)</label>
        <input
          type="number"
          id="irradiation"
          value={formData.irradiation}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit">Submit Maintenance Check</button>
    </form>
  );
};

export default SolarMaintenanceForm;
