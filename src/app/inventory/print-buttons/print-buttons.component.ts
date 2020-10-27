import { Component, OnInit, Input, SimpleChange, OnChanges } from '@angular/core';
import { Instrument } from '../../models/Instrument';
import { InstrumentService } from '../../services/instrument.service';
import { PrintersService } from '../../services/printers.service';


@Component({
  selector: 'app-print-buttons',
  templateUrl: './print-buttons.component.html',
  styleUrls: ['./print-buttons.component.scss']
})
export class PrintButtonsComponent implements OnInit {

	@Input() inventoryItems: any[];
	printSelectedItems: any[] = [];

	labelQuantity: number = 0;
	printers: Instrument[];
	selectedPrinterName: any;

	newPrinterName: string = "";
	newPrinterIP: string = "";

  constructor(private instrumentService: InstrumentService, private printersService: PrintersService) { }


  //when inputs change, run appropriate functions
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    this.printSelectedItems = [this.inventoryItems[0]];
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

  deletePrinter(){
  	let selectedPrinter = this.printers.find((printer)=>{return printer.name == this.selectedPrinterName});
 		var data = {
			id: selectedPrinter.id
		}
	  	this.instrumentService.deleteInstrument(data).subscribe(res1 => {
			var data = {
				type: "zebra_printer"
			}
		  	this.instrumentService.getInstruments(data).subscribe(res1 => {
					this.printers = res1;
					this.selectedPrinterName = this.printers[0].name;
			});
		});
  }

  addPrinter(){
		if(this.newPrinterName.length < 1){
			alert("Printer name must be greater than 0 characters");
			return;
		} else if((this.newPrinterIP.length < 7)||(this.newPrinterIP.length > 15)){
			alert("Printer IP must be greater than 7 characters and less than 15 characters");
			return;
		}
			
		var data={
			name: this.newPrinterName,
			ip_address:this.newPrinterIP,
			type:"zebra_printer",
			port:9100
		}
		this.instrumentService.createInstrument(data).subscribe(res => {
			var data = {
				type: "zebra_printer"
					}
		  	this.instrumentService.getInstruments(data).subscribe(res1 => {
					this.printers = res1;
					this.selectedPrinterName = this.printers[0].name;
		  	});
  		});
  }

  printLabels(){
  	if(this.labelQuantity <= 0){
  		alert("Label Quantity must be greater than 0");
  		return;
  	}
  	let selectedPrinter = this.printers.find((printer)=>{return printer.name == this.selectedPrinterName});
    let zebraCommand = "";    
    this.printSelectedItems.forEach((item)=>{
    	let labelPW = Date.now().toString().slice(-8);
      let rfidValue = item.rfid_value;
      let itemName = item.item_name + "-" + item.item_number;
      zebraCommand += "^XA^CFD ^LH0,72^PR2,2,2^FS ^RS8,,,3^RFW,H,^FD"+rfidValue+
      "^FS ^RZ"+labelPW+",E,L^FS^RZ"+labelPW+",A,L^FS ^BXN,5,200^FO10,5^FD"+itemName+
      "^FS ^A0N,30,30^FO110,30^FD"+itemName+"^FS ^PQ"+this.labelQuantity+"^XZ";
    })
		var data = {
			ip_address: selectedPrinter.address,
			port: selectedPrinter.port,
			zpl: zebraCommand
		}
		this.printersService.printLabels(data).subscribe();
  }

}
