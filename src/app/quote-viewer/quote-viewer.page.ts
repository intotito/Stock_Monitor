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
  cardinality: number = 100;

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
    for(let i = 1; i < this.cardinality - 1; i++){
      if(Number(this.data[this.dataKeys[i]]['4. close']) > maxValue){//Number(this.data[this.dataKeys[i - 1]]['4. close'])){
        max = i;
        maxValue = Number(this.data[this.dataKeys[i]]['4. close']); 
      }
    }
    return [max, maxValue];
  }

  getMinimumValue() : number[] {
    let min: number = 0;
    let minValue: number = Number(this.data[this.dataKeys[0]]['4. close']);
    for(let i = 1; i < this.cardinality - 1; i++){
      if(Number(this.data[this.dataKeys[i]]['4. close']) < minValue){
        min = i;
        minValue = Number(this.data[this.dataKeys[i]]['4. close']);
      }
    }
    return [min, minValue];
  }

  paintCanvas(){
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    console.log(this.platform.height() + " -- " + this.platform.width());
    canvas.height = (this.platform.width());
    canvas.width = (this.platform.width());
    let height: number = canvas.height
    let width: number = canvas.width;
    let padding: number = 20;
    var ctx = canvas.getContext("2d");
    let H: number = height - 2 * padding;
    let W: number = width - 2 * padding;
    ctx.lineWidth = 0.1;
    ctx.lineCap = 'square';
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    //ctx.moveTo(padding, height - padding);
    ctx.moveTo(0,0);
    let max: number = this.getMaximumValue()[1];
    console.log("This is the maximum " + max);
    
    ctx.lineWidth = 2.0;

    let tickx: number = W / this.cardinality;
    let ticky: number = H / max;
    ctx.moveTo(padding + (1) * tickx, padding + (H - ticky * this.data[this.dataKeys[0]]['4. close']));
    for(let i = 1; i < this.cardinality; i++){
      let datParts = this.dataKeys[i].split('-');
      let date = new Date(Number(datParts[0]), Number(datParts[1]) - 1, Number(datParts[2]));
      let value = this.data[this.dataKeys[i]]['4. close'];
      console.log(value);
    //  ctx.moveTo(padding + (i) * tickx, padding + (H - ticky * value));
      ctx.lineTo(padding + (i + 1) * tickx, padding + (H - ticky * value));
      ctx.stroke();
   //   break;
    }
  }

}
