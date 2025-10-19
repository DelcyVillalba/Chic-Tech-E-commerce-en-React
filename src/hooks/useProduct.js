import { useEffect, useState } from "react";
import { getProduct } from "../api/products";
export default function useProduct(id) {
  const [data, setData] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    if (!id) return;
    let ok = true;
    setLoading(true);
    setError("");
    getProduct(id)
      .then((d) => ok && setData(d))
      .catch((e) => ok && setError(e.message))
      .finally(() => ok && setLoading(false));
    return () => {
      ok = false;
    };
  }, [id]);
  return { data, loading, error };
}
