const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers }
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.message || "Request failed.");
  return data;
}

export const customerApi = {
  list: () => request("/customers"),
  get: (id) => request(`/customers/${id}`),
  create: (customer) => request("/customers", { method: "POST", body: JSON.stringify(customer) }),
  update: (id, customer) => request(`/customers/${id}`, { method: "PUT", body: JSON.stringify(customer) }),
  remove: (id) => request(`/customers/${id}`, { method: "DELETE" })
};
