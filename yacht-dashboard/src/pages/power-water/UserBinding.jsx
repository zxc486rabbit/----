import { useState } from "react";
import Swal from "sweetalert2";

export default function UserBinding() {
  const initialUsers = Array.from({ length: 23 }, (_, i) => ({
    id: i + 1,
    name: `用戶${i + 1}`,
    bound: Math.random() > 0.5,
  }));

  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredUsers = users.filter((user) =>
    user.name.includes(search.trim())
  );
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const toggleBinding = (user) => {
    Swal.fire({
      title: `${user.bound ? "確定解除綁定" : "確定綁定"} ${user.name} 嗎？`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, bound: !u.bound } : u
          )
        );
        Swal.fire(
          `${user.bound ? "已解除綁定" : "已綁定"}`,
          `${user.name}`,
          "success"
        );
      }
    });
  };

  const pageUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">用戶資訊綁定</h3>

      <div className="mb-3 row">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="搜尋用戶名稱"
            value={search}
            onChange={handleSearchChange}
            className="form-control"
          />
        </div>
      </div>

      <table className="table table-bordered text-center shadow-sm">
        <thead className="table-info">
          <tr>
            <th>用戶名稱</th>
            <th>綁定狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {pageUsers.length === 0 ? (
            <tr>
              <td colSpan="3">查無資料</td>
            </tr>
          ) : (
            pageUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.bound ? "已綁定" : "未綁定"}</td>
                <td>
                  <button
                    className={`btn btn-sm ${
                      user.bound ? "btn-danger" : "btn-success"
                    }`}
                    onClick={() => toggleBinding(user)}
                  >
                    {user.bound ? "解除綁定" : "綁定"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 分頁控制 */}
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
