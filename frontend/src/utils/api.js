const BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

export const auth = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
};

export const products = {
  getAll: () => request("/products"),
  create: (body) => request("/products", { method: "POST", body: JSON.stringify(body) }),
  getOne: (serial) => request(`/products/${serial}`),
};

export const verify = {
  check: (serial) => request(`/verify/${serial}`),
  getQR: (serial) => request(`/verify/qr/${serial}`),
};
