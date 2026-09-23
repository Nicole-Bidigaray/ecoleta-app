import axios from 'axios';

interface IBGEState { sigla: string }
interface IBGECity { nome: string }

export const locationsApi = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades',
  timeout: 20_000,
});

export async function getStates(signal?: AbortSignal) {
  const { data } = await locationsApi.get<IBGEState[]>('estados', { signal });
  return data.map((state) => state.sigla);
}

export async function getCities(uf: string, signal?: AbortSignal) {
  const { data } = await locationsApi.get<IBGECity[]>(
    `estados/${encodeURIComponent(uf)}/municipios`, { signal },
  );
  return data.map((city) => city.nome);
}
