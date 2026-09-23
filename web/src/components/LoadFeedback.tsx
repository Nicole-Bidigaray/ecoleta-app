interface Props {
  loading: boolean;
  failed: boolean;
  subject: string;
  retry: () => void;
}

export default function LoadFeedback({ loading, failed, subject, retry }: Props) {
  if (loading) return <p className="feedback" role="status">Carregando {subject}…</p>;
  if (!failed) return null;
  return (
    <div className="feedback error" role="alert">
      Não foi possível carregar {subject}. Verifique a conexão com o serviço.
      {' '}<button className="retry-button" type="button" onClick={retry}>Tentar novamente</button>
    </div>
  );
}
