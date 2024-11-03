import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { WeatherService } from './weather.service';
import { WeatherData } from './weather/weather.types';
import { environment } from '../environmets/environment';

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

  describe('getRandomCities', () => {
    it('should return an array of 3 random cities', (done) => {
      service.getRandomCities().subscribe((cities) => {
        expect(cities.length).toBe(3);
        expect(service['cities']).toEqual(jasmine.arrayContaining(cities));
        done();
      });
    });
  });

  describe('getWeatherForCities', () => {
    it('should fetch weather data for each provided city', (done) => {
      const mockCities = ['Lodz', 'Berlin', 'London'];
      const mockWeatherData: WeatherData[] = [
        {
          name: 'Lodz',
          main: { temp: 15 },
          weather: [
            {
              main: 'Clear',
              description: '',
              icon: '',
            },
          ],
        },
        {
          name: 'Berlin',
          main: { temp: 20 },
          weather: [
            {
              main: 'Clouds',
              description: '',
              icon: '',
            },
          ],
        },
        {
          name: 'London',
          main: { temp: 18 },
          weather: [
            {
              main: 'Rain',
              description: '',
              icon: '',
            },
          ],
        },
      ];

      service.getWeatherForCities(mockCities).subscribe((data) => {
        expect(data).toEqual(mockWeatherData);
        done();
      });

      mockCities.forEach((city, index) => {
        const req = httpMock.expectOne(
          `${environment.weatherApiUrl}?q=${city}&appid=${environment.weatherApiKey}&units=metric`
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockWeatherData[index]);
      });
    });
  });

  describe('shuffleArray', () => {
    it('should return a shuffled array', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffledArray = service['shuffleArray'](array);
      expect(shuffledArray).not.toEqual(array);
      expect(shuffledArray.sort()).toEqual(array.sort());
    });
  });
});
