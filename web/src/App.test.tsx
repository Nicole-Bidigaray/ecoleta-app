import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import * as api from './services/api';
import * as locations from './services/locations';
import type { Coordinates } from './types';

// Leaflet's actual rendering, geolocation and marker are checked in the browser.
vi.mock('./components/LocationPicker', () => ({
  default: ({ onChange }: { onChange: (position: Coordinates) => void }) => (
    <button type="button" onClick={() => onChange([-23.55, -46.63])}>Selecionar posição no mapa</button>
  ),
}));

const items = [
  { id: 1, title: 'Lâmpadas', image_url: '/lampadas.svg' },
  { id: 2, title: 'Pilhas e baterias', image_url: '/baterias.svg' },
];

function renderApp(path = '/create-point') {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
}

beforeEach(() => {
  vi.spyOn(api, 'getItems').mockResolvedValue(items);
  vi.spyOn(api, 'createPoint').mockResolvedValue(undefined);
  vi.spyOn(locations, 'getStates').mockResolvedValue(['SP', 'SC']);
  vi.spyOn(locations, 'getCities').mockImplementation(async (uf) => uf === 'SP' ? ['São Paulo'] : ['Florianópolis']);
});

describe('fluxos do Ecoleta', () => {
  it('navega da home ao cadastro e volta pelo link original', async () => {
    const user = userEvent.setup();
    renderApp('/');
    expect(screen.getByRole('heading', { name: 'Seu marketplace de coleta de resíduos.' })).toBeVisible();
    await user.click(screen.getByRole('link', { name: 'Cadastre um ponto de coleta' }));
    expect(await screen.findByRole('heading', { name: 'Cadastro do ponto de coleta' })).toBeVisible();
    await user.click(screen.getByRole('link', { name: 'Voltar para home' }));
    expect(screen.getByRole('heading', { name: 'Seu marketplace de coleta de resíduos.' })).toBeVisible();
  });

  it('preenche, seleciona múltiplos itens, envia e retorna à home após confirmação', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.type(await screen.findByLabelText('Nome da entidade'), 'Coleta Verde');
    await user.type(screen.getByLabelText('E-mail'), 'contato@example.com');
    await user.type(screen.getByLabelText('Whatsapp'), '11999999999');
    await user.selectOptions(screen.getByLabelText('Estado (UF)'), 'SP');
    await screen.findByRole('option', { name: 'São Paulo' });
    await user.selectOptions(screen.getByLabelText('Cidade'), 'São Paulo');
    await user.click(screen.getByRole('button', { name: 'Selecionar posição no mapa' }));
    await user.click(screen.getByRole('button', { name: 'Lâmpadas' }));
    await user.click(screen.getByRole('button', { name: 'Pilhas e baterias' }));
    await user.click(screen.getByRole('button', { name: 'Lâmpadas' }));
    expect(screen.getByRole('button', { name: 'Lâmpadas' })).toHaveAttribute('aria-pressed', 'false');
    await user.click(screen.getByRole('button', { name: 'Cadastrar ponto de coleta' }));
    expect(api.createPoint).toHaveBeenCalledWith({
      name: 'Coleta Verde', email: 'contato@example.com', whatsapp: '11999999999',
      uf: 'SP', city: 'São Paulo', position: [-23.55, -46.63], items: [2], image: undefined,
    });
    expect(await screen.findByRole('dialog', { name: 'Cadastro concluído!' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: 'Seu marketplace de coleta de resíduos.' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cadastro concluído! Voltar para home' }));
    expect(await screen.findByRole('heading', { name: 'Seu marketplace de coleta de resíduos.' })).toBeVisible();
  });

  it('limpa a cidade ao trocar de UF e ignora respostas obsoletas', async () => {
    let resolveOld!: (cities: string[]) => void;
    vi.mocked(locations.getCities).mockImplementation((uf) => uf === 'SP'
      ? new Promise((resolve) => { resolveOld = resolve; })
      : Promise.resolve(['Florianópolis']));
    const user = userEvent.setup();
    renderApp();
    await screen.findByRole('option', { name: 'SP' });
    await user.selectOptions(screen.getByLabelText('Estado (UF)'), 'SP');
    await user.selectOptions(screen.getByLabelText('Estado (UF)'), 'SC');
    await screen.findByRole('option', { name: 'Florianópolis' });
    await user.selectOptions(screen.getByLabelText('Cidade'), 'Florianópolis');
    await act(async () => resolveOld(['São Paulo']));
    expect(screen.queryByRole('option', { name: 'São Paulo' })).not.toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Estado (UF)'), '0');
    expect(screen.getByLabelText('Cidade')).toHaveValue('0');
    expect(screen.getByLabelText('Cidade')).toBeDisabled();
  });

  it('permite tentar carregar os itens novamente após falha de rede', async () => {
    vi.mocked(api.getItems).mockRejectedValueOnce(new Error('offline'));
    const user = userEvent.setup();
    renderApp();
    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível carregar os itens');
    await user.click(screen.getByRole('button', { name: 'Tentar novamente' }));
    expect(await screen.findByRole('button', { name: 'Lâmpadas' })).toBeVisible();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('mantém os dados quando o cadastro falha e permite nova tentativa', async () => {
    vi.mocked(api.createPoint).mockRejectedValueOnce(new Error('offline'));
    const user = userEvent.setup();
    renderApp();
    await user.type(await screen.findByLabelText('Nome da entidade'), 'Coleta Verde');
    await user.click(screen.getByRole('button', { name: 'Cadastrar ponto de coleta' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível cadastrar');
    expect(screen.getByLabelText('Nome da entidade')).toHaveValue('Coleta Verde');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cadastrar ponto de coleta' }));
    await user.click(await screen.findByRole('button', { name: 'Cadastro concluído! Voltar para home' }));
    await screen.findByRole('heading', { name: 'Seu marketplace de coleta de resíduos.' });
  });

  it('bloqueia o envio duplicado enquanto a requisição está pendente', async () => {
    let finish!: () => void;
    vi.mocked(api.createPoint).mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
    const user = userEvent.setup();
    renderApp();
    await user.dblClick(await screen.findByRole('button', { name: 'Cadastrar ponto de coleta' }));
    expect(screen.getByRole('button', { name: 'Cadastrando…' })).toBeDisabled();
    expect(api.createPoint).toHaveBeenCalledOnce();
    await act(async () => finish());
    expect(await screen.findByRole('dialog', { name: 'Cadastro concluído!' })).toBeVisible();
  });
});
