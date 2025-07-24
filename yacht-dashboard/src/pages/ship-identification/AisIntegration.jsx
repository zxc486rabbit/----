import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaShip, FaAnchor } from "react-icons/fa";

// 解決 marker 圖示不顯示問題
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function AisIntegrationWithMap() {
  const initialShips = Array.from({ length: 23 }, (_, i) => ({
    id: i + 1,
    name: `船舶 ${i + 1}`,
    mmsi: `41234${1000 + i}`,
    lat: 25 + Math.random(), // 模擬隨機緯度
    lng: 121 + Math.random(), // 模擬隨機經度
    speed: (Math.random() * 20).toFixed(1) + " kn",
    status: Math.random() > 0.5 ? "航行中" : "停泊中",
  }));

  const [ships, setShips] = useState(initialShips);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredShips = ships.filter(
    (ship) =>
      ship.name.includes(search.trim()) || ship.mmsi.includes(search.trim())
  );
  const totalPages = Math.ceil(filteredShips.length / pageSize);
  const pageShips = filteredShips.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="container-fluid mt-4">
      <h3 className="mb-4 text-primary">AIS 整合模組</h3>
      <div className="row">
        {/* 表格區塊 */}
        <div className="col-md-6 mb-3">
          <input
            type="text"
            placeholder="搜尋船名或 MMSI"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="form-control mb-3"
          />
          <table className="table table-bordered text-center shadow-sm">
            <thead className="table-info">
              <tr>
                <th>#</th>
                <th>船名</th>
                <th>MMSI</th>
                <th>速度</th>
                <th>狀態</th>
              </tr>
            </thead>
            <tbody>
              {pageShips.length === 0 ? (
                <tr>
                  <td colSpan="5">查無資料</td>
                </tr>
              ) : (
                pageShips.map((ship) => (
                  <tr key={ship.id}>
                    <td>{ship.id}</td>
                    <td>{ship.name}</td>
                    <td>{ship.mmsi}</td>
                    <td>{ship.speed}</td>
                    <td>
                      {ship.status === "航行中" ? (
                        <span className="badge bg-success">
                          <FaShip className="me-1" />
                          航行中
                        </span>
                      ) : (
                        <span className="badge bg-secondary">
                          <FaAnchor className="me-1" />
                          停泊中
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* 分頁控制 */}
          <div className="d-flex justify-content-center">
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
          </div>
        </div>

        {/* 地圖區塊 */}
        <div className="col-md-6">
          <MapContainer
            center={[25.05, 121.55]}
            zoom={9}
            scrollWheelZoom={true}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {ships.map((ship) => (
              <Marker key={ship.id} position={[ship.lat, ship.lng]}>
                <Popup>
                  <strong>{ship.name}</strong>
                  <br />
                  MMSI: {ship.mmsi}
                  <br />
                  狀態: {ship.status}
                  <br />
                  速度: {ship.speed}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}