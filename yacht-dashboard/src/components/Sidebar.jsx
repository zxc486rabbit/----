import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaWater,
  FaShip,
  FaDoorClosed,
  FaVideo,
  FaNetworkWired,
  FaFileInvoiceDollar,
  FaThumbtack,
  FaSignInAlt,
} from "react-icons/fa";

import "./Sidebar.css";

export default function Sidebar() {
  const [pinned, setPinned] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  const isExpanded = pinned || hovered;

  const togglePin = () => {
    setPinned((prev) => {
      if (prev) setActiveSubmenu(null);
      return !prev;
    });
  };

  const handleToggleSubmenu = (index) => {
    if (!isExpanded) return;
    setActiveSubmenu((prev) => (prev === index ? null : index));
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => {
    setHovered(false);
    if (!pinned) setActiveSubmenu(null);
  };

  const menus = [
    {
      icon: <FaWater />,
      label: "水電管理系統",
      children: [
        { label: "即時監控模組", path: "realtime" },
        { label: "歷史紀錄查詢", path: "history" },
        // { label: "計費收費模組", path: "billing" },
        { label: "用戶資訊綁定", path: "user-binding" },
        { label: "遠端控管功能", path: "remote-control" },
      ],
    },
    {
      icon: <FaShip />,
      label: "船舶識別系統",
      children: [
        { label: "AIS整合模組", path: "ais" },
        { label: "船舶影像辨識", path: "image-recognition" },
        { label: "船主船隻管理", path: "owner-ship" },
      ],
    },
    {
      icon: <FaDoorClosed />,
      label: "門禁管制系統",
      children: [
        { label: "進出識別紀錄", path: "access-log" },
        { label: "人員授權管理", path: "personnel" },
        { label: "設備門禁管理", path: "equipment" },
        { label: "異常警示事件", path: "alerts" },
        { label: "門禁排程設定", path: "schedule" },
      ],
    },
    {
      icon: <FaVideo />,
      label: "影像監控系統",
      children: [
        { label: "攝影機管理", path: "camera" },
        { label: "影像儲存管理", path: "storage" },
        { label: "AI分析模組", path: "ai-analysis" },
        { label: "監控畫面管理", path: "monitoring" },
        { label: "警示通報系統", path: "notifications" },
      ],
    },
    {
      icon: <FaNetworkWired />,
      label: "通訊傳輸系統",
      children: [
        { label: "網路傳輸管理", path: "network" },
        { label: "有線設備管理", path: "wired" },
        { label: "無線設備管理", path: "wireless" },
      ],
    },
    {
      icon: <FaFileInvoiceDollar />,
      label: "支付計費系統",
      children: [
        { label: "計費項目管理", path: "items" },
        { label: "邏輯費率管理", path: "rates" },
        { label: "支付方式支援", path: "payment-methods" },
        { label: "帳單通知功能", path: "billing-notice" },
        { label: "後台管理功能", path: "backend" },
      ],
    },
  ];

  return (
    <div
      className={`sidebar d-flex flex-column p-0 position-relative ${
        isExpanded ? "expanded" : ""
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`pin-btn ${pinned ? "pinned" : ""}`}
        onClick={togglePin}
      >
        <FaThumbtack />
      </button>

      <Link
        to="/"
        className="text-center py-4 border-bottom d-block text-decoration-none text-white"
      >
        <h4 className="m-0">遊艇碼頭平台</h4>
      </Link>

      <div className="flex-grow-1">
        {menus.map((menu, index) => (
          <div key={index}>
            <button
              type="button"
              className="menu-toggle btn btn-link text-start w-100 text-white"
              onClick={() => handleToggleSubmenu(index)}
            >
              <span className="sidebar-icon">{menu.icon}</span>
              <span className="sidebar-label">{menu.label}</span>
            </button>
            <div
              className={`submenu ps-4 ${
                activeSubmenu === index ? "" : "d-none"
              }`}
            >
              {menu.children.map((item, i) => (
                <Link
                  to={item.path}
                  key={i}
                  className="d-block py-1 text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 👉 登入樣式 */}
      <div className="sidebar-login text-center py-3 border-top">
        <Link
          to="/login"
          className="d-flex justify-content-center align-items-center text-white text-decoration-none"
        >
          <FaSignInAlt className="me-2" />
          <span className="sidebar-label">登入</span>
        </Link>
      </div>
    </div>
  );
}
