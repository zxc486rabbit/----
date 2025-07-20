// 後台管理功能
import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function AdminManage() {
  const [data, setData] = useState([
    { id: 1, name: "管理員A", role: "超級管理員", status: "啟用" },
    { id: 2, name: "管理員B", role: "一般管理員", status: "啟用" },
    { id: 3, name: "管理員C", role: "一般管理員", status: "停用" },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = data.filter(
    (item) =>
      item.name.includes(search.trim()) || item.role.includes(search.trim())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const nextStatus = (status) => (status === "啟用" ? "停用" : "啟用");

  const toggleStatus = (item) => {
    Swal.fire({
      title: "切換狀態？",
      text: `目前狀態：${item.status}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "切換",
      cancelButtonText: "取消",
    }).then((res) => {
      if (res.isConfirmed) {
        setData((prev) =>
          prev.map((v) =>
            v.id === item.id ? { ...v, status: nextStatus(v.status) } : v
          )
        );
        Swal.fire("狀態已更新", "", "success");
      }
    });
  };

  const deleteItem = (id) => {
    Swal.fire({
      title: "確定刪除？",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "刪除",
      cancelButtonText: "取消",
    }).then((res) => {
      if (res.isConfirmed) {
        setData((prev) => prev.filter((v) => v.id !== id));
        Swal.fire("刪除成功", "", "success");
      }
    });
  };

  const addItem = () => {
    Swal.fire({
      title: "新增管理員",
      html: `
        <input id="name" class="swal2-input" placeholder="姓名">
        <input id="role" class="swal2-input" placeholder="角色">
      `,
      showCancelButton: true,
      confirmButtonText: "新增",
      cancelButtonText: "取消",
      preConfirm: () => {
        const name = document.getElementById("name").value.trim();
        const role = document.getElementById("role").value.trim();
        if (!name || !role) {
          Swal.showValidationMessage("請填寫完整資料");
          return false;
        }
        return { name, role };
      },
    }).then((res) => {
      if (res.isConfirmed) {
        const newItem = {
          id: Date.now(),
          name: res.value.name,
          role: res.value.role,
          status: "啟用",
        };
        setData((prev) => [newItem, ...prev]);
        Swal.fire("新增成功", "", "success");
      }
    });
  };

  const editItem = (item) => {
    Swal.fire({
      title: "編輯管理員",
      html: `
        <input id="name" class="swal2-input" placeholder="姓名" value="${item.name}">
        <input id="role" class="swal2-input" placeholder="角色" value="${item.role}">
      `,
      showCancelButton: true,
      confirmButtonText: "儲存",
      cancelButtonText: "取消",
      preConfirm: () => {
        const name = document.getElementById("name").value.trim();
        const role = document.getElementById("role").value.trim();
        if (!name || !role) {
          Swal.showValidationMessage("請填寫完整資料");
          return false;
        }
        return { name, role };
      },
    }).then((res) => {
      if (res.isConfirmed) {
        setData((prev) =>
          prev.map((v) =>
            v.id === item.id
              ? { ...v, name: res.value.name, role: res.value.role }
              : v
          )
        );
        Swal.fire("更新成功", "", "success");
      }
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">支付計費系統 - 後台管理功能</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="搜尋姓名或角色"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <button onClick={addItem} className="btn btn-success w-100">
            新增
          </button>
        </div>
      </div>

      <table className="table table-bordered text-center shadow-sm">
        <thead className="table-info">
          <tr>
            <th>#</th>
            <th>姓名</th>
            <th>角色</th>
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
                <td>{item.role}</td>
                <td>
                  <span
                    className={`badge ${
                      item.status === "啟用" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(item)}
                    className="btn btn-sm btn-primary me-2"
                  >
                    切換狀態
                  </button>
                  <button
                    onClick={() => editItem(item)}
                    className="btn btn-sm btn-warning me-2"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
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