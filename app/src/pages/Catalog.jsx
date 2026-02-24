import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api.js";
import "../styles/catalog.scss";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getProducts() // mismo método que usas en home.jsx
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="catalog__loading">Carregando catálogo...</div>;
  }

  return (
    <div className="catalog">
      <h1 className="catalog__title">Catálogo de Produtos</h1>

      <div className="catalog__grid">
        {products.map((p) => (
          <Link key={p.id} to={`/produto/${p.id}`} className="catalog__card">
            <img className="catalog__img" src={p.image} alt={p.title} />
            <div className="catalog__info">
              <div className="catalog__name">{p.title}</div>
              <div className="catalog__price">R$ {p.price.toFixed(2)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
