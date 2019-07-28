import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() action = 'new';
  @Output() onAdd: EventEmitter<number> = new EventEmitter();
  @Output() onDelete: EventEmitter<number> = new EventEmitter();
  iconCls: string;

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges() {
    switch(this.action){
      case 'favorite' :{
        this.iconCls = this.data  ? 'icofont-ui-rate-remove' : '';
      }break;

      default: {
        this.iconCls = this.data && this.data.favorite ? 'icofont-ui-rating' : 'icofont-ui-rate-add';
      }
    }
    
  }
  formatTemp(type: string, temp: number){
    if(!type) return;
    return type.toLowerCase() === 'c' ? 
           Math.round(temp - 273.15)  : 
           Math.round((temp - 273.15) * 9/5 + 32);
  }
  formatSpeed(speed){
    return Math.round(speed * 3.6);
  }
  addCity(id){
    if(!id) return;

    if(this.iconCls == 'icofont-ui-rate-add'){
      this.onAdd.emit(id);
      this.iconCls = 'icofont-ui-rating';

    }else if(this.iconCls == 'icofont-ui-rate-remove'){
      this.onDelete.emit(id);
      this.iconCls = 'icofont-ui-rate-blank';
    }
  }
  
}
