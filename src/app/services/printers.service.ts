import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable,Subject,BehaviorSubject } from 'rxjs';
//RxJS operator for mapping the observable
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrintersService {

	constructor(private http: HttpClient) { }

	printLabels(param: any): Observable<any> {
		console.log(param);
        return this.http.post('http://localhost:3000/api/v1/misc/printLabels',param).pipe(
            map(res => {
              return res;
            }));
	}
}
