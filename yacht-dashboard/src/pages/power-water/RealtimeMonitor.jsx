import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RealtimeMonitor() {
  const [phaseData, setPhaseData] = useState({
    R: { voltage: 220, current: 1.0 },
    S: { voltage: 220, current: 1.0 },
    T: { voltage: 220, current: 1.0 },
  });

  const [dockData, setDockData] = useState(
    Array.from({ length: 11 }, (_, i) => ({
      dockNumber: i + 1,
      isActive: Math.random() > 0.3,
      power: 0,
      frequency: 60,
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // 更新 R/S/T 相的電壓與電流
      setPhaseData({
        R: {
          voltage: (210 + Math.random() * 20).toFixed(0),
          current: (Math.random() * 2 + 1).toFixed(2),
        },
        S: {
          voltage: (210 + Math.random() * 20).toFixed(0),
          current: (Math.random() * 2 + 1).toFixed(2),
        },
        T: {
          voltage: (210 + Math.random() * 20).toFixed(0),
          current: (Math.random() * 2 + 1).toFixed(2),
        },
      });

      // 船席更新
      setDockData((prev) =>
        prev.map((dock) => {
          const active = Math.random() > 0.3;
          return {
            ...dock,
            isActive: active,
            power: active
              ? (parseFloat(dock.power) + Math.random() * 0.5).toFixed(2)
              : 0,
            frequency: active ? (59.8 + Math.random() * 0.4).toFixed(2) : 0,
          };
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (

    <div className="container mt-4">
      <h4 className="mb-4 text-primary">碼頭監控系統</h4>

      {/* 台電電錶模擬 */}
      <div className="row text-center mb-4">
        {["R", "S", "T"].map((phase, i) => (
          <div key={phase} className="col-md-4 mb-3">
            <div
              className={`p-3 bg-white shadow rounded border-start border-4 ${["border-danger", "border-warning", "border-primary"][i]
                }`}
            >
              <div className="text-muted fw-bold mb-1">{phase} 相</div>
              <div
                className={`fs-3 fw-bold ${["text-danger", "text-warning", "text-primary"][i]
                  }`}
              >
                {phaseData[phase].voltage} V
              </div>
              <div className="text-muted small">
                電流：{phaseData[phase].current} A
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 船席資訊 */}
      <div className="row">
        {dockData.map((dock) => (
          <div key={dock.dockNumber} className="col-md-4 mb-4">
            <div
              className={`p-3 shadow-sm rounded border h-100 d-flex flex-column justify-content-between ${dock.isActive ? "bg-light" : "bg-secondary bg-opacity-25"
                }`}
              style={{ opacity: dock.isActive ? 1 : 0.6 }}
            >
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span
                    className={`fw-bold ${dock.isActive ? "" : "text-muted"
                      }`}
                  >
                    船席 {dock.dockNumber}
                  </span>
                  <span
                    className={`badge ${dock.isActive ? "bg-success" : "bg-dark text-light"
                      }`}
                  >
                    {dock.isActive ? "使用中" : "無人使用"}
                  </span>
                </div>

                <div className="d-flex justify-content-between px-1 mt-2">
                  <span className={dock.isActive ? "" : "text-muted"}>
                    用電：
                    <strong>
                      {dock.isActive ? `${dock.power} kWh` : "—"}
                    </strong>
                  </span>
                  <span className={dock.isActive ? "" : "text-muted"}>
                    頻率：
                    <strong>
                      {dock.isActive ? `${dock.frequency} Hz` : "—"}
                    </strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
}