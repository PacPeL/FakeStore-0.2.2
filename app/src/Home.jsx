import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "./services/api";
import "./styles/home.scss";

import goldenBoots from "./assets/golden_boots.png";
import stadium from "./assets/stadium.png";

// Drawer icons (en el orden del Figma)
import drawerIcon from "./assets/drawer_icon.svg";
import profileIcon from "./assets/iconamoon_profile-light.svg";
import cartIcon from "./assets/lineicons_cart-1.svg";
import searchIcon from "./assets/icon.svg";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [q, setQ] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const prods = await api.getProducts();
      setItems(prods);
      setLoading(false);
    })().catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const qNorm = q.trim().toLowerCase();
    if (!qNorm) return items;
    return items.filter((p) => (p.title ?? "").toLowerCase().includes(qNorm));
  }, [items, q]);

  const gridItems = filtered.slice(0, 8);

  const goToNews = () => {
    document
      .getElementById("novidades")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openSearch = () => {
    const el = document.getElementById("novidades");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="home">
      {/* ===== HERO 1920x1080 ===== */}
      <section className="hero">
        <div className="hero__wrap">
          {/* "po" arriba izquierda */}
          <div className="hero__brand">po</div>

          {/* copy */}
          <div className="hero__copy">
            <h1 className="hero__title">
              GMA D’or <br />
              Chuteira Campo
            </h1>

            <p className="hero__desc">
              Poucos pares. Acabamento dourado exclusivo. Performance de elite. Uma
              chuteira feita para brilhar e marcar presença dentro e fora dos gramados.
            </p>
          </div>

          {/* CTA */}
          <button className="hero__cta" type="button" onClick={goToNews}>
            Ler mais
          </button>

          {/* image */}
          <div className="hero__media">
            <img src={goldenBoots} alt="GMA D’or Chuteira Campo" />
          </div>

          {/* ===== Drawer vertical (sin header) ===== */}
          <nav className="drawer" aria-label="Ações rápidas">
            <button className="drawer__btn" type="button" aria-label="Menu">
              <img src={drawerIcon} alt="" />
            </button>

            <button className="drawer__btn" type="button" aria-label="Perfil">
              <img src={profileIcon} alt="" />
            </button>

            <Link className="drawer__btn" to="/cart" aria-label="Carrinho">
              <img src={cartIcon} alt="" />
            </Link>

            <button
              className="drawer__btn"
              type="button"
              aria-label="Buscar"
              onClick={openSearch}
            >
              <img src={searchIcon} alt="" />
            </button>
          </nav>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section className="benefits">
        <div className="benefits__row">
          <div className="benefits__item">
            <strong>FRETE GRÁTIS</strong> para compras acima de <strong>R$ 200!</strong>
          </div>
          <div className="benefits__item">
            <strong>Envio rápido</strong> para todo o <strong>Brasil!</strong>
          </div>
          <div className="benefits__item">
            <strong>20% OFF</strong> na sua primeira <strong>compra!</strong>
          </div>
        </div>
      </section>

      {/* ===== NOVIDADES HEAD ===== */}
      <section className="newsHead" id="novidades">
        <h2 className="newsHead__title">Novidades</h2>
        <p className="newsHead__sub">Confira já!</p>
      </section>

      {/* ===== GRID 4x2 ===== */}
      <section className="grid">
        {loading ? (
          <div className="grid__loading">Carregando produtos...</div>
        ) : (
          <div className="grid__rows">
            <div className="grid__row">
              {gridItems.slice(0, 4).map((p) => (
                <Link key={p.id} to={`/produto/${p.id}`} className="card">
                  <img className="card__img" src={p.image} alt={p.title} loading="lazy" />
                  <div className="card__text">
                    <div className="card__name">{p.title}</div>
                    <div className="card__price">R$ {p.price.toFixed(2)}</div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid__row">
              {gridItems.slice(4, 8).map((p) => (
                <Link key={p.id} to={`/produto/${p.id}`} className="card">
                  <img className="card__img" src={p.image} alt={p.title} loading="lazy" />
                  <div className="card__text">
                    <div className="card__name">{p.title}</div>
                    <div className="card__price">R$ {p.price.toFixed(2)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ===== BANNER ===== */}
      <section className="banner">
        <img src={stadium} alt="Torcida no estádio" />
      </section>

      <footer className="footerbar" />
    </div>
  );
}