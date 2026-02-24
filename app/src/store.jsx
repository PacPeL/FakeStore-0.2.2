import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const StoreContext = createContext(null);
const CART_KEY = "fakestore_cart_v1";

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) ?? [];
  } catch {
    return [];
  }
}

const initialState = {
  cart: loadCart(), // [{id,title,price,image,qty}]
};

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const p = action.payload;
      const found = state.cart.find((x) => x.id === p.id);
      const cart = found
        ? state.cart.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x))
        : [...state.cart, { ...p, qty: 1 }];
      return { ...state, cart };
    }

    case "REMOVE": {
      const id = action.payload;
      return { ...state, cart: state.cart.filter((x) => x.id !== id) };
    }

    case "QTY": {
      const { id, qty } = action.payload;
      const q = Math.max(1, Number(qty) || 1);
      return {
        ...state,
        cart: state.cart.map((x) => (x.id === id ? { ...x, qty: q } : x)),
      };
    }

    case "CLEAR":
      return { ...state, cart: [] };

    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
  }, [state.cart]);

  const actions = useMemo(() => {
    const addToCart = (p) =>
      dispatch({
        type: "ADD",
        payload: { id: p.id, title: p.title, price: p.price, image: p.image },
      });

    const removeFromCart = (id) => dispatch({ type: "REMOVE", payload: id });
    const setQty = (id, qty) => dispatch({ type: "QTY", payload: { id, qty } });
    const clearCart = () => dispatch({ type: "CLEAR" });

    return { addToCart, removeFromCart, setQty, clearCart };
  }, []);

  const cartCount = state.cart.reduce((acc, x) => acc + x.qty, 0);
  const cartTotal = state.cart.reduce((acc, x) => acc + x.price * x.qty, 0);

  const value = useMemo(
    () => ({ state, ...actions, cartCount, cartTotal }),
    [state, actions, cartCount, cartTotal]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de <StoreProvider>");
  return ctx;
}