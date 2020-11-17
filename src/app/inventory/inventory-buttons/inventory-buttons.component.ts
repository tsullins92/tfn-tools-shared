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
  newItemUnit: string = '';

  addSelectedItemName: any;
	addItemQuantity: number = 0;

	editSelectedName: string = "";
	editItemName: string = "";
  editItemUnit: string = "";

	deleteSelectedItems: any[] = [];

  printers: Instrument[];
  selectedPrinterName: any;


  constructor(public inventoryService: InventoryService, private instrumentService: InstrumentService, private printersService: PrintersService) { }

  //when inputs change, run appropriate functions
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if(this.inventoryItems.length>0){
      this.editSelectedName = this.inventoryItems[0].item_name;
      this.editItemName = this.inventoryItems[0].item_name;
      this.editItemUnit = this.inventoryItems[0].unit;  
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
  	let data = {
      "item_name": this.editSelectedName,
  		"new_item_name": this.editItemName,
      "unit": this.editItemUnit
  	}
  	this.inventoryService.editInventory(data);
  }

  getInventoryItems(){
    let result = this.inventoryItems.filter((item, index, items)=>{return items.findIndex((item1)=>{return item1.item_name==item.item_name})==index});
    return result;
  }

  changeEditSelectedItem(){
  	this.editItemName = this.editSelectedName;
    this.editItemUnit = this.inventoryItems.find((item)=>{return item.item_name.trim() == this.editSelectedName.trim();}).unit;
  }

  addItems(){
    if(this.addItemQuantity <= 0){
      alert("Quantity must be greater than 0");
      return;
    }
    let tempInvItem = this.inventoryItems.find((item)=>{return item.item_name == this.addSelectedItemName});
    let tempItemUnit = tempInvItem.unit;
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
        "rfid_value": rfidValue,
        "unit": tempItemUnit
      });      
    }
    console.log(data);
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
        "rfid_value": rfidValue,
        "unit": this.newItemUnit
      });      
    }
  	this.inventoryService.newInventory(data);
  }

  printNewLabels(){
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
      "^FS ^RZ"+labelPW+",E,L^FS^RZ"+labelPW+",A,L^FS ^BXN,5,200^FO10,5^FD"+rfidValue+
      "^FS " + this.multilineZPL(itemName, 22) + "^PQ1^XZ";
    }
    var data = {
      ip_address: selectedPrinter.address,
      port: selectedPrinter.port,
      zpl: zebraCommand
    }
    this.printersService.printLabels(data).subscribe();
  }

  printAddLabels(){
    if(this.addSelectedItemName.length == 0){
      alert("Must give item a name");
      return;
    }
    if(this.addItemQuantity <= 0){
      alert("Quantity must be greater than 0");
      return;
    }
    let tempInvItem = this.inventoryItems.find((item)=>{return item.item_name == this.addSelectedItemName});
    let tempItemUnit = tempInvItem.unit;
    let tempItemID = tempInvItem.item_id;
    let tempRFIDValue = tempInvItem.rfid_value;
    let newItemNumber = Math.max(...this.inventoryItems.filter((item)=>{return item.item_name==this.addSelectedItemName}).map((item)=>{return item.item_number})) + 1;
    let selectedPrinter = this.printers.find((printer)=>{return printer.name == this.selectedPrinterName});
    let zebraCommand = "";
    for(var i=newItemNumber; i < (newItemNumber + this.addItemQuantity); ++i){
      let labelPW = Date.now().toString().slice(-8);
      let rfidValue = tempItemID.toString()+"-"+i.toString();
      rfidValue = 'Z'.repeat(12-rfidValue.length) + rfidValue;
      rfidValue = hexEncode(rfidValue); 
      let itemName = this.addSelectedItemName + "-" + i;
      zebraCommand += "^XA^CFD ^LH0,72^PR2,2,2^FS ^RS8,,,3^RFW,H,^FD"+rfidValue+
      "^FS ^RZ"+labelPW+",E,L^FS^RZ"+labelPW+",A,L^FS ^BXN,5,200^FO10,5^FD"+rfidValue+
      "^FS " + this.multilineZPL(itemName, 22) + "^PQ1^XZ";
    }
    var data = {
      ip_address: selectedPrinter.address,
      port: selectedPrinter.port,
      zpl: zebraCommand
    }
    console.log(data);
    // this.printersService.printLabels(data).subscribe();
  }  

  multilineZPL(itemName: string, lineSize: number){
    let words = itemName.split(" ");
    let count = 0;
    let lineIdx = 0;
    let lines = [""];
    let multiLine = "";
    words.forEach((word)=>{
      let tempWord = word+" ";
      count += tempWord.length;
      console.log(word, count);
      if(count > lineSize){
        ++lineIdx;
        count = tempWord.length;
        lines.push(tempWord);
      } else{
        lines[lineIdx] += tempWord;
      }
    })
    lines.forEach((line, index)=>{
      multiLine += "^A0N,30,30^FO120,"+(30+(index*25))+"^FD"+line+"^FS ";
    })
    return multiLine;
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