import { useState } from "react";
import Swal from "sweetalert2";

export default function UserBinding() {
  // 🔹人名清單
  const namePool = [
    "王小明", "陳美麗", "張志強", "林宜君", "李志偉",
    "黃婷婷", "吳俊傑", "蔡佩珊", "周家豪", "曾雅慧",
    "謝承恩", "鄭語庭", "簡郁翔", "江曉婷", "賴柏宏",
    "徐佳玲", "郭彥廷", "鍾子翔", "洪怡君", "朱浩宇",
    "羅嘉玲", "宋文傑", "葉佳穎", "馮雅雯", "杜思涵",
    "高仁傑", "彭柏翰", "盧郁潔", "戴雅芳", "魏志成"
  ];

  // 🔹隨機不重複取出 23 個名字
  const getUniqueNames = (count) => {
    const shuffled = [...namePool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const initialUsers = getUniqueNames(23).map((name, i) => ({
    id: i + 1,
    name,
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

      {/* 搜尋欄 */}
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

      {/* 資料表格 */}
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