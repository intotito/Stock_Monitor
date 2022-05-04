import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class QuoteGetterService {
  data : any[];
  constructor(private httpClient: HttpClient) { }

  getQuotes(url: string): Observable<any>{
    return this.httpClient.get(url);
  }
}
