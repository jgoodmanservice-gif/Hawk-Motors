export type VehicleCardData = {
  id: string;
  slug: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  status: string;
  featured: boolean;
  fuelType: string | null;
  transmission: string | null;
  engineSize: string | null;
  bodyStyle: string | null;
  image: string | null;
};

export type NamedOption = { id: string; name: string };

export type FilterOptions = {
  makes: { id: string; name: string; models: NamedOption[] }[];
  fuelTypes: NamedOption[];
  bodyStyles: NamedOption[];
  colours: NamedOption[];
};
