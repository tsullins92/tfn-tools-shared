import { Component, OnInit, OnChanges, SimpleChange, Input } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Instrument } from '../../models/Instrument';
import { InstrumentService } from '../../services/instrument.service';
import { PrintersService } from '../../services/printers.service';

@Component({
  selector: 'app-inventory-buttons',
  templateUrl: './inventory-buttons.component.html',
  styleUrls: ['./inventory-buttons.component.scss']
})
export class InventoryButtonsComponent implements OnInit {

	@Input() inventoryItems: any[];
  inventoryItemNames: any[];
	newItemName: string = '';
	newItemQuantity: number = 0;

  addSelectedItemName: any;
	addItemQuantity: number = 0;

	editSelectedName: string = "";
	editItemName: string = "";

	deleteSelectedItems: any[] = [];

  printers: Instrument[];
  selectedPrinterName: any;


  constructor(public inventoryService: InventoryService, private instrumentService: InstrumentService, private printersService: PrintersService) { }

  //when inputs change, run appropriate functions
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if(this.inventoryItems.length>0){
      this.editSelectedName = this.inventoryItems[0].item_name;
      this.editItemName = this.inventoryItems[0].item_name;
      this.addSelectedItemName = this.inventoryItems[0].item_name;
      this.deleteSelectedItems = [this.inventoryItems[0]];
    }
  }

  ngOnInit() {
    var data = {
      type: "zebra_printer"
    }
    this.instrumentService.getInstruments(data).subscribe(res => {
      this.printers = res;
      this.selectedPrinterName = this.printers[0].name;
    });
  }

  //Delete Buttons
  deleteItems(){
		if(this.deleteSelectedItems.length == 0){
  		alert("Must select an item to delete");
  		return;
  	}
  	let data = {
  		"ids": this.deleteSelectedItems.map((item)=>{return item.id})
  	}
    console.log(data);
    this.inventoryService.deleteInventory(data);
  }

  //Edit Buttons
  editItem(){
		if(this.editItemName.length == 0){
  		alert("Must give item a name");
  		return;
  	}
  	let selectedItem = this.inventoryItems.find((item)=>{return item.name == this.editSelectedName;});
  	let data = {
      "item_name": this.editSelectedName,
  		"new_item_name": this.editItemName
  	}
  	this.inventoryService.editInventory(data);
  }

  getInventoryItems(){
    let result = this.inventoryItems.filter((item, index, items)=>{return items.findIndex((item1)=>{return item1.item_name==item.item_name})==index});
    return result;
  }

  changeEditSelectedItem(){
  	this.editItemName = this.inventoryItems.find((item)=>{return item.item_name == this.editSelectedName;}).item_name;
  }

  addItems(){
    if(this.addItemQuantity <= 0){
      alert("Quantity must be greater than 0");
      return;
    }
    let tempInvItem = this.inventoryItems.find((item)=>{return item.item_name == this.addSelectedItemName});
    let tempItemID = tempInvItem.item_id;
    let tempRFIDValue = tempInvItem.rfid_value;
    let newItemNumber = Math.max(...this.inventoryItems.filter((item)=>{return item.item_name==this.addSelectedItemName}).map((item)=>{return item.item_number})) + 1;
    console.log(newItemNumber);
    let data = {"items": []}
    for(var i=newItemNumber; i < (newItemNumber + this.addItemQuantity); ++i){
      let rfidValue = tempItemID.toString()+"-"+i.toString();
      rfidValue = 'Z'.repeat(12-rfidValue.length) + rfidValue;
      rfidValue = hexEncode(rfidValue); 
      data.items.push({
        "item_name": this.addSelectedItemName,
        "item_id": tempItemID,
        "item_number": i,
        "rfid_value": rfidValue
      });      
    }
    this.inventoryService.newInventory(data);
  }


  //New Buttons
  newItem(){
		if(this.newItemName.length == 0){
  		alert("Must give item a name");
  		return;
  	} else if(this.newItemQuantity < 0){
  		alert("Quantity must be greater than 0");
  		return;
  	}
    let newItemID = Math.max(...this.inventoryItems.map((item)=>{return item.item_id}))+1;
    if(newItemID.toString()=='-Infinity'){
      newItemID = 1;
    }
    if(newItemID == null){
      alert("Can't calculate item_id");
      return;      
    } 
    let data = {"items": []}
    for(var i=1; i<=this.newItemQuantity; ++i){
      let rfidValue = newItemID.toString()+"-"+i.toString();
      rfidValue = 'Z'.repeat(12-rfidValue.length) + rfidValue;
      rfidValue = hexEncode(rfidValue); 
      data.items.push({
        "item_name": this.newItemName,
        "item_id": newItemID,
        "item_number": i,
        "rfid_value": rfidValue
      });      
    }
  	this.inventoryService.newInventory(data);
  }

  printLabels(){
    if(this.newItemName.length == 0){
      alert("Must give item a name");
      return;
    }
    if(this.newItemQuantity <= 0){
      alert("Quantity must be greater than 0");
      return;
    }
    let newItemID = Math.max(...this.inventoryItems.map((item)=>{return item.item_id}))+1;
    if(newItemID.toString()=='-Infinity'){
      newItemID = 1;
    }
    if(newItemID == null){
      alert("Can't calculate item_id");
      return;      
    } 
    let selectedPrinter = this.printers.find((printer)=>{return printer.name == this.selectedPrinterName});
    let zebraCommand = "";
    for (var i=1;i<=this.newItemQuantity; ++i){
      let labelPW = Date.now().toString().slice(-8);
      let rfidValue = newItemID.toString()+"-"+i.toString();
      rfidValue = 'Z'.repeat(12-rfidValue.length) + rfidValue;
      rfidValue = hexEncode(rfidValue); 
      let itemName = this.newItemName + "-" + i;
      zebraCommand += "^XA^CFD ^LH0,72^PR2,2,2^FS ^RS8,,,3^RFW,H,^FD"+rfidValue+
      "^FS ^RZ"+labelPW+",E,L^FS^RZ"+labelPW+",A,L^FS ^BXN,5,200^FO10,5^FD"+itemName+
      "^FS ^A0N,30,30^FO110,30^FD"+itemName+"^FS ^PQ1^XZ";
    }
    var data = {
      ip_address: selectedPrinter.address,
      port: selectedPrinter.port,
      zpl: zebraCommand
    }
    this.printersService.printLabels(data).subscribe();
  }

}

function hexEncode(str){
  var hex, i, str;

  var result = "";
  for (i=0; i<str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += (hex).slice(-4);
  }

  return result.toUpperCase()
}