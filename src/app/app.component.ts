import { Component } from '@angular/core';
import { WeatherService } from './common/services/weather.service';
import {map} from 'rxjs/operators'
import { City } from './common/models/city.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedCity = '';
  states = [];
  currentWeatherData;
  favoriteList = [];
  favoriteData = [];
  constructor( private weatherService: WeatherService){}

  ngOnInit() {
    this.getLocation()
    let favoriteFromLS = JSON.parse(localStorage.getItem('favorite'));
    this.favoriteList =  favoriteFromLS ? favoriteFromLS : [];
    if(this.favoriteList.length){
      this.refresh()
    }
    this.getCities();
    
  }
  getCities(){
    this.weatherService
        .getCities()
        .pipe(
          map((arrCities: Array<City>) => {
            return arrCities.map( c =>{
                      c['title'] = `${c.name}, ${c.country}`;
                      return c;
                    });
          })
        )
        .subscribe(
          (data: Array<City>) => {
            this.states = data;
          }
        )
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;

            this.weatherService
              .getWeatherCityByCoords(lat, lng)
              .subscribe(
                (data: any) =>{
                  let favorite = this.favoriteList.find( id => id == data.id);              
                  data.favorite = !!favorite;
                  this.currentWeatherData = data
                }
              )
        }
      },
        (error: PositionError) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  typeaheadOnSelect(event){
    
    if(event.item){
      this.weatherService
          .getWeatherCityById(event.item.id)
          .subscribe(
            (data: any) =>{
              let favorite = this.favoriteList.find( id => id == data.id);              
              data.favorite = !!favorite;
              this.currentWeatherData = data
            }
          )
    }
    
  }
  addToFavorite(id){
    this.favoriteList.push(id);
    this.refresh();
  }
  removeToFavorite(id){
    let index = this.favoriteList.findIndex(elem => elem == id);
    index == 0 ? this.favoriteList.shift() : this.favoriteList.splice(index, 1);
    if(this.currentWeatherData && this.currentWeatherData.id == id){
      this.currentWeatherData = false;
      
    }
    this.refresh();
  }
  refresh(){
      localStorage.setItem('favorite', JSON.stringify(this.favoriteList));
      if(!this.favoriteList.length){
        this.favoriteData = [];
        return;
      }
      this.weatherService
        .getWeatherCityByGroup(this.favoriteList)
        .subscribe(
          (data: any) =>{
            this.favoriteData = data.list;
          }
        )
  }
  format(cls, i){
    if(cls == 'show' && i > 0){
      return `translateX(${-80 * (i)}%)`;

    }
  }
}
