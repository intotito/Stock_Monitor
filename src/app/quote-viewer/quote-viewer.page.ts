import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import { QuoteGetterService } from '../Service/quote-getter.service';

@Component({
  selector: 'app-quote-viewer',
  templateUrl: './quote-viewer.page.html',
  styleUrls: ['./quote-viewer.page.scss'],
})
export class QuoteViewerPage implements OnInit {
  interval: string;
  symbol: string;
  duration:  string;
  index: number;
  data: any;

  keys: string[] = ["Time Series (Daily)", "Weekly Time Series", "Monthly Time Series"];

  constructor(private route: ActivatedRoute, private quoteGetter: QuoteGetterService, private platform: Platform) { 
    this.interval = this.route.snapshot.paramMap.get('interval');
    this.symbol = this.route.snapshot.paramMap.get('symbol');
    this.duration = this.route.snapshot.paramMap.get('duration');
    this.index = Number(this.route.snapshot.paramMap.get('index'));
    console.log("Check  this " + this.interval + " -- " + this.symbol + " --" + this.duration);
  }

  ngOnInit() {
  /*  let url = 'https://www.alphavantage.co/query?function=' + this.interval +
       '&symbol=' + this.symbol + '&apikey=' + '1ONYPOW67MNS430D';
    console.log(url);
    this.quoteGetter.getQuotes(url).subscribe((data)=>{
      this.data = data;
      console.log(data[this.keys[this.index]]);
     
    })
  */  this.paintCanvas();
  }

  paintCanvas(){
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    console.log(this.platform.height() + " -- " + this.platform.width());
    canvas.height = (this.platform.width());
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0, 0, 150, 75);
  }

}
