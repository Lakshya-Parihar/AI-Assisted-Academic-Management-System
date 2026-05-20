import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

export const getAdminProfile = () => {
  return adminApi.get("/profile");
};

export const updateAdminProfile = (data) => {
  return adminApi.put("/profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const setBranchFees = (data) => {
  return adminApi.post("/fees/branch-fees", data);
};

export const getBranchFees = () => {
  return adminApi.get("/fees");
};

export const updateBranchFees = (id, data) => {
  return adminApi.put(`/fees/${id}`, data);
};

export const deleteBranchFees = (id) => {
  return adminApi.delete(`/fees/${id}`);
};

export const getBranches = () => {
  return adminApi.get("/fees/branches");
};

export const getFeeTransactions = () => adminApi.get("/fees/transactions");

export const getFacultyBranches = () => {
  return adminApi.get("/branches");
};

export const getStudents = () => {
  return adminApi.get("/students");
};

// --- CERTIFICATE MANAGEMENT ---
export const getAllIssuedCertificates = () => adminApi.get("/certificates");
export const revokeCertificate = (id) => adminApi.delete(`/certificates/${id}`);
export const issueStudentCertificate = (formData) => {
  return adminApi.post("/certificates/issue", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// --- NEW: CERTIFICATE REQUESTS ---
export const getPendingCertificateRequests = () =>
  adminApi.get("/certificates/requests");
export const rejectStudentCertificateRequest = (id) =>
  adminApi.put(`/certificates/requests/${id}/reject`);

// 🔐 Attach token automatically
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default adminApi;
