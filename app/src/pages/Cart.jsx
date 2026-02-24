import { Link } from "react-router-dom";
import { useStore } from "../store.jsx";
import "../styles/cart.scss";

export default function Cart() {
  const { state, removeFromCart, setQty, clearCart, cartTotal } = useStore();
  const cart = state.cart;

  if (!cart.length) {
    return (
      <div className="cart">
        <h1>Carrinho</h1>
        <p>Seu carrinho está vazio.</p>
        <Link className="cart__back" to="/">
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart__head">
        <h1>Carrinho</h1>
        <button className="cart__clear" onClick={clearCart}>
          Limpar
        </button>
      </div>

      <div className="cart__list">
        {cart.map((x) => (
          <div key={x.id} className="cart__item">
            <img className="cart__img" src={x.image} alt={x.title} />

            <div className="cart__info">
              <div className="cart__title">{x.title}</div>
              <div className="cart__price">R$ {x.price.toFixed(2)}</div>
            </div>

            <input
              className="cart__qty"
              type="number"
              min="1"
              value={x.qty}
              onChange={(e) => setQty(x.id, e.target.value)}
            />

            <div className="cart__sub">R$ {(x.price * x.qty).toFixed(2)}</div>

            <button className="cart__remove" onClick={() => removeFromCart(x.id)}>
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
    alert("Compra realizada com sucesso!");
    clearCart();
  }}
>
  Finalizar compra
</button>
      </div>
    </div>
  );
}