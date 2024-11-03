import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../weather.service';
import {
  Observable,
  Subject,
  timer,
  BehaviorSubject,
  combineLatest,
} from 'rxjs';
import {
  switchMap,
  takeUntil,
  shareReplay,
  map,
  mergeMap,
} from 'rxjs/operators';
import { WeatherData } from './weather.types';
import {
  CITY_MAP,
  WEATHER_REFRESH_INTERVAL,
  CITIES_REFRESH_INTERVAL,
} from './weather.constants';

@Component({
  selector: 'app-weather',
  standalone: true,
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  imports: [HttpClientModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeatherComponent implements OnInit, OnDestroy {
  [x: string]: any;
  private readonly weatherService = inject(WeatherService);
  private readonly destroy$ = new Subject<void>();
  private readonly citiesSubject = new BehaviorSubject<string[]>([]);

  readonly cities$ = this.citiesSubject.asObservable();
  readonly weatherData$: Observable<WeatherData[]> = combineLatest([
    this.cities$,
    timer(0, WEATHER_REFRESH_INTERVAL),
  ]).pipe(
    map(([cities]) => cities),
    mergeMap((cities) => this.weatherService.getWeatherForCities(cities)),
    shareReplay(1),
    takeUntil(this.destroy$)
  );

  ngOnInit(): void {
    this.initializeCitiesRefresh();
  }

  trackByCity(_index: number, weatherData: WeatherData): string {
    return weatherData.name;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCityPage(city: string): void {
    const cityId = CITY_MAP[city];
    if (cityId) {
      window.open(`https://openweathermap.org/city/${cityId}`, '_blank');
    }
  }

  roundTemperature(temp: number): number {
    return Math.round(temp);
  }

  getWeatherClass(weatherMain: string): string {
    return weatherMain.toLowerCase();
  }

  private initializeCitiesRefresh(): void {
    timer(0, CITIES_REFRESH_INTERVAL)
      .pipe(
        switchMap(() => this.weatherService.getRandomCities()),
        takeUntil(this.destroy$)
      )
      .subscribe((cities) => this.citiesSubject.next(cities));
  }
}
