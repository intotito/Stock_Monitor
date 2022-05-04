import { Component } from '@angular/core';
import {Router} from '@angular/router';

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
  
  funxtions = {
    Daily: "TIME_SERIES_DAILY",
    Weekly: "TIME_SERIES_WEEKLY",
    Monthly: "TIME_SERIES_MONTHLY"
  };
  symbol: string = "";
  range:number = 5;
  value = this.quotes["days"];
  constructor(private router : Router) {
    console.log(this.quotesKeys(this.quotes)[3]);
  }
  getKey(value){
    return this.quotesKeys(this.quotes).find(k=>this.quotes[k]==this.value);
  }

  showQuotes(){
    let a = {interval: this.funxtions[this.value], symbol: this.symbol, duration: this.range};
    this.router.navigate(['/quote-viewer', a]);
  }
}
