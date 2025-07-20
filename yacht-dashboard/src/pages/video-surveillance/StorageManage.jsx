import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function StorageManage() {
  const [data, setData] = useState([
    { id: 1, name: "儲存設備 A", capacity: "2TB", status: "正常" },
    { id: 2, name: "儲存設備 B", capacity: "4TB", status: "異常" },
    { id: 3, name: "儲存設備 C", capacity: "1TB", status: "正常" },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = data.filter(
    (item) => item.name.includes(search.trim()) || item.capacity.includes(search.trim())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pageData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const toggleStatus = (item) => {
    Swal.fire({
      title: "確定切換狀態？",
      text: `目前狀態為「${item.status}」`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "切換",
      cancelButtonText: "取消",
    }).then((res) => {
      if (res.isConfirmed) {
        setData((prev) =>
          prev.map((s) =>
            s.id === item.id
              ? { ...s, status: s.status === "正常" ? "異常" : "正常" }
              : s
          )
        );
        Swal.fire("狀態已更新", "", "success");
      }
    });
  };

  const deleteStorage = (id) => {
    Swal.fire({
      title: "確定刪除？",
      text: "刪除後無法復原！",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "刪除",
      cancelButtonText: "取消",
    }).then((res) => {
      if (res.isConfirmed) {
        setData((prev) => prev.filter((s) => s.id !== id));
        Swal.fire("刪除成功", "", "success");
      }
    });
  };

  const editStorage = (item) => {
    Swal.fire({
      title: "編輯儲存設備",
      html: `
        <input id="name" class="swal2-input" placeholder="名稱" value="${item.name}">
        <input id="capacity" class="swal2-input" placeholder="容量" value="${item.capacity}">
      `,
      showCancelButton: true,
      confirmButtonText: "儲存",
      cancelButtonText: "取消",
      preConfirm: () => {
        const name = document.getElementById("name").value.trim();
        const capacity = document.getElementById("capacity").value.trim();
        if (!name || !capacity) {
          Swal.showValidationMessage("請輸入完整資料");
          return false;
        }
        return { name, capacity };
      },
    }).then((res) => {
      if (res.isConfirmed) {
        setData((prev) =>
          prev.map((s) =>
            s.id === item.id
              ? { ...s, name: res.value.name, capacity: res.value.capacity }
              : s
          )
        );
        Swal.fire("更新成功", "", "success");
      }
    });
  };

  const addStorage = () => {
    Swal.fire({
      title: "新增儲存設備",
      html: `
        <input id="name" class="swal2-input" placeholder="名稱">
        <input id="capacity" class="swal2-input" placeholder="容量">
      `,
      showCancelButton: true,
      confirmButtonText: "新增",
      cancelButtonText: "取消",
      preConfirm: () => {
        const name = document.getElementById("name").value.trim();
        const capacity = document.getElementById("capacity").value.trim();
        if (!name || !capacity) {
          Swal.showValidationMessage("請輸入完整資料");
          return false;
        }
        return { name, capacity };
      },
    }).then((res) => {
      if (res.isConfirmed) {
        const newItem = {
          id: Date.now(),
          name: res.value.name,
          capacity: res.value.capacity,
          status: "正常",
        };
        setData((prev) => [newItem, ...prev]);
        Swal.fire("新增成功", "", "success");
      }
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">影像監控系統 - 影像儲存管理</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="搜尋名稱或容量"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <button onClick={addStorage} className="btn btn-success w-100">
            新增
          </button>
        </div>
      </div>

      <table className="table table-bordered text-center shadow-sm">
        <thead className="table-info">
          <tr>
            <th>#</th>
            <th>名稱</th>
            <th>容量</th>
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
                <td>{item.name}</td>
                <td>{item.capacity}</td>
                <td>
                  {item.status === "正常" ? (
                    <span className="badge bg-success">
                      <i className="fas fa-check-circle me-1"></i> 正常
                    </span>
                  ) : (
                    <span className="badge bg-danger">
                      <i className="fas fa-exclamation-triangle me-1"></i> 異常
                    </span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(item)}
                    className="btn btn-sm btn-primary me-2"
                  >
                    切換狀態
                  </button>
                  <button
                    onClick={() => editStorage(item)}
                    className="btn btn-sm btn-warning me-2"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => deleteStorage(item.id)}
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