import { useState } from "react";

export default function AccessRecords() {
  const initialRecords = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `人員 ${i + 1}`,
    cardId: `AIC-${1000 + i}`,
    time: `2024-07-18 0${i % 9 + 1}:30`,
    action: i % 2 === 0 ? "進入" : "離開",
  }));

  const [records] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = records.filter(
    (r) =>
      r.name.includes(search.trim()) ||
      r.cardId.includes(search.trim()) ||
      r.action.includes(search.trim())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageRecords = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">進出識別紀錄</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="搜尋人員或卡號"
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
            <th>人員姓名</th>
            <th>卡號</th>
            <th>時間</th>
            <th>動作</th>
          </tr>
        </thead>
        <tbody>
          {pageRecords.length === 0 ? (
            <tr>
              <td colSpan="5">查無資料</td>
            </tr>
          ) : (
            pageRecords.map((rec, idx) => (
              <tr key={rec.id}>
                <td>{(page - 1) * pageSize + idx + 1}</td>
                <td>{rec.name}</td>
                <td>{rec.cardId}</td>
                <td>{rec.time}</td>
                <td>
                  {rec.action === "進入" ? (
                    <span className="badge bg-success">
                      <i className="fas fa-door-open me-1"></i> 進入
                    </span>
                  ) : (
                    <span className="badge bg-danger">
                      <i className="fas fa-door-closed me-1"></i> 離開
                    </span>
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