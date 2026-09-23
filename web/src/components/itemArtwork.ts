import lamps from '../assets/pencil/lampadas.png';
import batteries from '../assets/pencil/baterias.png';
import paper from '../assets/pencil/papeis-papelao.png';
import electronics from '../assets/pencil/eletronicos.png';
import organic from '../assets/pencil/organicos.png';
import oil from '../assets/pencil/oleo.png';
import type { CollectionItem } from '../types';

const artwork: Record<string, string> = {
  lampadas: lamps,
  'pilhas e baterias': batteries,
  'papeis e papelao': paper,
  'residuos eletronicos': electronics,
  'residuos organicos': organic,
  'oleo de cozinha': oil,
};

// Only the presentation comes from Pencil. IDs, availability and titles remain API-owned.
export function itemArtwork(item: CollectionItem) {
  const title = item.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  return artwork[title] ?? item.image_url;
}
