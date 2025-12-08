export const tCategory = {
  "men's clothing": "Ropa de hombre",
  "women's clothing": "Ropa de mujer",
  "jewelery": "Joyería",
  "electronics": "Electrónica",
  tecnologia: "Tecnología",
  mujer: "Mujer",
  hombre: "Hombre",
  accesorios: "Accesorios",
  cosmeticos: "Cosméticos",
  hogar: "Hogar",
  jardin: "Jardín",
  libros: "Libros",
  mascotas: "Mascotas",
  ninos: "Niños",
};

export const rules = [
  { from: /t-?shirt/i, to: "Remera" },
  { from: /jacket/i, to: "Campera" },
  { from: /bag/i, to: "Bolso" },
];

const autoEs = (s = "") =>
  rules.reduce((a, r) => a.replace(r.from, r.to), String(s));

export const translate = (p) => ({
  ...p,
  title: p.titleEs ?? autoEs(p.title),
  description: p.descriptionEs ?? p.description ?? "",
  category: p.category,
  categoryEs: tCategory[p.category] ?? p.category,
});
