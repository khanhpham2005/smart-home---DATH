// Mock data for development/testing without a backend

export const mockUsers = {
  'demo@example.com': {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'demo123',
  },
  'test@example.com': {
    id: '2',
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123',
  },
};

export const mockDevices = [
  {
    id: '1',
    name: 'Living Room Fan',
    type: 'fan',
    status: false,
    location: 'Living Room',
    description: 'Ceiling fan with speed control',
  },
  {
    id: '2',
    name: 'Bedroom Light',
    type: 'light',
    status: true,
    location: 'Bedroom',
    description: 'LED ceiling light',
  },
  {
    id: '3',
    name: 'Kitchen Light',
    type: 'light',
    status: false,
    location: 'Kitchen',
    description: 'Smart LED strip',
  },
  {
    id: '4',
    name: 'Hallway Fan',
    type: 'fan',
    status: true,
    location: 'Hallway',
    description: 'Ventilation fan',
  },
];

// Mock actuators for quick device control
export const mockActuators = [
  {
    id: '1',
    name: 'Living Room Fan',
    type: 'FAN',
    state: 'OFF',
    deviceId: '1',
    description: 'Ceiling fan control',
  },
  {
    id: '2',
    name: 'Bedroom Light',
    type: 'LIGHT',
    state: 'ON',
    deviceId: '2',
    description: 'Bedroom LED light',
  },
  {
    id: '3',
    name: 'Kitchen Light',
    type: 'LIGHT',
    state: 'OFF',
    deviceId: '3',
    description: 'Kitchen LED strip',
  },
  {
    id: '4',
    name: 'Hallway Fan',
    type: 'FAN',
    state: 'ON',
    deviceId: '4',
    description: 'Hallway ventilation',
  },
];

// Mock sensors for monitoring (matches backend SensorResponse format)
export const mockSensors = [
  {
    id: '1',
    name: 'Living Room Temperature',
    type: 'TEMPERATURE',
    unit: '°C',
    deviceId: '1',
    deviceName: 'Living Room Device',
    status: 'ACTIVE',
    description: 'Temperature sensor for living room climate monitoring',
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-04-27T14:22:00Z',
  },
  {
    id: '2',
    name: 'Bedroom Humidity',
    type: 'HUMIDITY',
    unit: '%',
    deviceId: '2',
    deviceName: 'Bedroom Device',
    status: 'ACTIVE',
    description: 'Humidity sensor for bedroom environment',
    createdAt: '2025-01-20T08:15:00Z',
    updatedAt: '2025-04-27T14:20:00Z',
  },
  {
    id: '3',
    name: 'Kitchen Light Level',
    type: 'LIGHT',
    unit: 'lux',
    deviceId: '3',
    deviceName: 'Kitchen Device',
    status: 'ACTIVE',
    description: 'Ambient light sensor for kitchen',
    createdAt: '2025-02-01T09:45:00Z',
    updatedAt: '2025-04-27T14:21:00Z',
  },
];

// Mock sensor data readings (sensor data points over time)
export const mockSensorDataReadings = {
  '1': [ // Temperature sensor readings
    { id: '1', sensorId: '1', value: 24.5, timestamp: new Date(Date.now() - 30000).toISOString() },
    { id: '2', sensorId: '1', value: 24.7, timestamp: new Date(Date.now() - 20000).toISOString() },
    { id: '3', sensorId: '1', value: 25.1, timestamp: new Date().toISOString() },
  ],
  '2': [ // Humidity sensor readings
    { id: '4', sensorId: '2', value: 55, timestamp: new Date(Date.now() - 30000).toISOString() },
    { id: '5', sensorId: '2', value: 56, timestamp: new Date(Date.now() - 20000).toISOString() },
    { id: '6', sensorId: '2', value: 58, timestamp: new Date().toISOString() },
  ],
  '3': [ // Light sensor readings
    { id: '7', sensorId: '3', value: 450, timestamp: new Date(Date.now() - 30000).toISOString() },
    { id: '8', sensorId: '3', value: 480, timestamp: new Date(Date.now() - 20000).toISOString() },
    { id: '9', sensorId: '3', value: 520, timestamp: new Date().toISOString() },
  ],
};

// Store for mock sensor current readings (in-memory)
let mockSensorCurrentValues = {
  '1': 25.1, // Temperature
  '2': 58,   // Humidity
  '3': 520,  // Light
};

export const getMockSensorCurrentValue = (sensorId) => {
  return mockSensorCurrentValues[sensorId] || 0;
};

export const setMockSensorCurrentValue = (sensorId, value) => {
  if (mockSensorCurrentValues.hasOwnProperty(sensorId)) {
    mockSensorCurrentValues[sensorId] = value;
  }
};

// Generate realistic sensor data based on sensor type
export const generateMockSensorDataBySensorId = (sensorId) => {
  const sensor = mockSensors.find((s) => s.id === sensorId);
  if (!sensor) return null;

  let value;
  switch (sensor.type) {
    case 'TEMPERATURE':
      // Realistic temperature: 18-28°C with slight variation
      value = 20 + Math.random() * 8;
      break;
    case 'HUMIDITY':
      // Realistic humidity: 40-70% with slight variation
      value = 45 + Math.random() * 25;
      break;
    case 'LIGHT':
      // Realistic light level: 200-800 lux with variation
      value = 300 + Math.random() * 500;
      break;
    default:
      value = Math.random() * 100;
  }

  // Update current value
  mockSensorCurrentValues[sensorId] = parseFloat(value.toFixed(2));

  return {
    id: `reading-${sensorId}-${Date.now()}`,
    sensorId: sensorId,
    value: parseFloat(value.toFixed(2)),
    timestamp: new Date().toISOString(),
  };
};

// Keep backward compatibility: generate mock sensor data with all types
export const generateMockSensorData = () => {
  return {
    temperature: 20 + Math.random() * 8,     // 20-28°C
    humidity: 45 + Math.random() * 25,        // 45-70%
    light: 300 + Math.random() * 500,         // 300-800 lux
    timestamp: new Date().toISOString(),
  };
};

/**
 * Generate comprehensive sensor trend data for charts
 * Simulates realistic sensor readings over the last N hours
 * Similar to backend SensorData format
 * @param {string} sensorId - The sensor ID
 * @param {number} hoursBack - Number of hours back (default: 24)
 * @returns {Array} Array of sensor readings with timestamps
 */
export const generateMockSensorTrendData = (sensorId, hoursBack = 24) => {
  const sensor = mockSensors.find((s) => s.id === sensorId);
  if (!sensor) return [];

  const dataPoints = [];
  const now = Date.now();
  const intervalMs = (hoursBack * 60 * 60 * 1000) / 48; // 48 data points

  let baseValue, variation;

  // Define sensor-specific realistic patterns
  switch (sensor.type) {
    case 'TEMPERATURE':
      baseValue = 22;
      variation = 3;
      break;
    case 'HUMIDITY':
      baseValue = 55;
      variation = 10;
      break;
    case 'LIGHT':
      baseValue = 400;
      variation = 300;
      break;
    default:
      baseValue = 50;
      variation = 10;
  }

  // Generate 48 data points with realistic trends
  for (let i = 0; i < 48; i++) {
    const timestamp = new Date(now - (47 - i) * intervalMs);
    
    // Combine trend, noise, and cycle for realistic data
    const trendComponent = Math.sin((i / 48) * Math.PI) * variation * 0.5;
    const noiseComponent = (Math.random() - 0.5) * variation * 0.4;
    const cycleComponent = Math.sin((i / 48) * Math.PI * 2) * variation * 0.3;
    
    let value = baseValue + trendComponent + noiseComponent + cycleComponent;

    // Clamp to realistic ranges
    switch (sensor.type) {
      case 'TEMPERATURE':
        value = Math.max(18, Math.min(28, value));
        break;
      case 'HUMIDITY':
        value = Math.max(30, Math.min(90, value));
        break;
      case 'LIGHT':
        value = Math.max(0, Math.min(1000, value));
        break;
    }

    dataPoints.push({
      id: `${sensorId}-trend-${i}`,
      sensorId: sensorId,
      value: parseFloat(value.toFixed(2)),
      timestamp: timestamp.toISOString(),
    });
  }

  return dataPoints;
};

/**
 * Generate sensor history data for specific time range
 * @param {string} sensorId - The sensor ID
 * @param {Date} fromTime - Start time
 * @param {Date} toTime - End time
 * @returns {Array} Sensor readings within time range
 */
export const generateMockSensorHistoryData = (sensorId, fromTime, toTime) => {
  if (!fromTime) {
    fromTime = new Date(Date.now() - 24 * 60 * 60 * 1000);
  }
  if (!toTime) {
    toTime = new Date();
  }

  const hoursBack = (toTime - fromTime) / (60 * 60 * 1000);
  return generateMockSensorTrendData(sensorId, Math.max(1, hoursBack));
};

// Store for mock device states (in-memory)
let mockDeviceStates = {};
mockDevices.forEach((device) => {
  mockDeviceStates[device.id] = device.status;
});

export const getMockDeviceStates = () => mockDeviceStates;

export const setMockDeviceState = (deviceId, status) => {
  if (mockDeviceStates.hasOwnProperty(deviceId)) {
    mockDeviceStates[deviceId] = status;
  }
};
