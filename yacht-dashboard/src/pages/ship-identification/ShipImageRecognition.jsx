import { useState, useEffect } from "react";
import { Card, Row, Col, Modal } from "react-bootstrap";

export default function ShipImageRecognition() {
  const [seats, setSeats] = useState([]);
  const [modalImg, setModalImg] = useState(null);
  const [dockedTimes, setDockedTimes] = useState({});

  // 初始化席位資料
  useEffect(() => {
    const now = new Date();
    const initialResults = Array.from({ length: 11 }, (_, i) => ({
      id: i + 1,
      imageUrl: `${import.meta.env.BASE_URL}images/ship${i + 1}.jpg`,
      name: `船舶 ${String.fromCharCode(65 + i)}`,
      confidence: `${Math.floor(Math.random() * 10 + 90)}%`,
      inUse: Math.random() > 0.5,
      dockedSince: now,
    }));
    setSeats(initialResults);
  }, []);

  // 更新停泊時間
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const newTimes = {};
      seats.forEach((s) => {
        const diff = Math.floor((now - new Date(s.dockedSince)) / 1000);
        const hrs = Math.floor(diff / 3600);
        const mins = Math.floor((diff % 3600) / 60);
        const secs = diff % 60;
        newTimes[s.id] = `${hrs} 小時 ${mins} 分 ${secs} 秒`;
      });
      setDockedTimes(newTimes);
    }, 1000);
    return () => clearInterval(timer);
  }, [seats]);

  return (
    <>
      {/* 🧠 CSS 直接內嵌 */}
      <style>{`
        .page-content {
          height: 100vh;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .page-content::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="page-content">
        <div className="container mt-4">
          <h5 className="mb-3 text-primary">船舶影像辨識（共 11 席）</h5>
          <Row xs={1} sm={2} md={3} lg={4} xl={4} xxl={5} className="g-3">
            {seats.map((seat) => (
              <Col key={seat.id}>
                <Card className="h-100 shadow-sm border-0" style={{ fontSize: "0.85rem" }}>
                  <Card.Header className="bg-light text-center fw-semibold py-2">
                    席位 {seat.id}｜{seat.inUse ? "🟢 使用中" : "🔴 無人使用"}
                  </Card.Header>
                  <div
                    style={{ height: "150px", overflow: "hidden", cursor: "pointer" }}
                    onClick={() => setModalImg(seat.imageUrl)}
                  >
                    <img
                      src={seat.imageUrl}
                      alt={`船舶 ${seat.id}`}
                      className="img-fluid w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <Card.Body className="text-center py-2 px-2">
                    <div>
                      <strong>船名：</strong> {seat.name}
                    </div>
                    <div>
                      <strong>信心：</strong> {seat.confidence}
                    </div>
                    <div className="mt-1 text-muted" style={{ fontSize: "0.75rem" }}>
                      停泊時間：{dockedTimes[seat.id] || "計算中..."}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* 放大 Modal */}
        <Modal show={!!modalImg} onHide={() => setModalImg(null)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>放大影像</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <img src={modalImg} alt="放大圖" className="img-fluid rounded" />
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}