import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function DeviceAccessManage() {
  const initialData = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    deviceName: `門禁設備 ${i + 1}`,
    location: `區域 ${Math.ceil((i + 1) / 3)}`,
    type: i % 2 === 0 ? "刷卡機" : "閘門",
    status: i % 3 === 0 ? "故障" : "正常",
  }));

  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = data.filter(
    (item) =>
      item.deviceName.includes(search.trim()) ||
      item.location.includes(search.trim()) ||
      item.type.includes(search.trim())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pageData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const toggleStatus = (id) => {
    const device = data.find((x) => x.id === id);
    Swal.fire({
      title: `切換 ${device.deviceName} 狀態`,
      text: `目前狀態: ${device.status}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "切換",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        setData((prev) =>
          prev.map((x) =>
            x.id === id
              ? {
                  ...x,
                  status: x.status === "正常" ? "故障" : "正常",
                }
              : x
          )
        );
        Swal.fire("狀態已更新", "", "success");
      }
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">設備門禁管理</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="搜尋設備名稱、區域或類型"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="form-control"
          />
        </div>
      </div>

      <table className="table table-bordered text-center shadow-sm">
        <thead className="table-info">
          <tr>
            <th>#</th>
            <th>設備名稱</th>
            <th>所在區域</th>
            <th>設備類型</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr>
              <td colSpan="6">查無資料</td>
            </tr>
          ) : (
            pageData.map((item, idx) => (
              <tr key={item.id}>
                <td>{(page - 1) * pageSize + idx + 1}</td>
                <td>{item.deviceName}</td>
                <td>{item.location}</td>
                <td>{item.type}</td>
                <td>
                  {item.status === "正常" ? (
                    <span className="badge bg-success">
                      <i className="fas fa-check-circle me-1"></i> 正常
                    </span>
                  ) : (
                    <span className="badge bg-danger">
                      <i className="fas fa-exclamation-triangle me-1"></i> 故障
                    </span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(item.id)}
                    className="btn btn-sm btn-primary"
                  >
                    切換狀態
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
