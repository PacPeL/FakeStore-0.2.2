const BASE_URL = "https://fakestoreapi.com";

async function request(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getProducts: () => request("/products"),
  getProduct: (id) => request(`/products/${id}`),
  getCategories: () => request("/products/categories"),
  getByCategory: (cat) =>
    request(`/products/category/${encodeURIComponent(cat)}`),
};