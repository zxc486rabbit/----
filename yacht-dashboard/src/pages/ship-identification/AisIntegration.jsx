import { useState } from "react";

export default function AisIntegration() {
  const initialShips = Array.from({ length: 23 }, (_, i) => ({
    id: i + 1,
    name: `船舶 ${i + 1}`,
    mmsi: `41234${1000 + i}`,
    position: `N${25.0 + i.toFixed(2)}, E${121.0 + i.toFixed(2)}`,
    speed: (Math.random() * 20).toFixed(1) + " kn",
    status: Math.random() > 0.5 ? "航行中" : "停泊中",
  }));

  const [ships, setShips] = useState(initialShips);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredShips = ships.filter(
    (ship) =>
      ship.name.includes(search.trim()) || ship.mmsi.includes(search.trim())
  );
  const totalPages = Math.ceil(filteredShips.length / pageSize);

  const pageShips = filteredShips.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">AIS 整合模組</h3>

      <div className="mb-3 row">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="搜尋船名或 MMSI"
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
            <th>船名</th>
            <th>MMSI</th>
            <th>位置</th>
            <th>速度</th>
            <th>狀態</th>
          </tr>
        </thead>
        <tbody>
          {pageShips.length === 0 ? (
            <tr>
              <td colSpan="6">查無資料</td>
            </tr>
          ) : (
            pageShips.map((ship) => (
              <tr key={ship.id}>
                <td>{ship.id}</td>
                <td>{ship.name}</td>
                <td>{ship.mmsi}</td>
                <td>{ship.position}</td>
                <td>{ship.speed}</td>
                <td>
                  {ship.status === "航行中" ? (
                    <span className="badge bg-success">
                      <i className="fas fa-ship me-1"></i> 航行中
                    </span>
                  ) : (
                    <span className="badge bg-secondary">
                      <i className="fas fa-anchor me-1"></i> 停泊中
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 分頁 */}
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