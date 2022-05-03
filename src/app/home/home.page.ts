import { Component } from '@angular/core';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  quotesKeys = Object.keys;
  quotes = {
    days: "Daily", 
    weeks: "Weekly",
    months: "Monthly",
    years: "Yearly"
  }; 
  range:number = 5;
  value = this.quotes["days"];
  constructor() {
    console.log(this.quotesKeys(this.quotes)[3]);
  }
  getKey(value){
    return this.quotesKeys(this.quotes).find(k=>this.quotes[k]==this.value);
  }
}
