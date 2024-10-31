import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../weather.service';
import { Observable, Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-weather',
  standalone: true,
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css'],
  imports: [HttpClientModule, CommonModule],
})
export class WeatherComponent implements OnInit, OnDestroy {
  private weatherService = inject(WeatherService);
  private destroy$ = new Subject<void>();
  weatherData$: Observable<any[]> = new Observable<any[]>();
  cities: string[] = [];

  ngOnInit(): void {
    this.updateCities();
    timer(0, 60000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateCities());

    this.weatherData$ = timer(0, 10000).pipe(
      switchMap(() => this.weatherService.getWeatherForCities(this.cities)),
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateCities() {
    this.weatherService.getRandomCities().subscribe((cities) => {
      this.cities = cities;
    });
  }

  openCityPage(city: string) {
    const cityMap: { [key: string]: string } = {
      Łódź: '3337493',
      Warsaw: '756135',
      Berlin: '2950159',
      'New York': '5128581',
      London: '2643743',
    };
    window.open(`https://openweathermap.org/city/${cityMap[city]}`, '_blank');
  }

  roundTemperature(temp: number): number {
    return temp % 1 >= 0.5 ? Math.ceil(temp) : Math.floor(temp);
  }
}
