import { useState } from "react";
import { Button, Table, Form } from "react-bootstrap";

export default function ShipImageRecognition() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!file) return;

    // 模擬 API 呼叫
    setTimeout(() => {
      setResults([
        { id: 1, name: "船舶 A", confidence: "95%" },
        { id: 2, name: "船舶 B", confidence: "87%" },
      ]);
    }, 1000);
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-primary">船舶影像辨識</h3>

      <div className="p-4 bg-white shadow rounded mb-4">
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>上傳船舶影像</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
        </Form.Group>
        <Button variant="primary" onClick={handleSubmit}>
          開始辨識
        </Button>
      </div>

      {results.length > 0 && (
        <div className="p-4 bg-white shadow rounded">
          <h5>辨識結果</h5>
          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>#</th>
                <th>船舶名稱</th>
                <th>信心指數</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.name}</td>
                  <td>{r.confidence}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}