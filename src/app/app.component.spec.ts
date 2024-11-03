import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WeatherComponent } from './weather/weather.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, WeatherComponent],
    }).compileComponents();
  });

  it('should create the app component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'weather-panel'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('weather-panel');
  });

  it('should render WeatherComponent', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const weatherComponent =
      fixture.debugElement.nativeElement.querySelector('app-weather');
    expect(weatherComponent).not.toBeNull();
  });
});
