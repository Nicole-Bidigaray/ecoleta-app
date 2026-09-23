import axios from 'axios';
import type { CollectionItem, PointInput } from '../types';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3333',
  timeout: 20_000,
});

export async function getItems(signal?: AbortSignal) {
  const { data } = await api.get<CollectionItem[]>('items', { signal });
  return data;
}

export async function createPoint(point: PointInput) {
  const data = new FormData();
  data.append('name', point.name);
  data.append('email', point.email);
  data.append('whatsapp', point.whatsapp);
  data.append('uf', point.uf);
  data.append('city', point.city);
  data.append('latitude', String(point.position[0]));
  data.append('longitude', String(point.position[1]));
  data.append('items', point.items.join(','));
  if (point.image) data.append('image', point.image);

  // The browser supplies the multipart boundary. Do not set Content-Type manually.
  await api.post('points', data);
}
