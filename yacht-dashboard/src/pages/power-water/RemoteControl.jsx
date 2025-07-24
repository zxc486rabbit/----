import { useState } from "react";
import Swal from "sweetalert2";

const generateInitialDocks = () =>
  Array.from({ length: 11 }, (_, dockIndex) => ({
    id: dockIndex + 1,
    name: `船席 ${dockIndex + 1}`,
    devices: Array.from({ length: 4 }, (_, deviceIndex) => ({
      id: deviceIndex + 1,
      name: `設備 ${deviceIndex + 1}`,
      enabled: Math.random() > 0.5,
    })),
  }));

export default function RemoteControl() {
  const [docks, setDocks] = useState(generateInitialDocks());
  const [selectedDockId, setSelectedDockId] = useState(1);
  const [search, setSearch] = useState("");

  const selectedDock = docks.find((dock) => dock.id === selectedDockId);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const toggleDevice = (dockId, device) => {
    Swal.fire({
      title: `${device.enabled ? "確定停用" : "確定啟用"} ${device.name} 嗎？`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        setDocks((prev) =>
          prev.map((dock) =>
            dock.id === dockId
              ? {
                  ...dock,
                  devices: dock.devices.map((d) =>
                    d.id === device.id ? { ...d, enabled: !d.enabled } : d
                  ),
                }
              : dock
          )
        );
        Swal.fire(
          `${device.enabled ? "已停用" : "已啟用"}`,
          `${device.name}`,
          "success"
        );
      }
    });
  };

  const filteredDevices = selectedDock.devices.filter((device) =>
    device.name.includes(search.trim())
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">遠端控管功能</h3>

      {/* 🔹 船席切換 */}
      <div className="d-flex flex-wrap gap-2 mb-3">
        {docks.map((dock) => (
          <button
            key={dock.id}
            className={`btn btn-sm ${
              selectedDockId === dock.id ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setSelectedDockId(dock.id)}
          >
            {dock.name}
          </button>
        ))}
      </div>

      {/* 🔍 搜尋 */}
      <div className="mb-3 row">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="搜尋設備名稱"
            value={search}
            onChange={handleSearchChange}
            className="form-control"
          />
        </div>
      </div>

      {/* 📋 設備表格 */}
      <table className="table table-bordered text-center shadow-sm">
        <thead className="table-info">
          <tr>
            <th>設備名稱</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredDevices.length === 0 ? (
            <tr>
              <td colSpan="3">查無資料</td>
            </tr>
          ) : (
            filteredDevices.map((device) => (
              <tr key={device.id}>
                <td>{device.name}</td>
                <td>{device.enabled ? "啟用中" : "停用中"}</td>
                <td>
                  <button
                    className={`btn btn-sm ${
                      device.enabled ? "btn-danger" : "btn-success"
                    }`}
                    onClick={() => toggleDevice(selectedDock.id, device)}
                  >
                    {device.enabled ? "停用" : "啟用"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}