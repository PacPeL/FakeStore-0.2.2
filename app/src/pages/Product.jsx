import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../services/api.js";
import { useStore } from "../store.jsx";
import "../styles/product.scss";

// Drawer icons (mismos assets que usas en Home)
import drawerIcon from "../assets/drawer_icon.svg";
import profileIcon from "../assets/iconamoon_profile-light.svg";
import cartIcon from "../assets/lineicons_cart-1.svg";
import searchIcon from "../assets/icon.svg";

const SIZES = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43];
const ORIGINAL_MARKUP = 0.10; // “de R$ …”
const PIX_DISCOUNT = 0.10; // “no PIX”
const INSTALLMENTS = 10;

function formatBRL(v) {
  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v ?? 0);
  } catch {
    return `R$ ${(v ?? 0).toFixed(2)}`;
  }
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

export default function Product() {
  const { id } = useParams();
  const nav = useNavigate();
  const { addToCart } = useStore();

  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);

  const [size, setSize] = useState(40);

  useEffect(() => {
    setLoading(true);
    api
      .getProduct(id)
      .then((data) => setP(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const ratingAvg = useMemo(() => {
    const r = Number(p?.rating?.rate ?? 0);
    return clamp(r, 0, 5);
  }, [p]);

  const ratingCount = useMemo(() => {
    return Number(p?.rating?.count ?? 0);
  }, [p]);

  const basePrice = useMemo(() => Number(p?.price ?? 0), [p]);

  // Precio “de …”
  const originalPrice = useMemo(() => {
    return basePrice * (1 + ORIGINAL_MARKUP);
  }, [basePrice]);

  // Precio PIX
  const pixPrice = useMemo(() => {
    return basePrice * (1 - PIX_DISCOUNT);
  }, [basePrice]);

  // Cuotas 10x
  const installment = useMemo(() => {
    return pixPrice / INSTALLMENTS;
  }, [pixPrice]);

  const openSearch = () => {
    // Por ahora, baja a la sección de descripción (o reviews)
    document.getElementById("descricao")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) return <div className="product">Carregando...</div>;
  if (!p) return <div className="product">Produto não encontrado.</div>;

  return (
    <div className="product">
      {/* ===== HERO 1920x1080 ===== */}
      <section className="pHero">
        <div className="pHero__wrap">
          {/* top-left (asteriscos del figma) */}
          <div className="pHero__brand">****************</div>

          {/* title */}
          <h1 className="pTitle">
            {p.title}
          </h1>

          {/* rating row */}
          <div className="pRating">
            <div className="pRating__stars" aria-label={`Avaliação média ${ratingAvg.toFixed(1)} de 5`}>
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = ratingAvg >= i + 1;
                const half = !filled && ratingAvg > i && ratingAvg < i + 1;
                return (
                  <span key={i} className={`pStar ${filled ? "isFilled" : ""} ${half ? "isHalf" : ""}`}>
                    ★
                  </span>
                );
              })}
            </div>

            <div className="pRating__text">
              {ratingCount > 0 ? `${ratingCount} avaliações` : "Sem avaliações"}
            </div>
          </div>

          {/* sizes */}
          <div className="pSizes">
            <div className="pSizes__label">Tamanho:</div>

            <div className="pSizes__grid">
              {SIZES.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={`pSize ${size === n ? "isActive" : ""}`}
                  onClick={() => setSize(n)}
                  aria-pressed={size === n}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* pricing block */}
          <div className="pPrice">
            <div className="pPrice__from">
              <span className="pPrice__fromLabel">de</span>{" "}
              <span className="pPrice__fromValue">{formatBRL(originalPrice)}</span>{" "}
              <span className="pPrice__fromLabel">por apenas</span>
            </div>

            {/* ✅ ESTE ES EL BLOQUE QUE AJUSTAMOS PARA NO ROMPER */}
            <div className="pPrice__pix" aria-label={`Preço no PIX ${formatBRL(pixPrice)}`}>
              <span className="pPrice__pixRS">R$</span>
              <span className="pPrice__pixValue">
                {pixPrice.toFixed(2).replace(".", ",")}
              </span>
              <span className="pPrice__pixLabel">no</span>
              <span className="pPrice__pixMethod">PIX</span>
            </div>

            <div className="pPrice__inst">
              ou <strong>{INSTALLMENTS}x</strong> de{" "}
              <strong>{formatBRL(installment)}</strong> sem juros
            </div>

            <div className="pBuyRow">
              <button className="pBuy" type="button" onClick={() => addToCart({ ...p, size })}>
                Comprar
              </button>

              <Link to="/cart" className="pBuyCart" aria-label="Ir para o carrinho">
                <img src={cartIcon} alt="" />
              </Link>
            </div>
          </div>

          {/* product image (igual “centrado” que home) */}
          <div className="pHero__media">
            <img src={p.image} alt={p.title} />
          </div>

          {/* drawer vertical */}
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

            <button className="drawer__btn" type="button" aria-label="Buscar" onClick={openSearch}>
              <img src={searchIcon} alt="" />
            </button>
          </nav>

          {/* promo underline */}
          <div className="pPromo">
            <span className="pPromo__strong">Registre-se</span> e ganhe{" "}
            <span className="pPromo__strong">10%</span> de desconto usando o cupom{" "}
            <span className="pPromo__strong">COMPRA1</span> na sua primeira compra feita pelo{" "}
            <span className="pPromo__strong">site</span>.
          </div>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <section className="pContent">
        <div className="pContent__inner">
          <div className="pDesc" id="descricao">
            <div className="pDesc__title">Descrição do Produto:</div>
            <div className="pDesc__text">{p.description}</div>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="pReviews">
        <div className="pReviews__inner">
          <div className="pReviews__title">Avaliações:</div>
          <div className="pReviews__sub">O que os clientes estão dizendo sobre o produto?</div>

          {/* A tu criterio: placeholder limpio */}
          <div className="pReviews__empty">
            {ratingCount > 0
              ? "Em breve vamos listar as avaliações aqui."
              : "Ainda não há avaliações. Seja o primeiro a avaliar!"}
          </div>
        </div>
      </section>

      <footer className="footerbar" />
    </div>
  );
}