export interface WeatherData {
  main: {
    temp: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  name: string;
}

export interface CityMapping {
  [key: string]: string;
}
