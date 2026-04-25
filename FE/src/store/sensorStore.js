import { create } from 'zustand';

const useSensorStore = create((set) => ({
  sensors: {
    temperature: null,
    humidity: null,
    light: null,
    timestamp: null,
  },

  sensorHistory: {
    temperature: [],
    humidity: [],
    light: [],
  },

  setSensorData: (data) =>
    set((state) => ({
      sensors: {
        ...state.sensors,
        ...data,
        timestamp: new Date().toISOString(),
      },
    })),

  addSensorHistory: (type, value) =>
    set((state) => ({
      sensorHistory: {
        ...state.sensorHistory,
        [type]: [...state.sensorHistory[type], { value, timestamp: new Date() }].slice(-100),
      },
    })),

  clearHistory: () =>
    set({
      sensorHistory: {
        temperature: [],
        humidity: [],
        light: [],
      },
    }),
}));

export default useSensorStore;
export { useSensorStore };
