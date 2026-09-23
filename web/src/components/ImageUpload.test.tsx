import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import ImageUpload from './ImageUpload';

it('mostra a prévia, substitui a imagem e libera as URLs ao desmontar', async () => {
  const create = vi.fn().mockReturnValueOnce('blob:first').mockReturnValueOnce('blob:second');
  const revoke = vi.fn();
  vi.stubGlobal('URL', class extends URL {
    static createObjectURL = create;
    static revokeObjectURL = revoke;
  });
  const onFileUploaded = vi.fn();
  const user = userEvent.setup();
  const { unmount } = render(<ImageUpload onFileUploaded={onFileUploaded} />);
  const file = new File(['image'], 'foto.png', { type: 'image/png' });
  await user.upload(screen.getByLabelText('Selecionar imagem do estabelecimento'), file);
  expect(screen.getByAltText('Prévia do estabelecimento')).toHaveAttribute('src', 'blob:first');
  expect(onFileUploaded).toHaveBeenCalledWith(file);
  const second = new File(['image2'], 'foto2.png', { type: 'image/png' });
  fireEvent.drop(screen.getByRole('button', { name: 'Alterar imagem do estabelecimento' }), {
    dataTransfer: { files: [second] },
  });
  expect(revoke).toHaveBeenCalledWith('blob:first');
  expect(screen.getByAltText('Prévia do estabelecimento')).toHaveAttribute('src', 'blob:second');
  unmount();
  expect(revoke).toHaveBeenCalledWith('blob:second');
});

it('rejeita arquivos que não são imagens e ignora uma seleção vazia', () => {
  const onFileUploaded = vi.fn();
  render(<ImageUpload onFileUploaded={onFileUploaded} />);
  const dropzone = screen.getByRole('button', { name: 'Imagem do estabelecimento' });
  fireEvent.drop(dropzone, { dataTransfer: { files: [] } });
  fireEvent.drop(dropzone, { dataTransfer: { files: [new File(['text'], 'file.txt', { type: 'text/plain' })] } });
  expect(screen.getByRole('alert')).toHaveTextContent('Selecione um arquivo de imagem.');
  expect(onFileUploaded).not.toHaveBeenCalled();
});
