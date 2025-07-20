import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function NetworkManage() {
  const [data, setData] = useState([
    { id: 1, name: "核心交換機", ip: "192.168.0.1", status: "正常" },
    { id: 2, name: "防火牆", ip: "192.168.0.254", status: "異常" },
    { id: 3, name: "無線AP-01", ip: "192.168.1.1", status: "維護中" },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = data.filter(
    (item) =>
      item.name.includes(search.trim()) || item.ip.includes(search.trim())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pageData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const nextStatus = (status) => {
    if (status === "正常") return "維護中";
    if (status === "維護中") return "異常";
    return "正常";
  };

  const toggleStatus = (item) => {
    Swal.fire({
      title: "切換設備狀態？",
      text: `目前狀態為「${item.status}」`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "切換",
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
      title: "確定刪除設備？",
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
      title: "新增設備",
      html: `
        <input id="name" class="swal2-input" placeholder="設備名稱">
        <input id="ip" class="swal2-input" placeholder="IP 位址">
      `,
      showCancelButton: true,
      confirmButtonText: "新增",
      cancelButtonText: "取消",
      preConfirm: () => {
        const name = document.getElementById("name").value.trim();
        const ip = document.getElementById("ip").value.trim();
        if (!name || !ip) {
          Swal.showValidationMessage("請輸入完整資料");
          return false;
        }
        return { name, ip };
      },
    }).then((res) => {
      if (res.isConfirmed) {
        const newItem = {
          id: Date.now(),
          name: res.value.name,
          ip: res.value.ip,
          status: "正常",
        };
        setData((prev) => [newItem, ...prev]);
        Swal.fire("新增成功", "", "success");
      }
    });
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">通訊傳輸系統 - 網路傳輸管理</h3>

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="搜尋設備名稱或 IP"
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
            <th>設備名稱</th>
            <th>IP 位址</th>
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
                <td>{item.ip}</td>
                <td>
                  {item.status === "正常" && (
                    <span className="badge bg-success">正常</span>
                  )}
                  {item.status === "維護中" && (
                    <span className="badge bg-warning text-dark">維護中</span>
                  )}
                  {item.status === "異常" && (
                    <span className="badge bg-danger">異常</span>
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