import { useState } from "react";

export default function BillingModule() {
  const [items, setItems] = useState([
    { id: 1, name: "用電費", price: 5.5 },
    { id: 2, name: "用水費", price: 3.2 },
  ]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  const handleAdd = () => {
    if (!newItemName || !newItemPrice) return;
    setItems([
      ...items,
      {
        id: Date.now(),
        name: newItemName,
        price: parseFloat(newItemPrice),
      },
    ]);
    setNewItemName("");
    setNewItemPrice("");
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handlePriceChange = (id, value) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, price: parseFloat(value) } : item
      )
    );
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">計費收費模組</h3>

      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="項目名稱"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <input
            type="number"
            className="form-control"
            placeholder="單價"
            value={newItemPrice}
            onChange={(e) => setNewItemPrice(e.target.value)}
          />
        </div>
        <div className="col-md-2 mb-2">
          <button className="btn btn-success w-100" onClick={handleAdd}>
            新增
          </button>
        </div>
      </div>

      <table className="table table-bordered text-center shadow-sm">
        <thead className="table-info">
          <tr>
            <th>項目名稱</th>
            <th>單價</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                    className="form-control text-center"
                    style={{ width: "100px", margin: "0 auto" }}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item.id)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-muted">
                尚無資料
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}