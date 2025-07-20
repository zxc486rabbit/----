import { HashRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/dashboard/Dashboard";

import Login from "./pages/Login";

import RealtimeMonitor from "./pages/power-water/RealtimeMonitor"; //即時監控模組
import History from "./pages/power-water/History"; //歷史紀錄查詢
import BillingModule from "./pages/power-water/BillingModule"; //計費收費模組
import UserBinding from "./pages/power-water/UserBinding"; //用戶資訊綁定
import RemoteControl from "./pages/power-water/RemoteControl"; //遠端控管功能
import AisIntegration from "./pages/ship-identification/AisIntegration"; //AIS整合模組
import ShipImageRecognition from "./pages/ship-identification/ShipImageRecognition"; //船舶影像辨識
import OwnerShipManage from "./pages/ship-identification/OwnerShipManage"; //船主船隻管理

import AccessRecords from "./pages/access-control/AccessRecords"; //進出識別紀錄
import PersonnelAuthorization from "./pages/access-control/PersonnelAuthorization"; //人員授權管理
import DeviceAccessManage from "./pages/access-control/DeviceAccessManage"; //設備門禁管理
import AlarmEvents from "./pages/access-control/AlarmEvents"; //異常警示事件
import ScheduleManage from "./pages/access-control/ScheduleManage"; //門禁排程設定

import CameraManage from "./pages/video-surveillance/CameraManage"; //攝影機管理
import StorageManage from "./pages/video-surveillance/StorageManage"; //影像儲存管理
import AiAnalysis from "./pages/video-surveillance/AiAnalysis"; //AI分析模組
import MonitorViewManage from "./pages/video-surveillance/MonitorViewManage"; //監控畫面管理
import AlertNotification from "./pages/video-surveillance/AlertNotification"; //警示通報系統

import NetworkManage from "./pages/communication/NetworkManage"; //網路傳輸管理
import WiredDeviceManage from "./pages/communication/WiredDeviceManage"; //有線設備管理
import WirelessDeviceManage from "./pages/communication/WirelessDeviceManage"; //無線設備管理

import ChargeItemManage from "./pages/billing-system/ChargeItemManage"; //計費項目管理
import RateLogicManage from "./pages/billing-system/RateLogicManage"; //邏輯費率管理
import PaymentSupport from "./pages/billing-system/PaymentSupport"; //支付方式支援
import BillNotification from "./pages/billing-system/BillNotification"; //帳單通知功能
import AdminManage from "./pages/billing-system/AdminManage"; //後台管理功能

import "./index.css";

export default function App() {
  return (
    <HashRouter>
      <div
        className="container-fluid d-flex flex-nowrap p-0"
        style={{ height: "100vh" }}
      >
        <Sidebar />
        <div className="main-content flex-grow-1" style={{ minWidth: 0 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/realtime" element={<RealtimeMonitor />} />
            <Route path="/history" element={<History />} />
            <Route path="/billing" element={<BillingModule />} />
            <Route path="/user-binding" element={<UserBinding />} />
            <Route path="/remote-control" element={<RemoteControl />} />

            <Route path="/ais" element={<AisIntegration />} />
            <Route
              path="/image-recognition"
              element={<ShipImageRecognition />}
            />
            <Route path="/owner-ship" element={<OwnerShipManage />} />

            <Route path="/access-log" element={<AccessRecords />} />
            <Route path="/personnel" element={<PersonnelAuthorization />} />
            <Route path="/equipment" element={<DeviceAccessManage />} />
            <Route path="/alerts" element={<AlarmEvents />} />
            <Route path="/schedule" element={<ScheduleManage />} />

            <Route path="/camera" element={<CameraManage />} />
            <Route path="/storage" element={<StorageManage />} />
            <Route path="/ai-analysis" element={<AiAnalysis />} />
            <Route path="/monitoring" element={<MonitorViewManage />} />
            <Route path="/notifications" element={<AlertNotification />} />

            <Route path="/network" element={<NetworkManage />} />
            <Route path="/wired" element={<WiredDeviceManage />} />
            <Route path="/wireless" element={<WirelessDeviceManage />} />

            <Route path="/items" element={<ChargeItemManage />} />
            <Route path="/rates" element={<RateLogicManage />} />
            <Route path="/payment-methods" element={<PaymentSupport />} />
            <Route path="/billing-notice" element={<BillNotification />} />
            <Route path="/backend" element={<AdminManage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}
