import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuoteViewerPage } from './quote-viewer.page';

const routes: Routes = [
  {
    path: '',
    component: QuoteViewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuoteViewerPageRoutingModule {}
