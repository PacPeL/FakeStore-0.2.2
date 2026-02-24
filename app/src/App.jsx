import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produto/:id" element={<Product />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}