import { useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

export default function OwnerShipManage() {
  const [data, setData] = useState([
    {
      id: 1,
      owner: "陳大富",
      ship: "富貴號",
      phone: "0912-345-678",
      company: "台灣遠洋股份有限公司",
      status: "啟用",
      createdAt: new Date(),
    },
    {
      id: 2,
      owner: "林金寶",
      ship: "勝利輪",
      phone: "0987-654-321",
      company: "新海企業行",
      status: "維護",
      createdAt: new Date(),
    },
    {
      id: 3,
      owner: "黃小川",
      ship: "和平之星",
      phone: "0966-888-999",
      company: "海大船務",
      status: "停用",
      createdAt: new Date(),
    },
  ]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredData = data.filter(
    (item) =>
      item.owner.includes(search.trim()) ||
      item.ship.includes(search.trim()) ||
      item.company.includes(search.trim())
  );

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const pageData = filteredData.slice((page - 1) * pageSize, page * pageSize);

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
        <input id="phone" class="swal2-input" placeholder="聯絡電話">
        <input id="company" class="swal2-input" placeholder="所屬公司">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "新增",
      cancelButtonText: "取消",
      preConfirm: () => {
        const owner = document.getElementById("owner").value.trim();
        const ship = document.getElementById("ship").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const company = document.getElementById("company").value.trim();
        if (!owner || !ship || !phone || !company) {
          Swal.showValidationMessage("請填寫完整資料");
          return false;
        }
        if (data.some((item) => item.ship === ship)) {
          Swal.showValidationMessage("該船舶已存在");
          return false;
        }
        return { owner, ship, phone, company };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newItem = {
          id: Date.now(),
          owner: result.value.owner,
          ship: result.value.ship,
          phone: result.value.phone,
          company: result.value.company,
          status: "啟用",
          createdAt: new Date(),
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
        <input id="phone" class="swal2-input" placeholder="聯絡電話" value="${item.phone}">
        <input id="company" class="swal2-input" placeholder="所屬公司" value="${item.company}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "儲存",
      cancelButtonText: "取消",
      preConfirm: () => {
        const owner = document.getElementById("owner").value.trim();
        const ship = document.getElementById("ship").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const company = document.getElementById("company").value.trim();
        if (!owner || !ship || !phone || !company) {
          Swal.showValidationMessage("請填寫完整資料");
          return false;
        }
        return { owner, ship, phone, company };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setData((prev) =>
          prev.map((row) =>
            row.id === item.id
              ? {
                  ...row,
                  owner: result.value.owner,
                  ship: result.value.ship,
                  phone: result.value.phone,
                  company: result.value.company,
                }
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
            placeholder="搜尋船主 / 船名 / 公司"
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
            <th>聯絡電話</th>
            <th>公司</th>
            <th>狀態</th>
            <th>建檔時間</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {pageData.length === 0 ? (
            <tr>
              <td colSpan="8">查無資料</td>
            </tr>
          ) : (
            pageData.map((item, idx) => (
              <tr key={item.id}>
                <td>{(page - 1) * pageSize + idx + 1}</td>
                <td>{item.owner}</td>
                <td>{item.ship}</td>
                <td>{item.phone}</td>
                <td>{item.company}</td>
                <td>
                  {item.status === "啟用" && (
                    <span className="badge bg-success">啟用</span>
                  )}
                  {item.status === "維護" && (
                    <span className="badge bg-warning text-dark">維護</span>
                  )}
                  {item.status === "停用" && (
                    <span className="badge bg-secondary">停用</span>
                  )}
                </td>
                <td>
                  {new Date(item.createdAt).toLocaleDateString()}<br />
                  {new Date(item.createdAt).toLocaleTimeString()}
                </td>
                <td>
                  <button
                    onClick={() => confirmToggleStatus(item.id, item.status)}
                    className="btn btn-sm btn-primary me-1"
                  >
                    切換
                  </button>
                  <button
                    onClick={() => editShip(item)}
                    className="btn btn-sm btn-warning me-1"
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