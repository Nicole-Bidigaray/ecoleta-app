export interface CollectionItem {
  id: number;
  title: string;
  image_url: string;
}

export type Coordinates = [latitude: number, longitude: number];

export interface PointInput {
  name: string;
  email: string;
  whatsapp: string;
  uf: string;
  city: string;
  position: Coordinates;
  items: number[];
  image?: File;
}
