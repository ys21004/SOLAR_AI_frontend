import './App.css';
import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SolarMaintenanceForm from './components/SolarMaintenanceForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // New state management
  const [techFormData, setTechFormData] = useState({
    panelId: '',
    inspectionType: 'Routine Check',
    notes: ''
  });

  const [maintenanceHistory, setMaintenanceHistory] = useState([]);

  const [adminStats, setAdminStats] = useState({
    totalInspections: 145,
    pendingTasks: 12,
    systemEfficiency: 94.5
  });

  const solarPanels = [
    { id: 'A1', location: 'North Site', status: 'Critical', technician: 'John Doe', lastInspection: 'Today' },
    { id: 'B3', location: 'South Site', status: 'Normal', technician: 'Jane Smith', lastInspection: 'Yesterday' },
    { id: 'C2', location: 'North Site', status: 'Maintenance Required', technician: 'Mike Johnson', lastInspection: '2 days ago' },
  ];

  // Update maintenance analysis state to include panel data
  const [maintenanceAnalysis, setMaintenanceAnalysis] = useState({
    loading: false,
    result: null,
    error: null,
    formData: {
      panelId: '',
      installationDate: '',
      lastMaintenanceDate: '',
      currentEfficiency: '',
      powerOutput: '',
      temperature: '',
      dustLevel: 'low',
      weatherConditions: 'sunny',
      physicalDamage: 'none',
      description: '',
      image: null
    }
  });

  // Fetch maintenance history when component mounts
  useEffect(() => {
    fetchMaintenanceHistory();
  }, []);

  const fetchMaintenanceHistory = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/maintenance');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched maintenance history:', data);
        setMaintenanceHistory(data);
      }
    } catch (error) {
      console.error('Error fetching maintenance history:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setMaintenanceAnalysis(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: type === 'file' ? files[0] : value
      }
    }));
  };

  const getFilteredPanels = () => {
    return solarPanels.filter(panel => {
      const matchesLocation = locationFilter === 'all' || panel.location === locationFilter;
      const matchesStatus = statusFilter === 'all' || panel.status === statusFilter;
      const matchesSearch = panel.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         panel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         panel.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         panel.technician.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesLocation && matchesStatus && matchesSearch;
    });
  };

  const addMaintenanceRecord = (newRecord) => {
    setMaintenanceHistory(prevHistory => [newRecord, ...prevHistory]);
  };

  const renderDashboard = () => (
    <div className="dashboard-grid">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search by location, status, or technician..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filters">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="all">All Locations</option>
            <option value="North Site">North Site</option>
            <option value="South Site">South Site</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Critical">Critical</option>
            <option value="Normal">Normal</option>
            <option value="Maintenance Required">Maintenance Required</option>
          </select>
        </div>
      </div>

      <div className="status-card">
        <h2>System Overview</h2>
        <div className="status-indicator active">
          <span className="dot"></span>
          <p>Total Panels: {solarPanels.length}</p>
          <p>Critical Condition: {solarPanels.filter(p => p.status === 'Critical').length}</p>
          <p>Pending Inspection: {solarPanels.filter(p => p.status === 'Maintenance Required').length}</p>
        </div>
      </div>

      <div className="status-card">
        <h2>Recent Inspections</h2>
        <div className="inspection-list">
          {getFilteredPanels().map(panel => (
            <div key={panel.id} className="inspection-item">
              <p>Panel {panel.id} - {panel.status}</p>
              <span>{panel.lastInspection} - {panel.technician}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTechPortal = () => (
    <div className="tech-portal">
      <h2>Technician Portal</h2>
      <form className="inspection-form" onSubmit={(e) => {
        e.preventDefault();
        console.log('Form submitted:', techFormData);
      }}>
        <div className="form-group">
          <label>Panel ID</label>
          <input 
            type="text" 
            placeholder="Enter Panel ID"
            value={techFormData.panelId}
            onChange={(e) => setTechFormData({...techFormData, panelId: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Inspection Type</label>
          <select
            value={techFormData.inspectionType}
            onChange={(e) => setTechFormData({...techFormData, inspectionType: e.target.value})}
          >
            <option>Routine Check</option>
            <option>Maintenance</option>
            <option>Repair</option>
            <option>Emergency Service</option>
          </select>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea 
            placeholder="Enter inspection details"
            value={techFormData.notes}
            onChange={(e) => setTechFormData({...techFormData, notes: e.target.value})}
            required
          ></textarea>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">Submit Report</button>
          <button 
            type="button" 
            className="clear-btn" 
            onClick={() => setTechFormData({
              panelId: '',
              inspectionType: 'Routine Check',
              notes: ''
            })}
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );

  const renderMaintenanceHistory = () => (
    <div className="maintenance-history">
      <h2>Maintenance History</h2>
      <div className="history-filters">
        <select>
          <option>All Statuses</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>In Progress</option>
        </select>
        <select>
          <option>All Types</option>
          <option>Routine Check</option>
          <option>Maintenance</option>
          <option>Repair</option>
          <option>Emergency Service</option>
        </select>
        <div className="date-range">
          <input type="date" placeholder="Start Date" />
          <input type="date" placeholder="End Date" />
        </div>
      </div>
      <table className="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Panel ID</th>
            <th>Type</th>
            <th>Technician</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceHistory.map((record, index) => (
            <tr key={index}>
              <td>{record.date}</td>
              <td>{record.panelId}</td>
              <td>{record.type}</td>
              <td>{record.technician}</td>
              <td>
                <span className={`status-badge ${record.status.toLowerCase()}`}>
                  {record.status}
                </span>
              </td>
              <td>
                <button className="view-btn">View</button>
                <button className="edit-btn">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAdminPanel = () => (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div className="admin-stats">
        <div className="stat-card">
          <h3>Total Inspections</h3>
          <p>{adminStats.totalInspections}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Tasks</h3>
          <p>{adminStats.pendingTasks}</p>
        </div>
        <div className="stat-card">
          <h3>System Efficiency</h3>
          <p>{adminStats.systemEfficiency}%</p>
        </div>
      </div>
      <div className="admin-actions">
        <div className="action-group">
          <h3>Reports</h3>
          <button className="export-btn">Export Monthly Report</button>
          <button className="export-btn">Export Maintenance Log</button>
          <button className="export-btn">Export Efficiency Data</button>
        </div>
        <div className="action-group">
          <h3>Task Management</h3>
          <button className="assign-btn">Assign New Tasks</button>
          <button className="schedule-btn">Schedule Maintenance</button>
        </div>
      </div>
      <div className="efficiency-chart">
        <h3>System Efficiency Trends</h3>
        <div className="chart-placeholder">
          <p>Chart will be implemented with actual data visualization</p>
        </div>
      </div>
    </div>
  );

  // Add new render function for solar maintenance
  const renderSolarMaintenance = () => (
    <div className="solar-maintenance">
      <h2>AI Solar Panel Maintenance Check</h2>
      <div className="maintenance-form">
        <form onSubmit={(e) => {
          e.preventDefault();
          setMaintenanceAnalysis(prev => ({
            ...prev,
            loading: true
          }));
          // Mock API call - replace with actual AI integration
          setTimeout(() => {
            setMaintenanceAnalysis(prev => ({
              ...prev,
              loading: false,
              error: null,
              result: {
                condition: "Good",
                efficiency: "85%",
                recommendations: [
                  `Schedule cleaning due to ${prev.formData.dustLevel} dust levels`,
                  `Check electrical connections - efficiency drop noted from ${prev.formData.currentEfficiency}%`,
                  "Monitor temperature variations",
                  `Plan next maintenance within ${prev.formData.powerOutput < 80 ? "15" : "30"} days`
                ],
                priority: prev.formData.currentEfficiency < 75 ? "High" : "Medium",
                nextCheck: "30 days",
                predictedIssues: [
                  "Potential dust accumulation impact",
                  "Minor efficiency degradation"
                ]
              }
            }));
          }, 2000);
        }}>
          <div className="form-grid">
            <div className="form-group">
              <label>Panel ID</label>
              <input
                type="text"
                name="panelId"
                value={maintenanceAnalysis.formData.panelId}
                onChange={handleInputChange}
                placeholder="Enter Panel ID"
                required
              />
            </div>

            <div className="form-group">
              <label>Technician Name</label>
              <input
                type="text"
                name="technicianName"
                value={maintenanceAnalysis.formData.technicianName}
                onChange={handleInputChange}
                placeholder="Enter Technician Name"
                required
              />
            </div>

            <div className="form-group">
              <label>Installation Date</label>
              <input
                type="date"
                name="installationDate"
                value={maintenanceAnalysis.formData.installationDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Last Maintenance Date</label>
              <input
                type="date"
                name="lastMaintenanceDate"
                value={maintenanceAnalysis.formData.lastMaintenanceDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>DC Power (W)</label>
              <input
                type="number"
                name="dc_power"
                value={maintenanceAnalysis.formData.dc_power}
                onChange={handleInputChange}
                placeholder="Enter DC Power"
                required
              />
            </div>

            <div className="form-group">
              <label>AC Power (W)</label>
              <input
                type="number"
                name="ac_power"
                value={maintenanceAnalysis.formData.ac_power}
                onChange={handleInputChange}
                placeholder="Enter AC Power"
                required
              />
            </div>

            <div className="form-group">
              <label>Ambient Temperature (°C)</label>
              <input
                type="number"
                name="ambient_temperature"
                value={maintenanceAnalysis.formData.ambient_temperature}
                onChange={handleInputChange}
                placeholder="Enter Ambient Temperature"
                required
              />
            </div>

            <div className="form-group">
              <label>Module Temperature (°C)</label>
              <input
                type="number"
                name="module_temperature"
                value={maintenanceAnalysis.formData.module_temperature}
                onChange={handleInputChange}
                placeholder="Enter Module Temperature"
                required
              />
            </div>

            <div className="form-group">
              <label>Irradiation (W/m²)</label>
              <input
                type="number"
                name="irradiation"
                value={maintenanceAnalysis.formData.irradiation}
                onChange={handleInputChange}
                placeholder="Enter Irradiation"
                required
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Upload Panel Image (Optional)</label>
            <div className="upload-area">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleInputChange}
                className="file-input"
              />
              <p>Drag and drop an image or click to browse</p>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Additional Notes</label>
            <textarea
              name="description"
              value={maintenanceAnalysis.formData.description}
              onChange={handleInputChange}
              placeholder="Describe any specific issues or concerns..."
              rows="4"
            ></textarea>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="analyze-btn"
              disabled={maintenanceAnalysis.loading}
            >
              {maintenanceAnalysis.loading ? 'Analyzing...' : 'Analyze Maintenance Needs'}
            </button>
          </div>
        </form>

        {maintenanceAnalysis.result && (
          <div className="analysis-results">
            <h3>Analysis Results</h3>
            <div className="result-card">
              <div className="result-item">
                <strong>Current Condition:</strong>
                <span>{maintenanceAnalysis.result.condition}</span>
              </div>
              <div className="result-item">
                <strong>System Efficiency:</strong>
                <span>{maintenanceAnalysis.result.efficiency}</span>
              </div>
              <div className="result-item">
                <strong>Recommendations:</strong>
                <ul>
                  {maintenanceAnalysis.result.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              <div className="result-item">
                <strong>Predicted Issues:</strong>
                <ul>
                  {maintenanceAnalysis.result.predictedIssues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
              <div className="result-item">
                <strong>Priority Level:</strong>
                <span className={`priority-badge ${maintenanceAnalysis.result.priority.toLowerCase()}`}>
                  {maintenanceAnalysis.result.priority}
                </span>
              </div>
              <div className="result-item">
                <strong>Next Check Recommended:</strong>
                <span>{maintenanceAnalysis.result.nextCheck}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="App">
      <nav className="navbar">
        <h1>Solar AI Portal</h1>
        <div className="nav-links">
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'solar-maintenance' ? 'active' : ''} 
            onClick={() => setActiveTab('solar-maintenance')}
          >
            AI Maintenance Check
          </button>
          <button 
            className={activeTab === 'tech-portal' ? 'active' : ''} 
            onClick={() => setActiveTab('tech-portal')}
          >
            Technician Portal
          </button>
          <button 
            className={activeTab === 'maintenance' ? 'active' : ''} 
            onClick={() => setActiveTab('maintenance')}
          >
            Maintenance History
          </button>
          <button 
            className={activeTab === 'admin' ? 'active' : ''} 
            onClick={() => setActiveTab('admin')}
          >
            Admin Panel
          </button>
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'solar-maintenance' && renderSolarMaintenance()}
        {activeTab === 'tech-portal' && renderTechPortal()}
        {activeTab === 'maintenance' && renderMaintenanceHistory()}
        {activeTab === 'admin' && renderAdminPanel()}
      </main>
    </div>
  );
}

export default App;
