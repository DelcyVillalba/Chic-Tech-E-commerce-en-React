// Estaciones para hemisferio sur: Verano(Dic–Feb), Otoño(Mar–May), Invierno(Jun–Ago), Primavera(Sep–Nov)
export function getSeason(date = new Date()) {
    const m = date.getMonth();
    if ([11, 0, 1].includes(m)) return "verano";
    if ([2, 3, 4].includes(m)) return "otoño";
    if ([5, 6, 7].includes(m)) return "invierno";
    return "primavera";
}