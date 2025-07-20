import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function AlertNotification() {
  const [data, setData] = useState([
    { id: 1, message: "攝影機 1 畫面遺失", level: "高", status: "未處理" },
    { id: 2, message: "攝影機 2 異常斷線", level: "中", status: "處理中" },
    { id: 3, message: "攝影機 3 亮度異常", level: "低", status: "已處理" },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = data.filter((item) =>
    item.message.includes(search.trim())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pageData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const nextStatus = (status) => {
    if (status === "未處理") return "處理中";
    if (status === "處理中") return "已處理";
    return "未處理";
  };

  const toggleStatus = (item) => {
    Swal.fire({
      title: "確認更新狀態？",
      text: `目前狀態為「${item.status}」`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "更新",
      cancelButtonText: "取消",
    }).then((res) => {
      if (res.isConfirmed) {
        setData((prev) =>
          prev.map((v) =>
            v.id === item.id
              ? { ...v, status: nextStatus(v.status) }
              : v
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
        setData((prev) => prev.filter((v) => v.id !== id));
        Swal.fire("刪除成功", "", "success");
      }
    });
  };

  const addItem = () => {
    Swal.fire({
      title: "新增警示",
      html: `
        <input id="message" class="swal2-input" placeholder="警示內容">
        <select id="level" class="swal2-input">
          <option value="高">高</option>
          <option value="中">中</option>
          <option value="低">低</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: "新增",
      cancelButtonText: "取消",
      preConfirm: () => {
        const message = document.getElementById("message").value.trim();
        const level = document.getElementById("level").value;
        if (!message) {
          Swal.showValidationMessage("請輸入警示內容");
          return false;
        }
        return { message, level };
      },
    }).then((res) => {
      if (res.isConfirmed) {
        const newItem = {
          id: Date.now(),
          message: res.value.message,
          level: res.value.level,
          status: "未處理",
        };
        setData((prev) => [newItem, ...prev]);
        Swal.fire("新增成功", "", "success");
      }
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">影像監控系統 - 警示通報系統</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="搜尋警示內容"
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
            <th>警示內容</th>
            <th>等級</th>
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
                <td>{item.message}</td>
                <td>
                  {item.level === "高" && (
                    <span className="badge bg-danger">高</span>
                  )}
                  {item.level === "中" && (
                    <span className="badge bg-warning text-dark">中</span>
                  )}
                  {item.level === "低" && (
                    <span className="badge bg-info">低</span>
                  )}
                </td>
                <td>
                  {item.status === "未處理" && (
                    <span className="badge bg-secondary">未處理</span>
                  )}
                  {item.status === "處理中" && (
                    <span className="badge bg-warning text-dark">處理中</span>
                  )}
                  {item.status === "已處理" && (
                    <span className="badge bg-success">已處理</span>
                  )}
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(item)}
                    className="btn btn-sm btn-primary me-2"
                  >
                    更新狀態
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