import { useState } from "react";

export default function History() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  
  // 假資料
  const records = [
    { id: 1, date: "2024-07-01", type: "用電", value: "1234 kWh" },
    { id: 2, date: "2024-07-02", type: "用水", value: "456 m³" },
    { id: 3, date: "2024-07-03", type: "異常", value: "警示事件" },
  ];

  // 過濾
  const filtered = records.filter(
    r =>
      (!search || r.type.includes(search)) &&
      (!date || r.date === date)
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">歷史紀錄查詢</h3>

      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="搜尋類型 (用電 / 用水 / 異常)"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4 mb-2">
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>
      </div>

      <table className="table table-bordered text-center shadow-sm">
        <thead className="table-info">
          <tr>
            <th>日期</th>
            <th>類型</th>
            <th>數值</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map(r => (
              <tr key={r.id}>
                <td>{r.date}</td>
                <td>{r.type}</td>
                <td>{r.value}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-muted">
                查無資料
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}