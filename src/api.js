import axios from 'axios';

export async function getStatus (address) {
  const response = await axios.get(`http://${address}:8123/status`);
  return response.data;
}

export async function getCountries (address) {
  const response = await axios.get(`http://${address}:8123/countries`);
  return response.data.countries;
}

export async function connect (address, server) {
  const response = await axios.post(`http://${address}:8123/connect`, { server });
  return response.data;
}

export async function disconnect (address) {
  const response = await axios.post(`http://${address}:8123/disconnect`, {});
  return response.data;
}
