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

// Simulated sensor readings with realistic values
export const generateMockSensorData = () => {
  return {
    temperature: 25 + Math.random() * 5, // 25-30°C
    humidity: 50 + Math.random() * 15, // 50-65%
    light: Math.random() * 800, // 0-800 lux
    timestamp: new Date().toISOString(),
  };
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
