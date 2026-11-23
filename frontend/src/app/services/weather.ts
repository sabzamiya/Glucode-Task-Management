
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Weather {
  city: string;
  country: string;
  temperature: number;
  condition: string;
  icon: string;
  sunrise: string;
  sunset: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/weather';

  getWeather(city = 'Johannesburg'): Observable<Weather> {
    const params = new HttpParams().set('city', city);
    return this.http.get<Weather>(this.apiUrl, { params });
  }
}
