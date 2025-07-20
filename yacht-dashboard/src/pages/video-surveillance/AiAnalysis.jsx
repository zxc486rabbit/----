import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function AiAnalysis() {
  const [data, setData] = useState([
    { id: 1, name: "AI 模組 A", type: "人臉辨識", status: "啟用" },
    { id: 2, name: "AI 模組 B", type: "車牌辨識", status: "停用" },
    { id: 3, name: "AI 模組 C", type: "異常偵測", status: "啟用" },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = data.filter(
    (item) =>
      item.name.includes(search.trim()) || item.type.includes(search.trim())
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
          prev.map((ai) =>
            ai.id === item.id
              ? { ...ai, status: ai.status === "啟用" ? "停用" : "啟用" }
              : ai
          )
        );
        Swal.fire("狀態已更新", "", "success");
      }
    });
  };

  const deleteItem = (id) => {
    Swal.fire({
      title: "確定刪除？",
      text: "刪除後無法復原！",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "刪除",
      cancelButtonText: "取消",
    }).then((res) => {
      if (res.isConfirmed) {
        setData((prev) => prev.filter((ai) => ai.id !== id));
        Swal.fire("刪除成功", "", "success");
      }
    });
  };

  const editItem = (item) => {
    Swal.fire({
      title: "編輯 AI 模組",
      html: `
        <input id="name" class="swal2-input" placeholder="名稱" value="${item.name}">
        <input id="type" class="swal2-input" placeholder="類型" value="${item.type}">
      `,
      showCancelButton: true,
      confirmButtonText: "儲存",
      cancelButtonText: "取消",
      preConfirm: () => {
        const name = document.getElementById("name").value.trim();
        const type = document.getElementById("type").value.trim();
        if (!name || !type) {
          Swal.showValidationMessage("請輸入完整資料");
          return false;
        }
        return { name, type };
      },
    }).then((res) => {
      if (res.isConfirmed) {
        setData((prev) =>
          prev.map((ai) =>
            ai.id === item.id
              ? { ...ai, name: res.value.name, type: res.value.type }
              : ai
          )
        );
        Swal.fire("更新成功", "", "success");
      }
    });
  };

  const addItem = () => {
    Swal.fire({
      title: "新增 AI 模組",
      html: `
        <input id="name" class="swal2-input" placeholder="名稱">
        <input id="type" class="swal2-input" placeholder="類型">
      `,
      showCancelButton: true,
      confirmButtonText: "新增",
      cancelButtonText: "取消",
      preConfirm: () => {
        const name = document.getElementById("name").value.trim();
        const type = document.getElementById("type").value.trim();
        if (!name || !type) {
          Swal.showValidationMessage("請輸入完整資料");
          return false;
        }
        return { name, type };
      },
    }).then((res) => {
      if (res.isConfirmed) {
        const newItem = {
          id: Date.now(),
          name: res.value.name,
          type: res.value.type,
          status: "啟用",
        };
        setData((prev) => [newItem, ...prev]);
        Swal.fire("新增成功", "", "success");
      }
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">影像監控系統 - AI 分析模組</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="搜尋名稱或類型"
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
            <th>名稱</th>
            <th>類型</th>
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
                <td>{item.type}</td>
                <td>
                  {item.status === "啟用" ? (
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