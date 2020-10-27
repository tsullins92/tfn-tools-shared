import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable,Subject,BehaviorSubject } from 'rxjs';
//RxJS operator for mapping the observable
import { map } from 'rxjs/operators';

import { Instrument } from '../models/instrument';


@Injectable({
  providedIn: 'root'
})
export class InstrumentService {
    constructor(private http: HttpClient){}

    getInstruments(param: any): Observable<any> { 
        var config = {
            params: param
        }
        return this.http.get('http://localhost:3000/api/v1/aws/instruments', config).pipe(
            map(res => {
              return res;
            }));
    }

    updateInstrument(param: any): Observable<any> { 
        return this.http.put('http://localhost:3000/api/v1/aws/instruments',param).pipe(
            map(res => {
              return res;
            }));
    }

    deleteInstrument(param: any): Observable<any> { 
        var config = {
            params: param
        }
        return this.http.delete('http://localhost:3000/api/v1/aws/instruments/',config).pipe(
            map(res => {
              return res;
            }));
    }

    createInstrument(param: any): Observable<any> { 
        return this.http.post('http://localhost:3000/api/v1/aws/instruments',param).pipe(
            map(res => {
              return res;
            }));
    }

}
