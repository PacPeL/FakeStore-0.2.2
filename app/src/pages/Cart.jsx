import { Link } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../store.jsx";
import "../styles/cart.scss";

export default function Cart() {
  const { state, removeFromCart, setQty, clearCart, cartTotal, setSize } = useStore();
  const cart = state.cart;

  // Estado para el toast
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000); // desaparece en 4 segundos
  };

  if (!cart.length) {
    return (
      <div className="cart">
        <h1 className="cart__title">Carrinho</h1>
        <p className="cart__empty">Seu carrinho está vazio.</p>
        <Link className="cart__back" to="/">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart__head">
        <h1 className="cart__title">Carrinho</h1>
        <button className="cart__clear" onClick={clearCart}>
          Limpar
        </button>
      </div>

      <p className="cart__desc">
        Aqui estão os produtos que você adicionou ao carrinho.
      </p>

      <div className="cart__list">
        {cart.map((x) => (
          <div key={x.id} className="cart__item">
            <img className="cart__img" src={x.image} alt={x.title} />

            <div className="cart__info">
              <div className="cart__product-title">{x.title}</div>

              <div className="cart__controls">
                {/* Selector de talla */}
                <select
                  className="cart__size-select"
                  value={x.size || ""}
                  onChange={(e) => setSize(x.id, e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="39">39</option>
                  <option value="40">40</option>
                  <option value="41">41</option>
                  <option value="42">42</option>
                  <option value="43">43</option>
                </select>

                {/* Controles de cantidad */}
                <div className="cart__qty-controls">
                  <button
                    className="cart__qty-btn"
                    onClick={() => setQty(x.id, Math.max(1, x.qty - 1))}
                  >
                    -
                  </button>
                  <span className="cart__qty-value">{x.qty}</span>
                  <button
                    className="cart__qty-btn"
                    onClick={() => setQty(x.id, x.qty + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="cart__price">R$ {(x.price * x.qty).toFixed(2)}</div>

            <button
              className="cart__remove"
              onClick={() => removeFromCart(x.id)}
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="cart__footer">
        <div className="cart__total">
          Total: <strong>R$ {cartTotal.toFixed(2)}</strong>
        </div>
        <button
          className="cart__checkout"
          type="button"
          onClick={() => {
            showToast("Compra realizada com sucesso!");
            clearCart();
          }}
        >
          Finalizar compra
        </button>
      </div>

      {/* Toast */}
      {toast && <div className="cart__toast">{toast}</div>}
    </div>
  );
}
