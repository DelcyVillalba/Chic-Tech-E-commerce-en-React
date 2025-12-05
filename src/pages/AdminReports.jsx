import { useState, useEffect } from "react";
import {
    FiPackage,
    FiDollarSign,
    FiUsers,
    FiFilter,
    FiDownload,
    FiAlertTriangle
} from "react-icons/fi";
import AdminShell from "../components/AdminShell";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { getFullReportData } from "../api/reports";

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

export default function AdminReports() {
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
        end: new Date().toISOString().split("T")[0],
    });
    const [activePreset, setActivePreset] = useState(null); // 7d | 15d | month | null
    const [isLoading, setIsLoading] = useState(true);
    const [reportData, setReportData] = useState({
        summary: {
            totalProducts: 0,
            outOfStock: 0,
            totalSales: 0,
            newCustomers: 0,
        },
        salesData: {
            labels: [],
            datasets: [
                {
                    label: "Ventas",
                    data: [],
                    backgroundColor: "rgba(204, 17, 112, 0.75)", // fucsia del proyecto
                },
            ],
        },
        topProducts: [],
        lowStock: [],
    });

    // Cargar datos reales de la API
    useEffect(() => {
        const fetchReportData = async () => {
            setIsLoading(true);
            try {
                const data = await getFullReportData(dateRange.start, dateRange.end);
                setReportData(data);
            } catch (error) {
                console.error('Error al cargar reportes:', error);
                // Si hay error, mostrar datos de ejemplo
                setReportData({
                    summary: {
                        totalProducts: 0,
                        outOfStock: 0,
                        totalSales: 0,
                        newCustomers: 0,
                    },
                    salesData: {
                        labels: [],
                        datasets: [{
                            label: "Ventas",
                            data: [],
                            backgroundColor: "rgba(204, 17, 112, 0.75)",
                        }],
                    },
                    topProducts: [],
                    lowStock: [],
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchReportData();
    }, [dateRange]);

    const handleDateChange = (e) => {
        setActivePreset(null);
        setDateRange({
            ...dateRange,
            [e.target.name]: e.target.value
        });
    };

    const setPresetRange = (preset) => {
        const today = new Date();
        const end = today.toISOString().split("T")[0];
        let startDate = new Date(today);

        if (preset === "7d") {
            startDate.setDate(startDate.getDate() - 6);
        } else if (preset === "15d") {
            startDate.setDate(startDate.getDate() - 14);
        } else if (preset === "month") {
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        } else {
            startDate.setMonth(startDate.getMonth() - 1);
        }

        const start = startDate.toISOString().split("T")[0];
        setActivePreset(preset);
        setDateRange({ start, end });
    };

    const downloadReport = (type) => {
        if (typeof window === "undefined" || typeof document === "undefined") return;

        try {
            const { summary, topProducts } = reportData;
            const totalSales = Number(summary.totalSales || 0);

            const today = new Date().toLocaleString("es-AR");

            const topProductsRows =
                topProducts && topProducts.length
                    ? topProducts
                        .map(
                            (p, i) =>
                                `<tr>
                                    <td style="padding:4px 8px;border:1px solid #e5e5e5;">${i + 1}</td>
                                    <td style="padding:4px 8px;border:1px solid #e5e5e5;">${p.name}</td>
                                    <td style="padding:4px 8px;border:1px solid #e5e5e5;">${p.category || ""}</td>
                                    <td style="padding:4px 8px;border:1px solid #e5e5e5;text-align:right;">${p.sales ?? 0}</td>
                                </tr>`
                        )
                        .join("")
                    : `<tr><td colspan="4" style="padding:6px 8px;border:1px solid #e5e5e5;text-align:center;color:#666;">Sin datos de productos</td></tr>`;

            const html = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Reporte de ventas - Chic & Tech</title>
    <style>
      body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; font-size: 12px; color:#111827; margin:24px; }
      h1 { font-size: 20px; margin-bottom: 4px; }
      h2 { font-size: 14px; margin: 16px 0 4px; }
      .summary { display:flex; flex-wrap:wrap; gap:12px; margin-top:8px; }
      .card { border:1px solid #e5e5e5; border-radius:10px; padding:8px 10px; min-width:140px; }
      .label { font-size:11px; color:#6b7280; }
      .value { font-size:16px; font-weight:600; margin-top:2px; }
      table { border-collapse:collapse; width:100%; margin-top:6px; }
      th { background:#f9fafb; text-align:left; padding:4px 8px; border:1px solid #e5e5e5; font-size:11px; }
      td { font-size:11px; }
      .footer { margin-top:18px; font-size:10px; color:#6b7280; }
      @media print {
        button { display:none; }
        body { margin:8mm; }
      }
    </style>
  </head>
  <body>
    <h1>Reporte de ventas</h1>
    <div style="font-size:11px;color:#6b7280;">Generado: ${today}</div>
    <div style="font-size:11px;color:#6b7280;margin-bottom:12px;">
      Rango: ${dateRange.start} al ${dateRange.end}
    </div>

    <h2>Resumen</h2>
    <div class="summary">
      <div class="card">
        <div class="label">Productos totales</div>
        <div class="value">${summary.totalProducts}</div>
      </div>
      <div class="card">
        <div class="label">Sin stock</div>
        <div class="value">${summary.outOfStock}</div>
      </div>
      <div class="card">
        <div class="label">Ventas totales</div>
        <div class="value">$${totalSales.toLocaleString("es-AR")}</div>
      </div>
      <div class="card">
        <div class="label">Nuevos clientes</div>
        <div class="value">${summary.newCustomers}</div>
      </div>
    </div>

    <h2>Top productos</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Producto</th>
          <th>Categoría</th>
          <th style="text-align:right;">Ventas</th>
        </tr>
      </thead>
      <tbody>
        ${topProductsRows}
      </tbody>
    </table>

    <div class="footer">
      Chic & Tech · Panel de administración · Reporte generado automáticamente.
    </div>
    <button onclick="window.print()" style="margin-top:16px;padding:6px 10px;border-radius:9999px;border:1px solid #e5e5e5;background:#111827;color:#ffffff;font-size:11px;cursor:pointer;">
      Imprimir / Guardar como PDF
    </button>
  </body>
</html>`;

            const iframe = document.createElement("iframe");
            iframe.style.position = "fixed";
            iframe.style.right = "0";
            iframe.style.bottom = "0";
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.style.border = "0";
            iframe.style.visibility = "hidden";
            document.body.appendChild(iframe);

            iframe.onload = () => {
                try {
                    if (type === "pdf") {
                        iframe.contentWindow?.focus();
                        iframe.contentWindow?.print();
                    }
                } finally {
                    setTimeout(() => {
                        document.body.removeChild(iframe);
                    }, 1000);
                }
            };

            iframe.srcdoc = html;
        } catch (e) {
            console.error("No se pudo generar el PDF", e);
            alert("No se pudo generar el PDF. Probá de nuevo o exportá desde el navegador.");
        }
    };

    const periodLabel = (() => {
        const fmt = (iso) =>
            new Date(`${iso}T00:00:00`).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
            });
        if (activePreset === "7d") return "últimos 7 días";
        if (activePreset === "15d") return "últimos 15 días";
        if (activePreset === "month") return "este mes";
        return `del ${fmt(dateRange.start)} al ${fmt(dateRange.end)}`;
    })();

    const hasSalesData =
        Array.isArray(reportData.salesData?.labels) &&
        reportData.salesData.labels.length > 0 &&
        Array.isArray(reportData.salesData.datasets?.[0]?.data) &&
        reportData.salesData.datasets[0].data.length > 0;

    const getPresetButtonClasses = (preset) => {
        const isActive = activePreset === preset;
        const base =
            "px-3 py-1 rounded-md text-xs border border-zinc-300 dark:border-[#2a2338] transition-colors";

        if (isActive) {
            return `${base} bg-[#cc1170] text-white dark:bg-[#cc1170] dark:text-white shadow-sm`;
        }

        return `${base} text-gray-700 dark:text-gray-200 bg-white dark:bg-[#0f0b14] hover:bg-gray-50 dark:hover:bg-white/10`;
    };

    const summaryCards = [
        {
            title: "Productos Totales",
            value: reportData.summary.totalProducts,
            icon: <FiPackage className="w-6 h-6" />,
            trend: "+12%",
            trendPositive: true,
        },
        {
            title: "Sin Stock",
            value: reportData.summary.outOfStock,
            icon: <FiAlertTriangle className="w-6 h-6 text-yellow-500" />,
            trend: "+2%",
            trendPositive: false,
        },
        {
            title: "Ventas Totales",
            value: `$${reportData.summary.totalSales.toLocaleString()}`,
            icon: <FiDollarSign className="w-6 h-6 text-green-500" />,
            trend: "+8.5%",
            trendPositive: true,
            description: `en ${periodLabel}`,
        },
        {
            title: "Nuevos Clientes",
            value: reportData.summary.newCustomers,
            icon: <FiUsers className="w-6 h-6 text-blue-500" />,
            trend: "+15%",
            trendPositive: true,
        },
    ];

    return (
        <AdminShell title="Reportes">
            <div className="space-y-6 w-full text-zinc-900 dark:text-zinc-100 transition-colors">
                {/* Filtros */}
                <div className="bg-white dark:bg-[#0f0b14] rounded-2xl p-4 shadow-sm border border-zinc-200 dark:border-[#2a2338]">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Rango de fechas
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative flex-1 min-w-[140px]">
                            <input
                                type="date"
                                name="start"
                                value={dateRange.start}
                                onChange={handleDateChange}
                                className="w-full rounded-md border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] shadow-sm focus:border-[#f1197d] focus:ring-[#f1197d] text-sm text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <span className="self-center text-gray-400 dark:text-gray-400">-</span>
                        <div className="relative flex-1 min-w-[140px]">
                            <input
                                type="date"
                                name="end"
                                value={dateRange.end}
                                onChange={handleDateChange}
                                className="w-full rounded-md border border-zinc-200 dark:border-[#2a2338] bg-white dark:bg-[#0f0b14] shadow-sm focus:border-[#f1197d] focus:ring-[#f1197d] text-sm text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <button
                            onClick={() => downloadReport("pdf")}
                            className="inline-flex items-center px-1 py-01 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#f1197d] hover:bg-[#d90f6c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f1197d]"
                        >
                            <FiDownload className="mr-2" />
                            Exportar PDF
                        </button>
                        <span className="ml-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Rápidos:
                        </span>
                        <button
                            type="button"
                            onClick={() => setPresetRange("7d")}
                            className={getPresetButtonClasses("7d")}
                        >
                            Últimos 7 días
                        </button>
                        <button
                            type="button"
                            onClick={() => setPresetRange("15d")}
                            className={getPresetButtonClasses("15d")}
                        >
                            Últimos 15 días
                        </button>
                        <button
                            type="button"
                            onClick={() => setPresetRange("month")}
                            className={getPresetButtonClasses("month")}
                        >
                            Este mes
                        </button>
                    </div>
                </div>

                {/* Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {summaryCards.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-[#0f0b14] rounded-2xl p-6 shadow-sm border border-zinc-100 dark:border-[#2a2338] transition-all hover:shadow-md dark:shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
                        >
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-lg ${card.title === "Sin Stock" ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-300" :
                                    card.title === "Ventas Totales" ? "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300" :
                                        card.title === "Nuevos Clientes" ? "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300" :
                                            "bg-rose-50 text-[#cc1170] dark:bg-[#cc1170]/15 dark:text-[#ffb3d5]"
                                    }`}>
                                    {card.icon}
                                </div>
                                <span
                                    className={`text-sm font-medium ${card.trendPositive ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {card.trend}
                                </span>
                            </div>
                            <h3 className="mt-4 text-gray-500 dark:text-gray-300 text-sm font-medium">
                                {card.title}
                            </h3>
                            {card.description && (
                                <p className="text-[11px] text-gray-400 dark:text-gray-400 mt-0.5">
                                    {card.description}
                                </p>
                            )}
                            <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                {card.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Gráficos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-[#0f0b14] border border-zinc-200 dark:border-[#2a2338] p-6 rounded-2xl shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            Ventas por día
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-300 mb-2">
                            Período: {periodLabel}
                        </p>
                        <div className="h-80 bg-white dark:bg-white/95 rounded-xl p-4 flex items-center justify-center">
                            {hasSalesData ? (
                                <div className="relative w-full h-full max-w-md mx-auto">
                                    <Doughnut
                                        data={{
                                            labels: reportData.salesData.labels,
                                            datasets: [
                                                {
                                                    ...reportData.salesData.datasets[0],
                                                    backgroundColor: reportData.salesData.labels.map((_, i) => {
                                                        const palette = [
                                                            "#cc1170",
                                                            "#0EA5E9FF",
                                                            "#22c55e",
                                                            "#f97316",
                                                            "#6366f1",
                                                            "#eab308",
                                                            "#ec4899",
                                                        ];
                                                        return palette[i % palette.length];
                                                    }),
                                                    borderWidth: 0,
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: "bottom",
                                                },
                                            },
                                            cutout: "60%",
                                        }}
                                    />
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                    Sin datos de ventas en este período.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-[#0f0b14] border border-zinc-200 dark:border-[#2a2338] p-6 rounded-2xl shadow-sm">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                            Productos más vendidos
                        </h3>
                        <div className="space-y-4">
                            {reportData.topProducts.map((product) => (
                                <div key={product.id} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                {product.name}
                                            </span>
                                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">
                                                {product.category || "Sin categoría"}
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {product.sales} ventas
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                                        <div
                                            className="bg-[#cc1170] h-2 rounded-full"
                                            style={{
                                                width: `${(product.sales / Math.max(...reportData.topProducts.map(p => p.sales))) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-300">
                                        <span>${product.revenue.toLocaleString()} en ventas</span>
                                        <span>${product.price} c/u</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabla de productos con bajo stock */}
                <div className="bg-white dark:bg-[#0f0b14] rounded-2xl shadow-sm overflow-hidden border border-zinc-200 dark:border-[#2a2338]">
                    <div className="p-6 border-b border-gray-200 dark:border-[#2a2338] flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Productos con bajo stock
                        </h3>
                        <span className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded-full">
                            {(reportData.lowStock?.length || 0)} productos
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-[#2a2338]">
                            <thead className="bg-gray-50 dark:bg-[#161225]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Producto
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-[#0f0b14] divide-y divide-gray-200 dark:divide-[#2a2338]">
                                {(reportData.lowStock?.length || 0) === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 text-center"
                                        >
                                            No hay productos con bajo stock.
                                        </td>
                                    </tr>
                                ) : (
                                    reportData.lowStock.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="hover:bg-gray-50 dark:hover:bg-white/5"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-white/10 rounded-md" />
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {product.name || product.title || "Producto sin nombre"}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-300">
                                                            {product.sku
                                                                ? `SKU: ${product.sku}`
                                                                : `ID: ${product.id}`}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 dark:text-gray-300">
                                                    {product.category || "Sin categoría"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        product.stockLevel === "critical"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                >
                                                    {product.stock} en stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-[#cc1170] hover:text-[#a80f5d] dark:text-[#ffffff] dark:hover:text-[#ffd0e5]">
                                                    Reponer
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#161225] px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-[#2a2338]">
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                            {reportData.lowStock?.length
                                ? (
                                    <>
                                        Mostrando <span className="font-medium">1</span> a{" "}
                                        <span className="font-medium">{reportData.lowStock.length}</span> de{" "}
                                        <span className="font-medium">{reportData.lowStock.length}</span> resultados
                                    </>
                                )
                                : "Sin productos con bajo stock"}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                className="px-3 py-1 border border-zinc-300 dark:border-[#2a2338] rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-[#0f0b14] hover:bg-gray-50 dark:hover:bg-white/10"
                                disabled
                            >
                                Anterior
                            </button>
                            <button
                                className="px-3 py-1 border border-zinc-300 dark:border-[#2a2338] rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-[#0f0b14] hover:bg-gray-50 dark:hover:bg-white/10"
                                disabled
                            >
                                Siguiente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminShell>
    );
}
