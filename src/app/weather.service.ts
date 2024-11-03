import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { environment } from '../environments/environment';
import { WeatherData } from './weather/weather.types';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly apiUrl = environment.weatherApiUrl;
  private readonly apiKey = environment.weatherApiKey;
  private readonly cities = ['Lodz', 'Warsaw', 'Berlin', 'New York', 'London'];

  constructor(private readonly http: HttpClient) {}

  getRandomCities(): Observable<string[]> {
    return of(this.shuffleArray(this.cities).slice(0, 3));
  }

  getWeatherForCities(cities: string[]): Observable<WeatherData[]> {
    return forkJoin(cities.map((city) => this.getWeather(city)));
  }

  private getWeather(city: string): Observable<WeatherData> {
    const params = {
      q: city,
      appid: this.apiKey,
      units: 'metric',
    };

    return this.http.get<WeatherData>(this.apiUrl, { params });
  }

  private shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => 0.5 - Math.random());
  }
}
