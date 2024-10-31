import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { WeatherComponent } from './app/weather/weather.component';

bootstrapApplication(WeatherComponent, {
  providers: [provideHttpClient()],
}).catch((err) => console.error(err));
