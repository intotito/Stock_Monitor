import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuoteViewerPageRoutingModule } from './quote-viewer-routing.module';

import { QuoteViewerPage } from './quote-viewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuoteViewerPageRoutingModule
  ],
  declarations: [QuoteViewerPage]
})
export class QuoteViewerPageModule {}
