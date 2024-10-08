import "./App.css";
import { Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import Navbar from "./componets/Navbar";
import { AddBudget } from "./componets/AddBudget";
import EditBudget from "./componets/EditBudget";

function App() {
  return (
    <>
      <div className="app">
        <Navbar/>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addbudget" element={<AddBudget />} />
          <Route path="/editbudget" element={<EditBudget />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
