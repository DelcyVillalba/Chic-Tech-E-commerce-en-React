import { createContext, useContext, useEffect, useState } from "react";

const WishlistCtx = createContext(null);
export const useWishlist = () => useContext(WishlistCtx);

const loadWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  } catch {
    return [];
  }
};

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(loadWishlist);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggle = (item) =>
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      return exists ? prev.filter((p) => p.id !== item.id) : [...prev, item];
    });

  const remove = (id) =>
    setWishlist((prev) => prev.filter((p) => p.id !== id));

  const clear = () => setWishlist([]);

  const isSaved = (id) => wishlist.some((p) => p.id === id);

  return (
    <WishlistCtx.Provider
      value={{ wishlist, toggle, remove, clear, isSaved }}
    >
      {children}
    </WishlistCtx.Provider>
  );
}
