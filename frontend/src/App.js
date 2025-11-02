import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaPrincipal from "./pages/PaginaPrincipal";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App" style={{ padding: 20 }}>
        <Routes>
          <Route path="/" element={<PaginaPrincipal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
