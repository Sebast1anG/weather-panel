import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';

interface WeatherData {
  main: { temp: number };
  weather: { description: string; icon: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private apiKey = '92f061df62cbaa7313008ed395615b1f';
  private cities = ['Lodz', 'Warsaw', 'Berlin', 'New York', 'London'];

  constructor(private http: HttpClient) {}

  getRandomCities(): Observable<string[]> {
    const randomCities = this.cities
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return of(randomCities);
  }

  getWeather(city: string): Observable<WeatherData> {
    return this.http.get<WeatherData>(
      `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`
    );
  }

  getWeatherForCities(cities: string[]): Observable<WeatherData[]> {
    return forkJoin(cities.map((city) => this.getWeather(city)));
  }
}
