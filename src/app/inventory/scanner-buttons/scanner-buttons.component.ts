import { Component, OnInit, OnChanges, SimpleChange, Input } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-scanner-buttons',
  templateUrl: './scanner-buttons.component.html',
  styleUrls: ['./scanner-buttons.component.scss']
})
export class ScannerButtonsComponent implements OnInit {

	@Input() inventoryItems: any[];

	scanInputString: string = "";

  constructor(public inventoryService: InventoryService) { }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
  	console.log(this.inventoryItems);
  }

  ngOnInit() {
  }

  parseScanInput(){
  	let items = [{item_name: "", scanned_count: 0, inv_count: 0}];
  	if(this.scanInputString.length == 0){
  		return items;
  	}
  	let uniqueItems = this.inventoryItems.filter((item, index, items)=>{return items.findIndex((item1)=>{return item.item_name == item1.item_name}) == index});
  	items = uniqueItems.map((item)=>{
  		let count = 0;
  		this.inventoryItems.forEach((invItem)=>{if(invItem.item_name == item.item_name){++count}});
  		return {item_name: item.item_name, scanned_count: 0, inv_count: count};
  	});
  	let uniqueInput = this.uniqueInput();
  	uniqueInput.forEach((item)=>{
  		let asciiInput = hex2a(item); //convert reading hex string to ascii string
  		let itemID = /(?<=Z+)\d+(?=-)/g.exec(asciiInput);
  		let invItemIndex = this.inventoryItems.findIndex((invItem)=>{return invItem.item_id.toString() == itemID[0];});	//check if item_numbers are equal to eachother
  		if(invItemIndex != -1){
  			let itemName = this.inventoryItems[invItemIndex].item_name;
  			let itemIndex = items.findIndex((item1)=>{return item1.item_name == itemName});
  			if(itemIndex != -1){++items[itemIndex].scanned_count}  			
  		}
  	});
  	return items;
  }

  addItems(){
  	let addItems = {items: []};
  	if(this.scanInputString.length == 0){
  		return;
  	}
  	let uniqueInput = this.uniqueInput();
  	//get items that need to be added
  	uniqueInput.forEach((item)=>{
  		let asciiInput = hex2a(item); //convert reading hex string to ascii string
  		let itemID = /(?<=Z+)\d+(?=-)/g.exec(asciiInput);
  		let itemNumber = /(?<=Z+\d+-)\d+/g.exec(asciiInput);
  		let invItemIndex = this.inventoryItems.findIndex((invItem)=>{return invItem.item_id.toString() == itemID[0];});	//check if item_numbers are equal to eachother
  		if(invItemIndex != -1){
  			let itemName = this.inventoryItems[invItemIndex].item_name;
  			let rfidValue = item;
  			let itemIndex = this.inventoryItems.findIndex((item1)=>{return (item1.item_name == itemName)&&(item1.item_number == itemNumber)});
  			if(itemIndex == -1){
  				addItems.items.push({item_name: itemName, item_id: parseInt(itemID[0]), item_number: parseInt(itemNumber[0]), rfid_value: item});
  			}  			
  		}
  	});
  	if(addItems.items.length>0){
  		this.inventoryService.newInventory(addItems);
  	}  	
  }

  removeItems(){
    let removeItems = {ids: []};
    if(this.scanInputString.length == 0){
      return;
    }
    let uniqueInput = this.uniqueInput();
    //get items that need to be removed
    uniqueInput.forEach((item)=>{
      let asciiInput = hex2a(item); //convert reading hex string to ascii string
      let itemID = /(?<=Z+)\d+(?=-)/g.exec(asciiInput);
      let itemNumber = /(?<=Z+\d+-)\d+/g.exec(asciiInput);
      let invItemIndex = this.inventoryItems.findIndex((invItem)=>{return invItem.item_id.toString() == itemID[0];}); //check if item_numbers are equal to eachother
      if(invItemIndex != -1){
        let itemName = this.inventoryItems[invItemIndex].item_name;
        let rfidValue = item;
        let itemIndex = this.inventoryItems.findIndex((item1)=>{return (item1.item_name == itemName)&&(item1.item_number == itemNumber)});
        if(itemIndex != -1){
          removeItems.ids.push(parseInt(itemID[0]));
        }       
      }
    });
    if(removeItems.ids.length>0){
      this.inventoryService.deleteInventory(removeItems);
    }   
  }

  updateItems(){
  	let addItems = {items: []};
  	let deleteItems = {ids: []};
  	if(this.scanInputString.length == 0){
  		return;
  	}
  	let uniqueInput = this.uniqueInput();
  	//get items that need to be added
  	uniqueInput.forEach((item)=>{
  		let asciiInput = hex2a(item); //convert reading hex string to ascii string
  		let itemID = /(?<=Z+)\d+(?=-)/g.exec(asciiInput);
  		let itemNumber = /(?<=Z+\d+-)\d+/g.exec(asciiInput);
  		let invItemIndex = this.inventoryItems.findIndex((invItem)=>{return invItem.item_id.toString() == itemID[0];});	//check if item_numbers are equal to eachother
  		if(invItemIndex != -1){
  			let itemName = this.inventoryItems[invItemIndex].item_name;
  			let rfidValue = item;
  			let itemIndex = this.inventoryItems.findIndex((item1)=>{return (item1.item_name == itemName)&&(item1.item_number == itemNumber)});
  			if(itemIndex == -1){
  				addItems.items.push({item_name: itemName, item_id: parseInt(itemID[0]), item_number: parseInt(itemNumber[0]), rfid_value: item});
  			}  			
  		}
  	});
  	//get items that need to be deleted
  	this.inventoryItems.forEach((item)=>{
  		let uniqueInputIndex = uniqueInput.findIndex((input)=>{
	  		let asciiInput = hex2a(input); //convert reading hex string to ascii string
	  		let itemID = /(?<=Z+)\d+(?=-)/g.exec(asciiInput);
	  		let itemNumber = /(?<=Z+\d+-)\d+/g.exec(asciiInput);  
	  		return (item.item_id == itemID)&&(item.item_number == itemNumber);			
  		});
  		if(uniqueInputIndex == -1){deleteItems.ids.push(item.id);}
  	});
  	if(addItems.items.length>0){
  		this.inventoryService.newInventory(addItems);
  	}
  	if(deleteItems.ids.length>0){
  		this.inventoryService.deleteInventory(deleteItems);
  	}
  }

  uniqueInput(){
  	let input = this.scanInputString.split("\n");
  	let uniqueInput = input.filter((item, index)=>{return input.lastIndexOf(item)==index}); //filter out duplicates
  	uniqueInput = uniqueInput.filter((item, index)=>{ //filter out readings that don't meet inventory pattern
  		let asciiInput = hex2a(item); //convert reading hex string to ascii string
  		return /(?<=Z+)\d+(?=-)/g.test(asciiInput);
  	}); 
  	return uniqueInput;  	
  }

}

function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}