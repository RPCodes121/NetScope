
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        Accept: "application/json",
    },
});

// Upload PCAP / PCAPNG
export const uploadCapture = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/captures", formData);

    return response.data;
};

// Retrieve all captures
export const getCaptures = async () => {
    const response = await api.get("/captures");

    return response.data;
};

// Retrieve one capture
export const getCaptureById = async (id) => {
    const response = await api.get(`/captures/${id}`);

    return response.data;
};

// Retrieve network flows for a capture
export const getFlows = async (captureId) => {
    const response = await api.get(
        `/captures/${captureId}/flows`
    );

    return response.data;
};

export default api;
