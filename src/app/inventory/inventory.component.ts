import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

	inventoryItems: any[] = [{id:0, name:"", quantity:0, rfid_value:"", date_modified:""}];

  constructor(public inventoryService: InventoryService) { }

  ngOnInit() {
    this.inventoryService.inventoryItems.subscribe((message:any)=>{this.inventoryItems = message});
  	this.inventoryService.getInventory();
  }

}
