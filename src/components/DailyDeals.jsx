import { useEffect, useState } from "react";
import { listProducts } from "../api/products";
import DealCard from "./DealCard";
import QuickViewModal from "./QuickViewModal";

export default function DailyDeals() {
    const COLS_DESKTOP = 4;
    const MAX_ITEMS = COLS_DESKTOP * 2;
    const [items, setItems] = useState([]);
    const [quick, setQuick] = useState(null);
    const [tab, setTab] = useState("sale");

    useEffect(() => {
        listProducts().then((data) => {
            const discounts = { 1: 10, 2: 15, 3: 15, 4: 40, 8: 10 };
            const withFlags = data.map((p) => ({
                ...p,
                isNew: [1, 2, 3].includes(p.id),
                discount: discounts[p.id] || 0,
            }));
            setItems(withFlags);
        });
    }, []);

    const filtered =
        tab === "new"
            ? items.filter((p) => p.isNew)
            : tab === "best"
                ? items.slice().sort((a, b) => b.price - a.price).slice(0, 8)
                : items.filter((p) => p.discount > 0);
    const visible = filtered.slice(0, MAX_ITEMS);

    return (
        <section className="bg-white dark:bg-[#0f0c19] transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 py-12 text-zinc-900 dark:text-zinc-100">
                <div className="flex items-center justify-center gap-6 mb-6">
                    <span className="h-px w-16 bg-black/60 dark:bg-white/30" />
                    <h2 className="text-2xl font-semibold">¡OFERTAS DIARIAS!</h2>
                    <span className="h-px w-16 bg-black/60 dark:bg-white/30" />
                </div>

                <div className="flex items-center justify-center gap-8 text-sm mb-8">
                    <button
                        className={`pb-1 ${tab === "new" ? "text-black dark:text-white border-b-2 border-[#c2185b]" : "opacity-70"}`}
                        onClick={() => setTab("new")}
                    >
                        Recién llegados
                    </button>

                    <button
                        className={`pb-1 ${tab === "best" ? "text-black dark:text-white border-b-2 border-[#c2185b]" : "opacity-70"}`}
                        onClick={() => setTab("best")}
                    >
                        Los más vendidos
                    </button>

                    <button
                        className={`pb-1 ${tab === "sale" ? "text-black dark:text-white border-b-2 border-[#c2185b]" : "opacity-70"}`}
                        onClick={() => setTab("sale")}
                    >
                        Artículos en oferta
                    </button>

                </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {visible.map((p) => (
                        <DealCard key={p.id} product={p} onQuickView={setQuick} />
                    ))}
                </div>
            </div>

            {quick && <QuickViewModal product={quick} onClose={() => setQuick(null)} />}
        </section>
    );
}
