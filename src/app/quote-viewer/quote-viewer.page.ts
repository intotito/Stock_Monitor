import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
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
  duration: number;
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
    this.duration = Number(this.route.snapshot.paramMap.get('duration'));
    this.index = Number(this.route.snapshot.paramMap.get('index'));
    this.cardinality = this.duration;
 //   this.cardinality = Math.min(5, this.cardinality);
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
   // console.log(this.data);
   // console.log(this.dataKeys);
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
    let padding: number = 40;
    var ctx = canvas.getContext("2d");
    let H: number = height - 2 * padding;
    let W: number = width - 2 * padding;

    

// X and Y axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.lineWidth = 0.5;
    ctx.lineCap = 'butt';
    ctx.strokeStyle = '#0000FF';
    ctx.stroke();
    ctx.closePath();
    
 
    let max: number = this.getMaximumValue()[1];
    let min: number = this.getMinimumValue()[1];
    let range = min - (max - min) / 8;

    console.log('Maximum = ' + max + '\nMiniumu' + min);

    let tickx: number = W / this.cardinality;
    let ticky: number = H / max;

    ticky = H / (max - range);

// X and Y grids
    let gridX = this.cardinality / 2;
    let gridY = this.cardinality / 2;
    gridX = gridX > 20 ? 20 : gridX;
    gridY = gridY > 20 ? 20 : gridY;

    ctx.beginPath();
    // Vertical grid
    for(let i = 0; i < gridY; i++){
      ctx.moveTo(padding + (W / gridY) * (i + 1), padding + H);
      ctx.lineTo(padding + (W / gridY) * (i + 1), padding); 
    }
    // Horizontal grid
    for(let i = 0; i < gridX; i++){
      ctx.moveTo(padding, padding + H - (H / gridX) * (i + 1));
      ctx.lineTo(padding + W, padding + H - (H / gridX) * (i + 1)); 
    }
    ctx.strokeStyle = '#00FF00';
    ctx.lineWidth = 0.1;
    ctx.stroke();
    ctx.closePath();

// X and Y axis ticks
    let tickSize = 10;
    ctx.beginPath();
    // Vertical Tick
    for(let i = 0; i < gridY / 2; i++){
      ctx.moveTo(padding + (W / (gridY / 2)) * (i + 1), padding + H + tickSize / 2);
      ctx.lineTo(padding + (W / (gridY / 2)) * (i + 1), padding + H - tickSize / 2);
    }
    // Horizontal Tick
    for(let i = 0; i < gridX / 2; i++){
      ctx.moveTo(padding - tickSize / 2, padding + H - (H / (gridX / 2)) * (i + 1));
      ctx.lineTo(padding + tickSize / 2, padding + H - (H / (gridX / 2)) * (i + 1));
    }
    ctx.strokeStyle = '#0000FF'
    ctx.lineWidth = 0.5;
    ctx.stroke();
    ctx.closePath();

  // Y axis labels
    ctx.fillStyle = 'white';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for(let i = 0; i < gridY / 2; i++){
      let x: number = padding - tickSize / 2;
      let y: number = padding + H - (H / (gridX / 2)) * (i + 1);
      let value: number = range + ((max - range) / H) * (H / (gridX / 2)) * (i + 1);
//      ctx.fillText('' + value.toPrecision(2), 0, padding + H - (H / (gridX / 2)) * (i + 1));
      ctx.fillText('' + value.toFixed(2), x, y);
    }

// X axis labels
    ctx.fillStyle = 'white';
    
    let tempMonth: number = Number(this.dataKeys[0].split('-')[1]) - 1;
    for(let i = (gridX / 2); i > 0; i--){
      let x = padding + (W / (gridX / 2) * (gridX / 2 - i));
      let dateParts = this.dataKeys[Math.floor(this.cardinality / (gridX / 2)) * (i) - 1].split('-');
      let date = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
      let value = this.data[this.dataKeys[Math.floor(this.cardinality / (gridX / 2)) * (i) - 1]]['4. close'];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      console.log("Date: " + date.getDate() + " index: " + this.index + " i: " + i);
      if(this.index < 2){ // Daily and Weekly Series
        ctx.fillText("" + date.getDate(), x, padding + H + tickSize / 2);
        if(i == 0 || date.getMonth() != tempMonth){
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';
          ctx.fillText(this.getMonth(date.getMonth()), x, padding + H + padding - tickSize / 2);
        }
      } else {// Monthly Series
        ctx.fillText((date.getMonth() + 1).toString(), x, padding + H + tickSize / 2);
        if(i == 0 || date.getMonth() != tempMonth){
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';
       //   ctx.fillText(this.getMonth(date.getMonth()), x, padding + H + padding - tickSize / 2);
        }
      } 
      tempMonth = date.getMonth();
    }


// Graph
    ctx.beginPath();
    ctx.moveTo(padding + (0) * tickx, padding + (H - ticky * (this.data[this.dataKeys[this.cardinality - 1]]['4. close'] - range)));
//    for(let i = 1; i < this.cardinality; i++){
    for(let i = (this.cardinality - 1); i > 0; i--){
      let datParts = this.dataKeys[i].split('-');
      let date = new Date(Number(datParts[0]), Number(datParts[1]) - 1, Number(datParts[2]));
      let value = this.data[this.dataKeys[i]]['4. close'];
      console.log(value);
      //ctx.lineTo(padding + (i + 1) * tickx, padding + (H - ticky * (value - range)));
      ctx.lineTo(padding + (this.cardinality - i) * tickx, padding + (H - ticky * (value - range)));
    }
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
  }

  getMonth(month: number): string{
    let months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month];
  }

}
