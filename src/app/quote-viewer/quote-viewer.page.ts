import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
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
  dataKeys: string[];

  keys: string[] = [
    "Time Series (Daily)", 
    "Weekly Time Series", 
    "Monthly Time Series"
  ];

  constructor(private route: ActivatedRoute, private quoteGetter: QuoteGetterService, private platform: Platform) { 
    this.interval = this.route.snapshot.paramMap.get('interval');
    this.symbol = this.route.snapshot.paramMap.get('symbol');
    this.duration = this.route.snapshot.paramMap.get('duration');
    this.index = Number(this.route.snapshot.paramMap.get('index'));
    console.log("Check  this " + this.interval + " -- " + this.symbol + " --" + this.duration);
  }

  ngOnInit() {
    let url = 'https://www.alphavantage.co/query?function=' + this.interval +
       '&symbol=' + this.symbol + '&apikey=' + '1ONYPOW67MNS430D';
    console.log(url);
    this.quoteGetter.getQuotes(url).subscribe((data)=>{
      this.data = data[this.keys[this.index]];
      this.dataKeys = Object.keys(this.data);
 //     console.log("check it");
 //     console.log(this.dataKeys);
        this.paintCanvas();
    });
    
  }

  getMaximumValue() : number[]{
    let max: number = 0;
    console.log(this.data);
    console.log(this.dataKeys);
    let maxValue: number = Number(this.data[this.dataKeys[0]]['4. close']);
    for(let i = 1; i < 20 - 1; i++){
      if(Number(this.data[this.dataKeys[i]]['4. close']) > Number(this.data[this.dataKeys[i + 1]]['4. close'])){
        max = i;
        maxValue = Number(this.data[this.dataKeys[i]]['4. close']); 
      }
    }
    return [max, maxValue];
  }

  paintCanvas(){
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    console.log(this.platform.height() + " -- " + this.platform.width());
    canvas.height = (this.platform.width());
    canvas.width = (this.platform.width());
    let height: number = canvas.height
    let width: number = canvas.width;
    let padding: number = 10;
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = 1;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    ctx.moveTo(padding, height - padding);
    let max: number = this.getMaximumValue()[1];
    let tickx = (width - 2 * padding) / 20;
      let ticky = (height - 2 * padding) / max;
    
    for(let i = 1; i < 20; i++){
      let datParts = this.dataKeys[i].split('-');
      let date = new Date(Number(datParts[0]), Number(datParts[1]) - 1, Number(datParts[2]));
      let value = Number(this.data[this.dataKeys[i]['4. close']]);
      ctx.moveTo(padding + (i) * tickx, padding + (height - height * ticky));
      ctx.lineTo(padding + (i + 1) * tickx, padding + (height - height * ticky));
      ctx.stroke();
    }
  }

}
