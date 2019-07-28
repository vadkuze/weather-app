import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private citiesPath = environment.citiesPath;
  private weather = `${environment.host}${environment.weather}?APPID=${environment.apiKey}`;
  private weatherGroup = `${environment.host}${environment.weatherGroup}?APPID=${environment.apiKey}`;

  constructor(private http: HttpClient) { }

  getCities(){
    return this.http.get(this.citiesPath);
  }
  getWeatherCityById(id){
    return this.http.get(`${this.weather}&id=${id}`);
  }
  getWeatherCityByCoords(lat, lon){
    return this.http.get(`${this.weather}&lat=${lat}&lon=${lon}`);
  }
  getWeatherCityByGroup(arrId: number[]){
    return this.http.get(`${this.weatherGroup}&id=${arrId.join(',')}`);
  }
}
