import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { WeatherComponent } from './weather.component';
import { WeatherService } from '../weather.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WeatherData } from './weather.types';
import { CITY_MAP, CITIES_REFRESH_INTERVAL } from './weather.constants';

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let weatherService: WeatherService;

  const mockWeatherData: WeatherData[] = [
    {
      name: 'London',
      main: { temp: 20 },
      weather: [
        {
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
    },
    {
      name: 'Warsaw',
      main: { temp: 22 },
      weather: [
        {
          main: 'Clouds',
          description: 'scattered clouds',
          icon: '03d',
        },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: WeatherService,
          useValue: {
            getRandomCities: () => of(['London', 'Warsaw']),
            getWeatherForCities: () => of(mockWeatherData),
          },
        },
      ],
    }).compileComponents();

    weatherService = TestBed.inject(WeatherService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize cities refresh', fakeAsync(() => {
    const spyGetRandomCities = spyOn(
      weatherService,
      'getRandomCities'
    ).and.returnValue(of(['London', 'Warsaw']));
    component.ngOnInit();
    tick(CITIES_REFRESH_INTERVAL);
    expect(spyGetRandomCities).toHaveBeenCalled();
    discardPeriodicTasks();
  }));

  it('should track by city name', () => {
    expect(component.trackByCity(0, mockWeatherData[0])).toBe('London');
  });

  it('should round temperature correctly', () => {
    expect(component.roundTemperature(20.6)).toBe(21);
    expect(component.roundTemperature(20.4)).toBe(20);
  });

  it('should get weather class', () => {
    expect(component.getWeatherClass(mockWeatherData[0].weather[0].main)).toBe(
      'clear'
    );
  });

  it('should open city page for known city', () => {
    spyOn(window, 'open');
    component.openCityPage('London');
    expect(window.open).toHaveBeenCalledWith(
      `https://openweathermap.org/city/${CITY_MAP['London']}`,
      '_blank'
    );
  });

  it('should not open city page for unknown city', () => {
    spyOn(window, 'open');
    component.openCityPage('Unknown');
    expect(window.open).not.toHaveBeenCalled();
  });

  it('should clean up on destroy', () => {
    const completeSpy = spyOn(
      component['destroy$'],
      'complete'
    ).and.callThrough();

    component.ngOnInit();
    component.ngOnDestroy();

    expect(completeSpy).toHaveBeenCalled();
  });
});
