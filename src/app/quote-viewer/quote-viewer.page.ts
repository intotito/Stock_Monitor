import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private route: ActivatedRoute, private quoteGetter: QuoteGetterService) { 
    this.interval = this.route.snapshot.paramMap.get('interval');
    this.symbol = this.route.snapshot.paramMap.get('symbol');
    this.duration = this.route.snapshot.paramMap.get('duration');
    console.log("Check  this " + this.interval + " -- " + this.symbol + " --" + this.duration);
  }

  ngOnInit() {
  }

}
