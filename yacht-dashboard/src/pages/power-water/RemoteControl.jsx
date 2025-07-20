import { useState } from "react";
import Swal from "sweetalert2";

export default function RemoteControl() {
  const initialDevices = Array.from({ length: 17 }, (_, i) => ({
    id: i + 1,
    name: `設備 ${i + 1}`,
    enabled: Math.random() > 0.5,
  }));

  const [devices, setDevices] = useState(initialDevices);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredDevices = devices.filter((device) =>
    device.name.includes(search.trim())
  );
  const totalPages = Math.ceil(filteredDevices.length / pageSize);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const toggleDevice = (device) => {
    Swal.fire({
      title: `${device.enabled ? "確定停用" : "確定啟用"} ${device.name} 嗎？`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        setDevices((prev) =>
          prev.map((d) =>
            d.id === device.id ? { ...d, enabled: !d.enabled } : d
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

  const pageDevices = filteredDevices.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">遠端控管功能</h3>

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

      <table className="table table-bordered text-center shadow-sm">
        <thead className="table-info">
          <tr>
            <th>設備名稱</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {pageDevices.length === 0 ? (
            <tr>
              <td colSpan="3">查無資料</td>
            </tr>
          ) : (
            pageDevices.map((device) => (
              <tr key={device.id}>
                <td>{device.name}</td>
                <td>{device.enabled ? "啟用中" : "停用中"}</td>
                <td>
                  <button
                    className={`btn btn-sm ${
                      device.enabled ? "btn-danger" : "btn-success"
                    }`}
                    onClick={() => toggleDevice(device)}
                  >
                    {device.enabled ? "停用" : "啟用"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 分頁控制 */}
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                上一頁
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                page === totalPages || totalPages === 0 ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                下一頁
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}