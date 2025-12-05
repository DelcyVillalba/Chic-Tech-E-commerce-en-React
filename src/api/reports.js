import { api } from "./client";
import { getProducts } from "./products";
import { listOrders } from "./orders";

// Calcular resumen de reportes
export const getReportSummary = async () => {
    try {
        const products = await getProducts();
        const orders = await listOrders();

        // Calcular métricas
        const totalProducts = products.length;
        const outOfStock = products.filter(p => p.stock <= 5).length;
        const totalSales = orders.reduce(
            (sum, order) => sum + (order.totals?.total || order.total || 0),
            0
        );
        const newCustomers = [...new Set(orders.map(o => o.customerId))].length;

        return {
            totalProducts,
            outOfStock,
            totalSales,
            newCustomers,
        };
    } catch (error) {
        console.error("Error al calcular resumen:", error);
        throw error;
    }
};

// Generar datos de ventas simulados basados en pedidos existentes
export const getSalesData = async (startDate, endDate) => {
    try {
        const orders = await listOrders();

        // Filtrar por fecha si es necesario
        const filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return orderDate >= start && orderDate <= end;
        });

        // Agrupar ventas por día
        const salesByDay = {};
        filteredOrders.forEach(order => {
            const isoDate = new Date(order.createdAt).toISOString().split("T")[0]; // yyyy-mm-dd
            const total = order.totals?.total ?? order.total ?? 0;
            salesByDay[isoDate] = (salesByDay[isoDate] || 0) + total;
        });

        const keys = Object.keys(salesByDay).sort();
        const labels = keys.map(k =>
            new Date(`${k}T00:00:00`).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "2-digit",
            })
        );
        const data = keys.map(k => salesByDay[k]);

        return {
            labels,
            datasets: [{
                label: "Ventas",
                data,
                borderColor: "#cc1170",
                backgroundColor: "rgba(204, 17, 112, 0.25)",
                fill: true,
                tension: 0.35,
                pointRadius: 0,
                pointHitRadius: 6,
            }],
        };
    } catch (error) {
        console.error("Error al generar datos de ventas:", error);
        // Retornar datos vacíos si hay error
        return {
            labels: [],
            datasets: [{
                label: "Ventas",
                data: [],
                borderColor: "#cc1170",
                backgroundColor: "rgba(204, 17, 112, 0.25)",
                fill: true,
                tension: 0.35,
                pointRadius: 0,
                pointHitRadius: 6,
            }],
        };
    }
};

// Calcular productos más vendidos a partir de pedidos
export const getTopProducts = async () => {
    try {
        const orders = await listOrders();
        const products = await getProducts();

        // Contar ventas por producto
        const productSales = {};

        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const rawId = item.productId ?? item.id ?? item.product?.id;
                    if (!rawId && rawId !== 0) return;
                    const key = String(rawId);
                    productSales[key] = (productSales[key] || 0) + (item.quantity || 1);
                });
            }
        });

        // Convertir a array y ordenar
        const topProducts = Object.entries(productSales)
            .map(([productId, sales]) => {
                const product = products.find(p => String(p.id) === String(productId));
                const price = Number(product?.price || 0);
                return {
                    id: product?.id ?? productId,
                    name: product?.name || product?.title || `ID: ${productId}`,
                    category: product?.category || "Sin categoría",
                    price,
                    sales,
                    revenue: sales * price,
                };
            })
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 10); // Top 10

        return topProducts;
    } catch (error) {
        console.error("Error al calcular productos más vendidos:", error);
        return [];
    }
};

// Obtener productos con bajo stock
export const getLowStockProducts = async () => {
    try {
        const products = await getProducts();

        return products
            .filter(product => product.stock <= 5)
            .map(product => ({
                ...product,
                stockLevel: product.stock <= 2 ? 'critical' : 'low',
            }));
    } catch (error) {
        console.error("Error al obtener productos con bajo stock:", error);
        return [];
    }
};

// Obtener todos los datos del reporte en una sola llamada
export const getFullReportData = async (startDate, endDate) => {
    try {
        const [summary, salesData, topProducts, lowStock] = await Promise.all([
            getReportSummary(),
            getSalesData(startDate, endDate),
            getTopProducts(),
            getLowStockProducts(),
        ]);

        return {
            summary,
            salesData,
            topProducts,
            lowStock,
        };
    } catch (error) {
        console.error("Error al cargar datos del reporte:", error);
        throw error;
    }
};
