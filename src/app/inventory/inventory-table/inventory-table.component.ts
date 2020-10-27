import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-inventory-table',
  templateUrl: './inventory-table.component.html',
  styleUrls: ['./inventory-table.component.scss']
})
export class InventoryTableComponent implements OnInit {

	tableType: string = 'individual';

	@Input() inventoryItems: any[];

  constructor() { }

  ngOnInit() {  }

  summarizeInventoryItems(){
  	let items = [{item_name: "", inv_count: 0}];
  	let uniqueItems = this.inventoryItems.filter((item, index, items)=>{return items.findIndex((item1)=>{return item.item_name == item1.item_name}) == index});
  	items = uniqueItems.map((item)=>{
  		let count = 0;
  		this.inventoryItems.forEach((invItem)=>{if(invItem.item_name == item.item_name){++count}});
  		return {item_name: item.item_name, inv_count: count};
  	});
  	return items;
  }

}
