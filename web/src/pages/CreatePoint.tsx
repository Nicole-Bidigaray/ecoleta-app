import { useCallback, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router';
import logo from '../assets/pencil/logo.png';
import ImageUpload from '../components/ImageUpload';
import LoadFeedback from '../components/LoadFeedback';
import LocationPicker from '../components/LocationPicker';
import SuccessConfirmation from '../components/SuccessConfirmation';
import { itemArtwork } from '../components/itemArtwork';
import { useRemoteList } from '../hooks/useRemoteList';
import { createPoint, getItems } from '../services/api';
import { getCities, getStates } from '../services/locations';
import type { Coordinates } from '../types';
import './CreatePoint.css';

export default function CreatePoint() {
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
  const [selectedUf, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Coordinates>([0, 0]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const submittingRef = useRef(false);
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  const items = useRemoteList(getItems);
  const states = useRemoteList(getStates);
  const loadCities = useCallback(
    (signal: AbortSignal) => selectedUf === '0' ? Promise.resolve([]) : getCities(selectedUf, signal),
    [selectedUf],
  );
  const cities = useRemoteList(loadCities);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  function toggleItem(id: number) {
    setSelectedItems((previous) => previous.includes(id)
      ? previous.filter((item) => item !== id)
      : [...previous, id]);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current || succeeded) return;
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError('');
    try {
      await createPoint({
        ...formData,
        uf: selectedUf,
        city: selectedCity,
        position: selectedPosition,
        items: selectedItems,
        image: selectedFile,
      });
      setSucceeded(true);
    } catch {
      setSubmitError('Não foi possível cadastrar o ponto de coleta. Verifique os dados e a conexão e tente novamente.');
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <div id="page-create-point">
      <header className="page-header">
        <img src={logo} alt="Ecoleta" width="182" height="44" />
        <Link to="/"><FiArrowLeft aria-hidden="true" />Voltar para home</Link>
      </header>
      <main>
        <form onSubmit={handleSubmit} aria-busy={submitting}>
          <h1>Cadastro do <br />ponto de coleta</h1>
          <ImageUpload onFileUploaded={setSelectedFile} />
          <fieldset>
            <legend><span className="section-title">Dados</span></legend>
            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input id="name" name="name" type="text" autoComplete="organization" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="contact-fields">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleInputChange} />
              </div>
              <div className="field whatsapp-field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input id="whatsapp" name="whatsapp" type="text" inputMode="tel" autoComplete="tel" value={formData.whatsapp} onChange={handleInputChange} />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <span className="section-heading"><span className="section-title">Endereço</span><span>Selecione o endereço no mapa</span></span>
            </legend>
            <LocationPicker position={selectedPosition} onChange={setSelectedPosition} />
            <LoadFeedback {...states} subject="os estados" />
            <div className="field-group location-fields">
              <div className="field">
                <label htmlFor="uf">Estado (UF)</label>
                <select id="uf" name="uf" value={selectedUf} disabled={states.loading} onChange={(event) => {
                  setSelectedUf(event.target.value);
                  setSelectedCity('0');
                }}>
                  <option value="0">Selecione uma UF</option>
                  {states.data.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select id="city" name="city" value={selectedCity} disabled={selectedUf === '0' || cities.loading} onChange={(event) => setSelectedCity(event.target.value)}>
                  <option value="0">Selecione uma cidade</option>
                  {cities.data.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            </div>
            {selectedUf !== '0' && <LoadFeedback {...cities} subject="as cidades" />}
          </fieldset>
          <fieldset>
            <legend>
              <span className="section-heading"><span className="section-title">Ítens de coleta</span><span>Selecione um ou mais itens abaixo</span></span>
            </legend>
            <LoadFeedback {...items} subject="os itens de coleta" />
            {!items.loading && !items.failed && items.data.length === 0 && <p role="status">Nenhum item de coleta disponível.</p>}
            <ul className="items-grid">
              {items.data.map((item) => (
                <li key={item.id}>
                  <button type="button" aria-pressed={selectedItems.includes(item.id)} onClick={() => toggleItem(item.id)}>
                    <img src={itemArtwork(item)} alt="" />
                    <span>{item.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>
          {submitError && <p className="feedback error" role="alert">{submitError}</p>}
          <button className="submit-button" type="submit" disabled={submitting || succeeded}>
            {submitting ? 'Cadastrando…' : 'Cadastrar ponto de coleta'}
          </button>
        </form>
      </main>
      {succeeded && <SuccessConfirmation onConfirm={() => navigate('/')} />}
    </div>
  );
}
