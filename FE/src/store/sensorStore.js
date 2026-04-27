import { create } from 'zustand';

const useSensorStore = create((set) => ({
  sensors: {
    temperature: null,
    humidity: null,
    light: null,
    timestamp: null,
  },

  sensorHistory: {},

  setSensorData: (data) =>
    set((state) => ({
      sensors: {
        ...state.sensors,
        ...data,
        timestamp: new Date().toISOString(),
      },
    })),

  addSensorHistory: (sensorId, value, timestamp) =>
    set((state) => ({
      sensorHistory: {
        ...state.sensorHistory,
        [sensorId]: [
          ...(state.sensorHistory[sensorId] || []),
          { value, timestamp: timestamp || new Date().toISOString() },
        ].slice(-100), // Keep last 100 readings
      },
    })),

  clearHistory: () =>
    set({
      sensorHistory: {},
    }),
}));

export default useSensorStore;
export { useSensorStore };
