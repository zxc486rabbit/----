import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function OwnerShipManage() {
  const [data, setData] = useState([
    { id: 1, owner: "船主 1", ship: "船舶 1", status: "啟用" },
    { id: 2, owner: "船主 2", ship: "船舶 2", status: "維護" },
    { id: 3, owner: "船主 3", ship: "船舶 3", status: "停用" },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = data.filter(
    (item) =>
      item.owner.includes(search.trim()) || item.ship.includes(search.trim())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pageData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const nextStatus = (status) => {
    if (status === "啟用") return "維護";
    if (status === "維護") return "停用";
    return "啟用";
  };

  const confirmToggleStatus = (id, currentStatus) => {
    Swal.fire({
      title: `確定切換狀態？`,
      text: `目前狀態為「${currentStatus}」`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "切換",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        setData((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, status: nextStatus(item.status) }
              : item
          )
        );
        Swal.fire("狀態已更新", "", "success");
      }
    });
  };

  const deleteShip = (id) => {
    Swal.fire({
      title: "確定刪除？",
      text: "刪除後將無法復原！",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "刪除",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        setData((prev) => prev.filter((item) => item.id !== id));
        Swal.fire("刪除成功", "", "success");
      }
    });
  };

  const addShip = () => {
    Swal.fire({
      title: "新增船主與船舶",
      html: `
        <input id="owner" class="swal2-input" placeholder="船主">
        <input id="ship" class="swal2-input" placeholder="船舶">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "新增",
      cancelButtonText: "取消",
      preConfirm: () => {
        const owner = document.getElementById("owner").value.trim();
        const ship = document.getElementById("ship").value.trim();
        if (!owner || !ship) {
          Swal.showValidationMessage("請填寫完整資料");
          return false;
        }
        if (data.some((item) => item.ship === ship)) {
          Swal.showValidationMessage("該船舶已存在");
          return false;
        }
        return { owner, ship };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newItem = {
          id: Date.now(),
          owner: result.value.owner,
          ship: result.value.ship,
          status: "啟用",
        };
        setData((prev) => [newItem, ...prev]);
        Swal.fire("新增成功", "", "success");
      }
    });
  };

  const editShip = (item) => {
    Swal.fire({
      title: "編輯資料",
      html: `
        <input id="owner" class="swal2-input" placeholder="船主" value="${item.owner}">
        <input id="ship" class="swal2-input" placeholder="船名" value="${item.ship}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "儲存",
      cancelButtonText: "取消",
      preConfirm: () => {
        const owner = document.getElementById("owner").value.trim();
        const ship = document.getElementById("ship").value.trim();
        if (!owner || !ship) {
          Swal.showValidationMessage("請填寫完整資料");
          return false;
        }
        return { owner, ship };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setData((prev) =>
          prev.map((row) =>
            row.id === item.id
              ? { ...row, owner: result.value.owner, ship: result.value.ship }
              : row
          )
        );
        Swal.fire("更新成功", "", "success");
      }
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">船主船隻管理</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="搜尋船主或船名"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <button onClick={addShip} className="btn btn-success w-100">
            新增
          </button>
        </div>
      </div>

      <table className="table table-bordered text-center shadow-sm">
        <thead className="table-info">
          <tr>
            <th>#</th>
            <th>船主</th>
            <th>船名</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr>
              <td colSpan="5">查無資料</td>
            </tr>
          ) : (
            pageData.map((item, idx) => (
              <tr key={item.id}>
                <td>{(page - 1) * pageSize + idx + 1}</td>
                <td>{item.owner}</td>
                <td>{item.ship}</td>
                <td>
                  {item.status === "啟用" && (
                    <span className="badge bg-success">
                      <i className="fas fa-check-circle me-1"></i> 啟用
                    </span>
                  )}
                  {item.status === "維護" && (
                    <span className="badge bg-warning text-dark">
                      <i className="fas fa-tools me-1"></i> 維護
                    </span>
                  )}
                  {item.status === "停用" && (
                    <span className="badge bg-secondary">
                      <i className="fas fa-ban me-1"></i> 停用
                    </span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => confirmToggleStatus(item.id, item.status)}
                    className="btn btn-sm btn-primary me-2"
                  >
                    切換狀態
                  </button>
                  <button
                    onClick={() => editShip(item)}
                    className="btn btn-sm btn-warning me-2"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => deleteShip(item.id)}
                    className="btn btn-sm btn-danger"
                  >
                    刪除
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