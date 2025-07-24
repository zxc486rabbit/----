import { useEffect, useRef, useState } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

// 🔺 Plugin: 繪製直向線
const verticalLinePlugin = {
  id: "verticalLine",
  afterDraw: (chart) => {
    const { ctx, chartArea: { top, bottom }, scales: { x } } = chart;
    const index = chart.data.labels.indexOf(chart.config.options.verticalLineLabel);
    if (index !== -1) {
      const xPos = x.getPixelForValue(index);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(xPos, top);
      ctx.lineTo(xPos, bottom);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.stroke();
      ctx.restore();
    }
  },
};

Chart.register(verticalLinePlugin);

export default function History() {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedDock, setSelectedDock] = useState(1);
  const [dockStats, setDockStats] = useState({ power: 0, water: 0, frequency: 0 });
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selectedHourLabel, setSelectedHourLabel] = useState("12:00");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDateRange({ start: today, end: today });
  }, []);

  const generateDockData = () => {
    return {
      labels: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, "0")}:00`),
      powerData: Array.from({ length: 24 }, () => Math.floor(100 + Math.random() * 50)),
      waterData: Array.from({ length: 24 }, () => Math.floor(80 + Math.random() * 20)),
      frequencyAvg: (59 + Math.random() * 2).toFixed(2),
    };
  };

  const renderChart = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const dockData = generateDockData();
    setDockStats({
      power: dockData.powerData.reduce((a, b) => a + b, 0),
      water: dockData.waterData.reduce((a, b) => a + b, 0),
      frequency: dockData.frequencyAvg,
    });

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: dockData.labels,
        datasets: [
          {
            label: "用電量 (kWh)",
            data: dockData.powerData,
            borderColor: "#fbc02d",
            fill: false,
            tension: 0.3,
          },
          {
            label: "用水量 (m³)",
            data: dockData.waterData,
            borderColor: "#42a5f5",
            fill: false,
            tension: 0.3,
          },
        ],
      },
      options: {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    tooltip: {
      enabled: true,
      mode: "index",
      intersect: false,
      callbacks: {
        title: (tooltipItems) => {
          return `時間：${tooltipItems[0].label}`;
        },
        label: (tooltipItem) => {
          const label = tooltipItem.dataset.label || "";
          const value = tooltipItem.formattedValue;
          return `${label}: ${value}`;
        },
      },
    },
    crosshairLine: {
      color: "red",
      width: 1,
    },
  },
  scales: {
    y: { beginAtZero: true },
  },
},
plugins: [
  {
    id: "crosshairLine",
    afterDraw(chart) {
      if (chart.tooltip?._active?.length) {
        const ctx = chart.ctx;
        const x = chart.tooltip._active[0].element.x;
        const topY = chart.chartArea.top;
        const bottomY = chart.chartArea.bottom;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.restore();
      }
    },
  },
],
    });
  };

  useEffect(() => {
    renderChart();
  }, [selectedDock, selectedHourLabel]);

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const handleQuery = () => {
    const randomHour = Math.floor(Math.random() * 24);
    setSelectedHourLabel(`${String(randomHour).padStart(2, "0")}:00`);
    renderChart();
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-4 text-primary">水電管理系統 - 歷史紀錄查詢</h4>

      {/* 🔹 查詢區間（美化後） */}
      <div className="row g-2 align-items-center mb-3">
        <div className="col-auto d-flex align-items-center gap-2">
          <label htmlFor="start" className="form-label mb-0 small" style={{whiteSpace: "nowrap"}}>開始日期</label>
          <input
            type="date"
            id="start"
            name="start"
            className="form-control form-control-sm"
            value={dateRange.start}
            onChange={handleDateChange}
            style={{ minWidth: "140px" }}
          />
        </div>
        <div className="col-auto d-flex align-items-center gap-2">
          <label htmlFor="end" className="form-label mb-0 small" style={{whiteSpace: "nowrap"}}>結束日期</label>
          <input
            type="date"
            id="end"
            name="end"
            className="form-control form-control-sm"
            value={dateRange.end}
            onChange={handleDateChange}
            style={{ minWidth: "140px"}}
          />
        </div>
        <div className="col-auto">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={handleQuery}
          >
            查詢
          </button>
        </div>
      </div>

      {/* 🔹 船席切換按鈕 */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {Array.from({ length: 11 }, (_, i) => (
          <button
            key={i}
            className={`btn btn-sm ${selectedDock === i + 1 ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setSelectedDock(i + 1)}
          >
            船席 {i + 1}
          </button>
        ))}
      </div>

      {/* 🔹 即時資訊區塊 */}
      <div className="row text-center mb-4">
        <div className="col-md-4">
          <div className="p-3 bg-white shadow rounded">
            <div className="text-muted small">用電量</div>
            <div className="fs-4 fw-bold text-warning">{dockStats.power} kWh</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 bg-white shadow rounded">
            <div className="text-muted small">用水量</div>
            <div className="fs-4 fw-bold text-primary">{dockStats.water} m³</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 bg-white shadow rounded">
            <div className="text-muted small">頻率</div>
            <div className="fs-4 fw-bold text-success">{dockStats.frequency} Hz</div>
          </div>
        </div>
      </div>

      {/* 🔹 圖表 */}
      <div className="p-4 bg-white shadow rounded" style={{ height: "400px" }}>
        <h5 className="text-primary mb-3">船席 {selectedDock} - 用電 / 用水 趨勢圖</h5>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
