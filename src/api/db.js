import axios from 'axios';

const API_BASE_URL = '/api';

export const fetchGrantsByProvince = async () => {
  const response = await axios.get(`${API_BASE_URL}/grants/by-province`);
  return response.data;
};

export const fetchGrantsByProgram = async () => {
  const response = await axios.get(`${API_BASE_URL}/grants/by-program`);
  return response.data;
};

export const fetchTopRecipients = async () => {
  const response = await axios.get(`${API_BASE_URL}/grants/top-recipients`);
  return response.data;
};

export const fetchGrantsByRecipientType = async () => {
  const response = await axios.get(`${API_BASE_URL}/grants/by-recipient-type`);
  return response.data;
};


