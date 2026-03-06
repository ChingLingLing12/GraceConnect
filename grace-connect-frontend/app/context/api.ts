export const apiFetch = async (url: string, options: any = {}) => {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers,
    credentials: "include", // Important for cookies / auth
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`API Error: ${res.status} ${errText}`);
  }

  return res.json();
};