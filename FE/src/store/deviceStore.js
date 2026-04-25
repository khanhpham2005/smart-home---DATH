import { create } from 'zustand';

const useDeviceStore = create((set) => ({
  devices: [],

  setDevices: (devices) => set({ devices }),

  updateDevice: (deviceId, updates) =>
    set((state) => ({
      devices: state.devices.map((device) =>
        device.id === deviceId ? { ...device, ...updates } : device
      ),
    })),

  toggleDevice: (deviceId) =>
    set((state) => ({
      devices: state.devices.map((device) =>
        device.id === deviceId ? { ...device, status: !device.status } : device
      ),
    })),

  addDevice: (device) =>
    set((state) => ({
      devices: [...state.devices, device],
    })),

  removeDevice: (deviceId) =>
    set((state) => ({
      devices: state.devices.filter((device) => device.id !== deviceId),
    })),
}));

export default useDeviceStore;
export { useDeviceStore };
