import { useEffect, useRef } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import './SuccessConfirmation.css';

export default function SuccessConfirmation({ onConfirm }: { onConfirm: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="success-confirmation"
      aria-labelledby="success-title"
      aria-describedby="success-instructions"
      onCancel={(event) => { event.preventDefault(); onConfirm(); }}
    >
      <button className="success-action" type="button" onClick={onConfirm} aria-label="Cadastro concluído! Voltar para home" title="Voltar para home">
        <FiCheckCircle aria-hidden="true" />
        <span id="success-title">Cadastro concluído!</span>
      </button>
      <p id="success-instructions" className="visually-hidden">
        Ponto de coleta criado! Ative a confirmação ou pressione Escape para voltar para home.
      </p>
    </dialog>
  );
}
