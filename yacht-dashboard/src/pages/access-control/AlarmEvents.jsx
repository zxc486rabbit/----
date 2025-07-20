import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function AlarmEvents() {
  const initialData = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    timestamp: `2024-07-1${i % 9 + 1} 12:${(i * 3) % 60}:00`,
    device: `設備 ${Math.ceil((i + 1) / 3)}`,
    description: `異常事件 ${i + 1}`,
    status: i % 2 === 0 ? "未處理" : "已處理",
  }));

  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = data.filter(
    (item) =>
      item.device.includes(search.trim()) ||
      item.description.includes(search.trim())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pageData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const markAsProcessed = (id) => {
    Swal.fire({
      title: "確認處理此事件？",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "確認",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        setData((prev) =>
          prev.map((x) =>
            x.id === id
              ? { ...x, status: "已處理" }
              : x
          )
        );
        Swal.fire("狀態已更新", "", "success");
      }
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">異常警示事件</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="搜尋設備或事件描述"
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
            <th>時間</th>
            <th>設備</th>
            <th>事件描述</th>
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
                <td>{item.timestamp}</td>
                <td>{item.device}</td>
                <td>{item.description}</td>
                <td>
                  {item.status === "未處理" ? (
                    <span className="badge bg-danger">
                      <i className="fas fa-exclamation-circle me-1"></i> 未處理
                    </span>
                  ) : (
                    <span className="badge bg-success">
                      <i className="fas fa-check-circle me-1"></i> 已處理
                    </span>
                  )}
                </td>
                <td>
                  {item.status === "未處理" && (
                    <button
                      onClick={() => markAsProcessed(item.id)}
                      className="btn btn-sm btn-primary"
                    >
                      標記已處理
                    </button>
                  )}
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