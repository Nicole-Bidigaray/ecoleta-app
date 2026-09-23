import { useEffect, useRef, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import './ImageUpload.css';

interface Props {
  onFileUploaded: (file: File) => void;
}

export default function ImageUpload({ onFileUploaded }: Props) {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState('');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function selectFile(candidate?: File) {
    if (!candidate) return;
    if (!candidate.type.startsWith('image/')) {
      setError('Selecione um arquivo de imagem.');
      return;
    }
    setError('');
    setFile(candidate);
    onFileUploaded(candidate);
  }

  return (
    <>
      <button
        type="button"
        className={`dropzone${dragging ? ' dragging' : ''}`}
        aria-label={file ? 'Alterar imagem do estabelecimento' : 'Imagem do estabelecimento'}
        aria-describedby={error ? 'image-error' : undefined}
        onClick={() => input.current?.click()}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          selectFile(event.dataTransfer.files[0]);
        }}
      >
        {preview ? <img src={preview} alt="Prévia do estabelecimento" /> : (
          <span><FiUpload aria-hidden="true" />Imagem do estabelecimento</span>
        )}
      </button>
      <input
        ref={input}
        className="visually-hidden"
        tabIndex={-1}
        type="file"
        accept="image/*"
        aria-label="Selecionar imagem do estabelecimento"
        onChange={(event) => {
          selectFile(event.target.files?.[0]);
          event.target.value = '';
        }}
      />
      {error && <p id="image-error" className="feedback error" role="alert">{error}</p>}
    </>
  );
}
