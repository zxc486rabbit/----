import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  // 交通部航港局 MTNet 會員申請表（PDF 下載頁面）
  const mtNetApplyUrl = "https://web02.mtnet.gov.tw/0/Info/DownloadFile"; // 官方申請流程及表單下載:contentReference[oaicite:1]{index=1}

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      Swal.fire("請輸入帳號與密碼", "", "warning");
      return;
    }

    Swal.fire({
      title: "登入成功",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      navigate("/");
    });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div
        className="card shadow p-4"
        style={{
          maxWidth: "400px",
          width: "100%",
          border: "none",
          borderRadius: "12px",
        }}
      >
        <h4
          className="text-center mb-4"
          style={{
            color: "#0599BB",
            fontWeight: 600,
            letterSpacing: "1px",
          }}
        >
          遊艇碼頭平台 - 登入
        </h4>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              帳號
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              密碼
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor="remember" className="form-check-label">
              記住我
            </label>
          </div>

          <button
            type="submit"
            className="btn w-100"
            style={{
              background: "#0599BB",
              color: "#fff",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            登入
          </button>

          <div className="d-flex justify-content-between mt-3">
            <a href="#" style={{ color: "#0599BB", fontSize: "0.9rem" }}>
              忘記密碼？
            </a>
            <div>
              <a href="#" style={{ color: "#0599BB", fontSize: "0.9rem", marginRight: "10px" }}>
                註冊帳號
              </a>
              <a
                href={mtNetApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0599BB", fontSize: "0.9rem" }}
              >
                入港申請
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}