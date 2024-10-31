import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WeatherComponent } from './weather.component';
import { WeatherService } from '../weather.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let weatherService: WeatherService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CommonModule],
      declarations: [WeatherComponent],
      providers: [WeatherService],
    }).compileComponents();

    weatherService = TestBed.inject(WeatherService);
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize cities and weather data', () => {
    const cities = ['London', 'Berlin', 'New York'];
    spyOn(weatherService, 'getRandomCities').and.returnValue(of(cities));
    const dummyWeather = [
      {
        main: { temp: 20 },
        weather: [{ description: 'clear sky', icon: '01d' }],
      },
      { main: { temp: 25 }, weather: [{ description: 'cloudy', icon: '02d' }] },
      { main: { temp: 30 }, weather: [{ description: 'sunny', icon: '01d' }] },
    ];
    spyOn(weatherService, 'getWeatherForCities').and.returnValue(
      of(dummyWeather)
    );

    component.ngOnInit();
    fixture.detectChanges();

    component.weatherData$.subscribe((data) => {
      expect(data).toEqual(dummyWeather);
    });
  });

  it('should open city page', () => {
    spyOn(window, 'open');
    component.openCityPage('London');
    expect(window.open).toHaveBeenCalledWith(
      'https://openweathermap.org/city/2643743',
      '_blank'
    );
  });

  it('should round temperature correctly', () => {
    expect(component.roundTemperature(12.53)).toBe(13);
    expect(component.roundTemperature(12.49)).toBe(12);
  });
});
