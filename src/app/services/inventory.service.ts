import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable,Subject,BehaviorSubject } from 'rxjs';

import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  inventoryItems = new Subject();

  constructor(private http: HttpClient) { }

  getInventory(){ 
  	var config = {
  		params: {type:''}
  	}
	  return this.http.get('http://localhost:3000/api/v1/aws/inventory', config).subscribe((response)=>{
	  	this.inventoryItems.next(response);
	  })
  }

  deleteInventory(param: any){ 
  	console.log(param);
    var config = {
        params: param
    }
    return this.http.delete('http://localhost:3000/api/v1/aws/inventory',config).subscribe((response)=>{
	  	this.inventoryItems.next(response);
	  })
  }

  editInventory(param: any){ 
      return this.http.put('http://localhost:3000/api/v1/aws/inventory',param).subscribe((response)=>{
	  	this.inventoryItems.next(response);
	  })
  }

  newInventory(param: any){ 
      return this.http.post('http://localhost:3000/api/v1/aws/inventory',param).subscribe((response)=>{
	  	this.inventoryItems.next(response);
	  })
  }

}
