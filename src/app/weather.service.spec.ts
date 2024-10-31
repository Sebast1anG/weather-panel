import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService],
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return random cities', (done) => {
    service.getRandomCities().subscribe((cities) => {
      expect(cities.length).toBe(3);
      expect(service['cities']).toContain(cities[0]);
      done();
    });
  });

  it('should fetch weather data', (done) => {
    const dummyWeather = {
      main: { temp: 20 },
      weather: [{ description: 'clear sky', icon: '01d' }],
    };
    const city = 'London';

    service.getWeather(city).subscribe((weather) => {
      expect(weather.main.temp).toBe(20);
      expect(weather.weather[0].description).toBe('clear sky');
      done();
    });

    const req = httpMock.expectOne(
      `${service['apiUrl']}?q=${city}&appid=${service['apiKey']}&units=metric`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyWeather);
  });

  it('should fetch weather data for cities', (done) => {
    const dummyWeather = {
      main: { temp: 20 },
      weather: [{ description: 'clear sky', icon: '01d' }],
    };
    const cities = ['London', 'Berlin'];

    service.getWeatherForCities(cities).subscribe((weatherArray) => {
      expect(weatherArray.length).toBe(2);
      expect(weatherArray[0].main.temp).toBe(20);
      expect(weatherArray[1].weather[0].description).toBe('clear sky');
      done();
    });

    cities.forEach((city) => {
      const req = httpMock.expectOne(
        `${service['apiUrl']}?q=${city}&appid=${service['apiKey']}&units=metric`
      );
      expect(req.request.method).toBe('GET');
      req.flush(dummyWeather);
    });
  });
});
