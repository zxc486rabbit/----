import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function CameraManage() {
  const [data, setData] = useState([
    { id: 1, name: "攝影機 A", location: "入口大門", status: "啟用" },
    { id: 2, name: "攝影機 B", location: "停車場", status: "停用" },
    { id: 3, name: "攝影機 C", location: "辦公區", status: "啟用" },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = data.filter(
    (item) =>
      item.name.includes(search.trim()) ||
      item.location.includes(search.trim())
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
          prev.map((cam) =>
            cam.id === item.id
              ? {
                  ...cam,
                  status: cam.status === "啟用" ? "停用" : "啟用",
                }
              : cam
          )
        );
        Swal.fire("狀態已更新", "", "success");
      }
    });
  };

  const deleteCamera = (id) => {
    Swal.fire({
      title: "確定刪除？",
      text: "刪除後無法復原！",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "刪除",
      cancelButtonText: "取消",
    }).then((res) => {
      if (res.isConfirmed) {
        setData((prev) => prev.filter((cam) => cam.id !== id));
        Swal.fire("刪除成功", "", "success");
      }
    });
  };

  const editCamera = (item) => {
    Swal.fire({
      title: "編輯攝影機",
      html: `
        <input id="name" class="swal2-input" placeholder="名稱" value="${item.name}">
        <input id="location" class="swal2-input" placeholder="位置" value="${item.location}">
      `,
      showCancelButton: true,
      confirmButtonText: "儲存",
      cancelButtonText: "取消",
      preConfirm: () => {
        const name = document.getElementById("name").value.trim();
        const location = document.getElementById("location").value.trim();
        if (!name || !location) {
          Swal.showValidationMessage("請輸入完整資料");
          return false;
        }
        return { name, location };
      },
    }).then((res) => {
      if (res.isConfirmed) {
        setData((prev) =>
          prev.map((cam) =>
            cam.id === item.id
              ? { ...cam, name: res.value.name, location: res.value.location }
              : cam
          )
        );
        Swal.fire("更新成功", "", "success");
      }
    });
  };

  const addCamera = () => {
    Swal.fire({
      title: "新增攝影機",
      html: `
        <input id="name" class="swal2-input" placeholder="名稱">
        <input id="location" class="swal2-input" placeholder="位置">
      `,
      showCancelButton: true,
      confirmButtonText: "新增",
      cancelButtonText: "取消",
      preConfirm: () => {
        const name = document.getElementById("name").value.trim();
        const location = document.getElementById("location").value.trim();
        if (!name || !location) {
          Swal.showValidationMessage("請輸入完整資料");
          return false;
        }
        return { name, location };
      },
    }).then((res) => {
      if (res.isConfirmed) {
        const newItem = {
          id: Date.now(),
          name: res.value.name,
          location: res.value.location,
          status: "啟用",
        };
        setData((prev) => [newItem, ...prev]);
        Swal.fire("新增成功", "", "success");
      }
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">影像監控系統 - 攝影機管理</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="搜尋名稱或位置"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <button onClick={addCamera} className="btn btn-success w-100">
            新增
          </button>
        </div>
      </div>

      <table className="table table-bordered text-center shadow-sm">
        <thead className="table-info">
          <tr>
            <th>#</th>
            <th>名稱</th>
            <th>位置</th>
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
            pageData.map((cam, idx) => (
              <tr key={cam.id}>
                <td>{(page - 1) * pageSize + idx + 1}</td>
                <td>{cam.name}</td>
                <td>{cam.location}</td>
                <td>
                  {cam.status === "啟用" ? (
                    <span className="badge bg-success">
                      <i className="fas fa-check-circle me-1"></i> 啟用
                    </span>
                  ) : (
                    <span className="badge bg-secondary">
                      <i className="fas fa-ban me-1"></i> 停用
                    </span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(cam)}
                    className="btn btn-sm btn-primary me-2"
                  >
                    切換狀態
                  </button>
                  <button
                    onClick={() => editCamera(cam)}
                    className="btn btn-sm btn-warning me-2"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => deleteCamera(cam.id)}
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