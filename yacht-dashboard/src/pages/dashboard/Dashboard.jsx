import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  FaBolt,
  FaTint,
  FaShip,
  FaUsers,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
} from "react-icons/fa";

export default function Dashboard() {
  const chartRef = useRef(null);
  const [activeKey, setActiveKey] = useState("electricity");

  const chartDataSets = {
    electricity: {
      label: "每日用電量",
      data: [1200, 1350, 1100, 1500, 1700, 1600, 1800],
      color: "#fbc02d",
    },
    water: {
      label: "每日用水量",
      data: [800, 750, 820, 790, 810, 780, 770],
      color: "#42a5f5",
    },
    ship: {
      label: "每日停泊船舶數",
      data: [20, 21, 22, 23, 24, 25, 26],
      color: "#26a69a",
    },
    people: {
      label: "每日進出人次",
      data: [1000, 1100, 1200, 1150, 1300, 1250, 1238],
      color: "#66bb6a",
    },
    alert: {
      label: "異常警示次數",
      data: [1, 2, 1, 3, 2, 4, 3],
      color: "#ef5350",
    },
    bill: {
      label: "帳單金額 (千元)",
      data: [120, 130, 110, 125, 140, 135, 124],
      color: "#ab47bc",
    },
  };

  const cardInfo = [
    { key: "electricity", label: "總用電量", value: "12,345 kWh", icon: <FaBolt className="text-warning me-1" /> },
    { key: "water", label: "總用水量", value: "8,765 m³", icon: <FaTint className="text-primary me-1" /> },
    { key: "ship", label: "停泊船舶數量", value: "24 艘", icon: <FaShip className="text-info me-1" /> },
    { key: "people", label: "進出人次", value: "1,238 人", icon: <FaUsers className="text-success me-1" /> },
    { key: "alert", label: "當前異常警示", value: "3 筆", icon: <FaExclamationTriangle className="text-danger me-1" /> },
    { key: "bill", label: "懸掛帳單", value: "NT$ 124,000", icon: <FaFileInvoiceDollar className="text-secondary me-1" /> },
  ];

  useEffect(() => {
    const ctx = document.getElementById("detailChart").getContext("2d");
    const dataset = chartDataSets[activeKey];

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["週一", "週二", "週三", "週四", "週五", "週六", "週日"],
        datasets: [
          {
            label: dataset.label,
            data: dataset.data,
            fill: false,
            borderColor: dataset.color,
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
  }, [activeKey]);

  return (
    <div style={{ fontSize: "1rem", lineHeight: 1.5 }}>
      <nav className="navbar navbar-light bg-white shadow-sm mb-4">
        <div className="container-fluid">
          <span className="navbar-brand mb-0" style={{ color: "#0599BB" }}>
            遊艇碼頭管理平台 Dashboard
          </span>
        </div>
      </nav>

      <div className="container mt-4">
        <div className="p-4 bg-white shadow rounded">
          <div className="row text-center">
            {cardInfo.map((card) => (
              <div
                key={card.key}
                className="col-md-2"
                style={{ cursor: "pointer" }}
                onClick={() => setActiveKey(card.key)}
              >
                <div className="text-muted small">{card.label}</div>
                <div className="fs-4 fw-bold">
                  {card.icon} {card.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container p-4 bg-white shadow rounded mt-4">
        <h5 className="text-primary" id="chartTitle">
          {chartDataSets[activeKey].label} 詳情
        </h5>
        <canvas id="detailChart" height="100"></canvas>
      </div>
    </div>
  );
}