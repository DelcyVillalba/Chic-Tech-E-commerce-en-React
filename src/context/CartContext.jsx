import { createContext, useContext, useEffect, useMemo, useState } from "react";
const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);
const loadInitial = () => {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
};
export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadInitial);
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const normalizeItem = (item) => {
    const rawPrice = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const finalPrice =
      discount > 0 ? rawPrice * (1 - discount / 100) : rawPrice;

    return {
      ...item,
      originalPrice: rawPrice,
      price: finalPrice,
      discount,
    };
  };

  const add = (item, qty = 1) =>
    setCart((prev) => {
      const normalized = normalizeItem(item);
      const i = prev.findIndex((p) => p.id === normalized.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + qty };
        return copy;
      }
      return [...prev, { ...normalized, qty }];
    });
  const setQty = (id, qty) =>
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)));
  const remove = (id) => setCart((prev) => prev.filter((p) => p.id !== id));
  const clear = () => setCart([]);
  const dispatch = (a) => {
    switch (a.type) {
      case "ADD":
        return add(a.item, a.qty ?? 1);
      case "SET_QTY":
        return setQty(a.id, a.qty);
      case "REMOVE":
        return remove(a.id);
      case "CLEAR":
        return clear();
      default:
        return;
    }
  };
  const { totalItems, totalPrice } = useMemo(() => {
    const items = cart.reduce((s, x) => s + x.qty, 0);
    const price = cart.reduce((s, x) => s + x.qty * x.price, 0);
    return { totalItems: items, totalPrice: price };
  }, [cart]);
  return (
    <CartCtx.Provider
      value={{
        cart,
        dispatch,
        add,
        setQty,
        remove,
        clear,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartCtx.Provider>
  );
}
