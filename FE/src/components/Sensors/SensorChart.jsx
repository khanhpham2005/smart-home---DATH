import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './SensorChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SensorChart = ({ data, label, color }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-placeholder">
        <p>No data available yet</p>
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) =>
      new Date(d.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    ),
    datasets: [
      {
        label,
        data: data.map((d) => d.value),
        borderColor: color,
        backgroundColor: color + '20',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          drawBorder: false,
          color: '#e0e0e0',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default SensorChart;
