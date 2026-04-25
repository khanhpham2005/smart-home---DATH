# SmartHome IoT Frontend

A React-based frontend for monitoring and controlling SmartHome IoT devices with real-time sensor data and remote device control.

## Features

- **User Authentication**: Secure login system
- **Real-time Monitoring**: Display sensor data (temperature, humidity, light intensity)
- **Device Control**: Toggle devices on/off remotely
- **Data Visualization**: Charts and graphs for sensor trends
- **Responsive Design**: Works on desktop and mobile
- **Automatic Updates**: Real-time data refresh

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Main dashboard
│   ├── Sensors/        # Sensor display components
│   ├── Devices/        # Device control components
│   └── Common/         # Shared components
├── pages/              # Page components
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── DevicesPage.jsx
│   └── SettingsPage.jsx
├── services/           # API services
│   ├── authService.js
│   ├── sensorService.js
│   └── deviceService.js
├── store/              # State management (Zustand)
├── utils/              # Utility functions
├── styles/             # CSS files
├── App.jsx             # Root component
└── index.js            # Entry point
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Environment File**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your API endpoints and Adafruit credentials

3. **Start Development Server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

4. **Build for Production**
   ```bash
   npm run build
   ```

## Configuration

### Environment Variables

- `REACT_APP_API_URL`: Backend API endpoint
- `REACT_APP_ADAFRUIT_URL`: Adafruit IO API URL
- `REACT_APP_ADAFRUIT_USERNAME`: Your Adafruit IO username
- `REACT_APP_ADAFRUIT_KEY`: Your Adafruit IO API key

## API Integration

The frontend communicates with:

1. **Backend API**: For authentication, user management, and device configuration
2. **Adafruit IO**: For real-time sensor data and device control

## Technology Stack

- React 18
- React Router 6
- Axios (HTTP client)
- Chart.js (Data visualization)
- Zustand (State management)
- Lucide React (Icons)
- React Toastify (Notifications)

## Authentication Flow

1. User logs in with credentials
2. Backend validates and returns JWT token
3. Token stored in localStorage
4. Token sent with all API requests
5. Token refreshed automatically when expired

## Real-time Data

Sensor data is updated every 5 seconds by default. Configure update intervals in component settings.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
