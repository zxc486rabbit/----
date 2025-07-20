import { useEffect, useState } from "react";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

export default function RealtimeMonitor() {
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const ctx = document.getElementById("realtimeChart").getContext("2d");

    const instance = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: 12 }, (_, i) => `${i + 1}:00`),
        datasets: [
          {
            label: "用電量 (kWh)",
            data: Array.from({ length: 12 }, () => Math.floor(100 + Math.random() * 50)),
            borderColor: "#fbc02d",
            fill: false,
            tension: 0.1,
          },
          {
            label: "用水量 (m³)",
            data: Array.from({ length: 12 }, () => Math.floor(80 + Math.random() * 20)),
            borderColor: "#42a5f5",
            fill: false,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    setChartInstance(instance);

    return () => {
      instance.destroy();
    };
  }, []);

  return (
    <div className="container mt-4">
      <h4 className="mb-4 text-primary">水電管理系統 - 即時監控模組</h4>

      <div className="row text-center mb-4">
        <div className="col-md-3">
          <div className="p-3 bg-white shadow rounded">
            <div className="text-muted small">即時用電量</div>
            <div className="fs-4 fw-bold text-warning">12,345 kWh</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 bg-white shadow rounded">
            <div className="text-muted small">即時用水量</div>
            <div className="fs-4 fw-bold text-primary">8,765 m³</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 bg-white shadow rounded">
            <div className="text-muted small">當前警示</div>
            <div className="fs-4 fw-bold text-danger">3 筆</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="p-3 bg-white shadow rounded">
            <div className="text-muted small">當前功率</div>
            <div className="fs-4 fw-bold text-success">1,234 kW</div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white shadow rounded">
        <h5 className="text-primary mb-3">即時用電/用水趨勢圖</h5>
        <canvas id="realtimeChart" height="100"></canvas>
      </div>
    </div>
  );
}