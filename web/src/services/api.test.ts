import { describe, expect, it, vi } from 'vitest';
import { api, createPoint, getItems } from './api';
import { getCities, getStates, locationsApi } from './locations';
import type { PointInput } from '../types';

const point: PointInput = {
  name: 'Coleta Verde', email: 'contato@example.com', whatsapp: '11999999999',
  uf: 'SP', city: 'São Paulo', position: [-23.55, -46.63], items: [1, 3],
};

describe('contratos HTTP originais', () => {
  it('consulta GET items e encaminha o sinal de cancelamento', async () => {
    const items = [{ id: 1, title: 'Lâmpadas', image_url: 'http://localhost:3333/uploads/lampadas.svg' }];
    const get = vi.spyOn(api, 'get').mockResolvedValue({ data: items });
    const controller = new AbortController();
    expect(await getItems(controller.signal)).toEqual(items);
    expect(get).toHaveBeenCalledWith('items', { signal: controller.signal });
  });

  it('envia POST points multipart com os campos e a imagem originais', async () => {
    const post = vi.spyOn(api, 'post').mockResolvedValue({ data: { id: 1 } });
    const image = new File(['image'], 'estabelecimento.png', { type: 'image/png' });
    await createPoint({ ...point, image });
    expect(post).toHaveBeenCalledOnce();
    const [endpoint, body] = post.mock.calls[0];
    expect(endpoint).toBe('points');
    expect(body).toBeInstanceOf(FormData);
    expect(Object.fromEntries((body as FormData).entries())).toEqual({
      name: point.name, email: point.email, whatsapp: point.whatsapp,
      uf: 'SP', city: 'São Paulo', latitude: '-23.55', longitude: '-46.63',
      items: '1,3', image,
    });
    expect(post.mock.calls[0]).toHaveLength(2);
  });

  it('mantém a imagem opcional e os valores iniciais do formulário original', async () => {
    const post = vi.spyOn(api, 'post').mockResolvedValue({});
    await createPoint({ ...point, uf: '0', city: '0', position: [0, 0], items: [] });
    const body = post.mock.calls[0][1] as FormData;
    expect(body.has('image')).toBe(false);
    expect(body.get('items')).toBe('');
    expect(body.get('latitude')).toBe('0');
    expect(body.get('uf')).toBe('0');
  });

  it('mantém endpoints do IBGE e converte os nomes sem alterar a ordem', async () => {
    const get = vi.spyOn(locationsApi, 'get')
      .mockResolvedValueOnce({ data: [{ sigla: 'SP' }, { sigla: 'SC' }] })
      .mockResolvedValueOnce({ data: [{ nome: 'São Paulo' }] });
    expect(await getStates()).toEqual(['SP', 'SC']);
    expect(await getCities('SP')).toEqual(['São Paulo']);
    expect(get).toHaveBeenNthCalledWith(1, 'estados', { signal: undefined });
    expect(get).toHaveBeenNthCalledWith(2, 'estados/SP/municipios', { signal: undefined });
  });
});
