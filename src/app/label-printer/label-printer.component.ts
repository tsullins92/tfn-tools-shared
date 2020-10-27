import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Instrument } from '../models/Instrument';
import { InstrumentService } from '../services/instrument.service';
import { PrintersService } from '../services/printers.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Observable,Subject,BehaviorSubject, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';


export interface DialogData {
  name: string;
  address: string;
}

@Component({
  selector: 'app-label-printer',
  templateUrl: './label-printer.component.html',
  styleUrls: ['./label-printer.component.scss']
})
export class LabelPrinterComponent implements OnInit {
	// Reference content variable inside Component
	@ViewChild('editContent', {static: false}) editContentRef: ElementRef;
	closeResult: string;

	labelTemplate:string="TFN RFID";
	labelTemplates:string[]=["TFN RFID", "Media Prep Barcode", "Regulated Material","Potatoes", "Light Cart - 1 Experiment", "Light Cart - 2 Experiments", "Light Cart - 3 Experiments"];

	printers: Instrument[];
	selectedPrinter: any;
  text: string[] = [];
  textSettingsExpanded: boolean[] = [];
  labelHome: number[] = [0,0];
  barCodeText: string = "";
  rfidText: string = "";
  xCoords: number[] = [];
  yCoords: number[] = [];
  xCoordsOptions: number[] = [];
  yCoordsOptions: number[] = [];
  fontSize: number[] = [];
  fontSizeOptions: number[] = [];
  fontHeight: number[] = [];
  fontWidth: number[] = [];
  percentArray: number[] = [];
  isBarcode: boolean[] = [];
  increment: boolean[] = [];
	includeExpiration: boolean = false;
	includeMadeDate: boolean = false;
	expirationDateString: string;
	madeDateString: string;
	expirationDate: Date;
	movingUp: boolean = false;
	movingDown: boolean = false;
	movingRight: boolean = false;
	movingLeft: boolean = false;
	zebraCommand: string = "";
	newPrinterName: string = "";
	newPrinterIP: string = "";
	quantity: number = 1;
	labelWidth: number = 2.25;
	labelHeight: number = 0.75;
	isRFID: boolean = true;
	printQueue: any[] = [];
	uploadedData: Array<Array<any>> = [[]];

	constructor(private instrumentService: InstrumentService, private printersService: PrintersService, public dialog: MatDialog) { 
		this.labelTemplate = this.labelTemplates[0];
		this.text[0] = "line 1";
		this.textSettingsExpanded[0] = true;
		for (var i=0;i<=600;++i){
			this.xCoordsOptions.push(i);
			if(i<=160){
				this.yCoordsOptions.push(i);
			}
			if(i<=100){
				this.percentArray.push(i);
			}
			if(i<=150){
				this.fontSizeOptions.push(i);
			}
		}
	}

	ngOnInit() {
		this.changeTemplate();
		var data = {
			type: "zebra_printer"
		}
  	this.instrumentService.getInstruments(data).subscribe(res => {
			this.printers = res;
			this.selectedPrinter = this.printers[0];
  	});

}

	createLengths(){
		let tempArray = [];
		for(var i=1;i<=64;++i){
			tempArray.push(i/8);
		}
		return tempArray;
	}

	addText(){
		if(!(this.text.length>9)){
			this.text.push("line " + (this.text.length+1));
			this.textSettingsExpanded.push(false);
			this.xCoords.push(25);
			this.yCoords.push(25);
			this.fontSize.push(40);
			this.isBarcode.push(false);
		}
	}

	removeText(){
		if(this.text.length>1){
			this.text.pop();
			this.textSettingsExpanded.pop();
			this.xCoords.pop();
			this.yCoords.pop();
			this.fontSize.pop();
			this.isBarcode.pop();
		}
	}

/*trackByFn prevents strange error with input 
*/	trackByFn(index, item) {
    	return index;
    }

	changeTemplate(){
		if(this.labelTemplate=="TFN RFID"){
			this.labelHeight = 0.75;
			this.labelWidth = 2.25;
			this.labelHome=[0,72];
			this.isRFID=true;
			this.rfidText="123456-1";
			this.text[0]="123456-1";
			this.increment[0]=false;
			this.isBarcode[0]=true;
			this.fontSize[0]=5;
			this.xCoords[0]=10;
			this.yCoords[0]=25;
			this.text[1]="123456-1";
			this.increment[1]=false;
			this.isBarcode[1]=false;
			this.fontSize[1]=39.75;
			this.xCoords[1]=80;
			this.yCoords[1]=3;
			this.text[2]="pMON456789";
			this.increment[2]=false;
			this.isBarcode[2]=false;
			this.fontSize[2]=38.25;
			this.xCoords[2]=80;
			this.yCoords[2]=55;
			this.text[3]="01DKD2";
			this.increment[3]=false;
			this.isBarcode[3]=false;
			this.fontSize[3]=24;
			this.xCoords[3]=320;
			this.yCoords[3]=15;
			this.text[4]="STD - False";
			this.increment[4]=false;
			this.isBarcode[4]=false;
			this.fontSize[4]=24;
			this.xCoords[4]=320;
			this.yCoords[4]=40;
			this.text[5]="RODA";
			this.increment[5]=false;
			this.isBarcode[5]=false;
			this.fontSize[5]=24;
			this.xCoords[5]=320;
			this.yCoords[5]=65;
			this.text[6]="Insect Mind Control";
			this.increment[6]=false;
			this.isBarcode[6]=false;
			this.fontSize[6]=21.75;
			this.xCoords[6]=8;
			this.yCoords[6]=99;
		}


		else if(this.labelTemplate=="Media Prep Barcode"){
			var madeDateString =  (new Date(Date.now()).getUTCMonth()+1).toString() + "-" + 
															new Date(Date.now()).getUTCDate().toString() + "-" + 
															new Date(Date.now()).getUTCFullYear().toString();
			var expiryString =  (new Date(Date.now()+5184000000).getUTCMonth()+1).toString() + "-" + 
															new Date(Date.now()+5184000000).getUTCDate().toString() + "-" + 
															new Date(Date.now()+5184000000).getUTCFullYear().toString();
			this.isRFID=false;
			this.rfidText = "";
			this.labelHeight = 0.625;
			this.labelWidth = 2;
			this.labelHome=[0,0];
			this.text[0]="12345678";
			this.increment[0]=false;
			this.isBarcode[0]=true;
			this.fontSize[0]=5;
			this.xCoords[0]=32;
			this.yCoords[0]=25;
			this.text[1]="12345678";
			this.increment[1]=false;
			this.isBarcode[1]=false;
			this.fontSize[1]=30
			this.xCoords[1]=110;
			this.yCoords[1]=72;
			this.text[2]="5003";
			this.increment[2]=false;
			this.isBarcode[2]=false;
			this.fontSize[2]=39.75;
			this.xCoords[2]=110;
			this.yCoords[2]=27;
			this.text[3]="M: "+this.madeDateString;
			this.increment[3]=false;
			this.isBarcode[3]=false;
			this.fontSize[3]=21.75;
			this.xCoords[3]=284;
			this.yCoords[3]=22;
			this.text[4]="E: "+ expiryString;
			this.increment[4]=false;
			this.isBarcode[4]=false;
			this.fontSize[4]=21.75;
			this.xCoords[4]=284;
			this.yCoords[4]=57;
			this.text[5]="cc: Brownish Green";
			this.increment[5]=false;
			this.isBarcode[5]=false;
			this.fontSize[5]=18.75;
			this.xCoords[5]=284;
			this.yCoords[5]=82;			
			this.text[6]="Mountain Dew";
			this.increment[6]=false;
			this.isBarcode[6]=false;
			this.fontSize[6]=24.75;
			this.xCoords[6]=8;
			this.yCoords[6]=99;	
		}
		else if(this.labelTemplate=="Regulated Material"){
			this.isRFID=false;
			this.rfidText = "";
			this.labelHeight = 2;
			this.labelWidth = 4;
			this.labelHome=[0,0];
			this.isBarcode[0]=false;
			this.text[0]="1839";
			this.increment[0]=true;
			this.fontSize[0]=41.25;
			this.xCoords[0]=280;
			this.yCoords[0]=188;
			this.text[1]="18-262-101m: 19-100-104m (Agrobacterium)";
			this.isBarcode[1]=false;
			this.increment[1]=false;
			this.fontSize[1]=35;
			this.xCoords[1]=40;
			this.yCoords[1]=340;
			this.text[2]="Container ID: ";
			this.increment[2]=false;
			this.isBarcode[2]=false;
			this.fontSize[2]=41.25;
			this.xCoords[2]=40;
			this.yCoords[2]=180;
			this.text[3]="USDA Permit Numbers: ";
			this.increment[3]=false;
			this.isBarcode[3]=false;
			this.fontSize[3]=41.25;
			this.xCoords[3]=40;
			this.yCoords[3]=260;
			this.text[4]="USDA Regulated Material";
			this.increment[4]=false;
			this.isBarcode[4]=false;
			this.fontSize[4]=37.5;
			this.xCoords[4]=20;
			this.yCoords[4]=20;
			this.text[5]="Function: Biotechnology";
			this.increment[5]=false;
			this.isBarcode[5]=false;
			this.fontSize[5]=37.5;
			this.xCoords[5]=440;
			this.yCoords[5]=20;
			this.text[6]="Responsible Person: Jeanne Layton";
			this.increment[6]=false;
			this.isBarcode[6]=false;
			this.fontSize[6]=41.25;
			this.xCoords[6]=40;
			this.yCoords[6]=100;
		}
		else if(this.labelTemplate=="Potatoes"){
			this.isRFID=false;
			this.rfidText = "";
			this.labelHeight = 0.625;
			this.labelWidth = 2;
			this.labelHome=[0,0];
			this.text[0]="2089";
			this.increment[0]=false;
			this.isBarcode[0]=false;
			this.fontSize[0]=30;
			this.xCoords[0]=170;
			this.yCoords[0]=10;
			this.text[1]="ATBT04-06";
			this.increment[1]=false;
			this.isBarcode[1]=false;
			this.fontSize[1]=25
			this.xCoords[1]=170;
			this.yCoords[1]=40;
			this.text[2]="JMROTT";
			this.increment[2]=false;
			this.isBarcode[2]=false;
			this.fontSize[2]=20;
			this.xCoords[2]=60;
			this.yCoords[2]=70;
			this.text[3]="11/10/2016";
			this.increment[3]=false;
			this.isBarcode[3]=false;
			this.fontSize[3]=20;
			this.xCoords[3]=170;
			this.yCoords[3]=90;
			this.text[4]="Construct:";
			this.increment[4]=false;
			this.isBarcode[4]=false;
			this.fontSize[4]=30;
			this.xCoords[4]=10;
			this.yCoords[4]=10;
			this.text[5]="Experiment #:";
			this.increment[5]=false;
			this.isBarcode[5]=false;
			this.fontSize[5]=25;
			this.xCoords[5]=10;
			this.yCoords[5]=40;			
			this.text[6]="User:";
			this.increment[6]=false;
			this.isBarcode[6]=false;
			this.fontSize[6]=20;
			this.xCoords[6]=10;
			this.yCoords[6]=70;	
			this.text[7]="Experiment Date:";
			this.increment[7]=false;
			this.isBarcode[7]=false;
			this.fontSize[7]=20;
			this.xCoords[7]=10;
			this.yCoords[7]=90;				
		}
		else if(this.labelTemplate=="Light Cart - 1 Experiment"){
			if(this.text.length>1){
				while(this.text.length>1){this.removeText()};
			}
			this.isRFID=false;
			this.rfidText = "";
			this.labelHeight = 2;
			this.labelWidth = 4;
			this.labelHome=[0,0];
			this.text[0]="567890-1";
			this.isBarcode[0]=false;
			this.increment[0]=false;
			this.fontSize[0]=100;
			this.xCoords[0]=120;
			this.yCoords[0]=150;
		}
		else if(this.labelTemplate=="Light Cart - 2 Experiments"){
			if(this.text.length>2){
				while(this.text.length>2){this.removeText()};
			}
			this.isRFID=false;
			this.rfidText = "";
			this.labelHeight = 2;
			this.labelWidth = 4;
			this.labelHome=[0,0];
			this.text[0]="567890-1";
			this.isBarcode[0]=false;
			this.increment[0]=false;
			this.fontSize[0]=100;
			this.xCoords[0]=120;
			this.yCoords[0]=70;
			this.text[1]="345678-1";
			this.isBarcode[1]=false;
			this.increment[1]=false;
			this.fontSize[1]=100;
			this.xCoords[1]=120;
			this.yCoords[1]=230;
		}
		else if(this.labelTemplate=="Light Cart - 3 Experiments"){
			if(this.text.length>3){
				while(this.text.length>3){this.removeText()};
			}
			this.isRFID=false;
			this.rfidText = "";
			this.labelHeight = 2;
			this.labelWidth = 4;
			this.labelHome=[0,0];
			this.text[0]="567890-1";
			this.isBarcode[0]=false;
			this.increment[0]=false;
			this.fontSize[0]=100;
			this.xCoords[0]=120;
			this.yCoords[0]=20;
			this.text[1]="345678-1";
			this.isBarcode[1]=false;
			this.increment[1]=false;
			this.fontSize[1]=100;
			this.xCoords[1]=120;
			this.yCoords[1]=150;
			this.text[2]="123456-1";
			this.isBarcode[2]=false;
			this.increment[2]=false;
			this.fontSize[2]=100;
			this.xCoords[2]=120;
			this.yCoords[2]=300;
		}
	}

	generateZebraString(){
		this.zebraCommand = "^XA^CFD\n^LH"+this.labelHome[0].toString()+","+this.labelHome[1].toString()+"^PR2,2,2^FS\n";
		if(this.isRFID){
			this.zebraCommand += "^RS8,,,3^RFW,H,^FD"+hexEncode("9900"+this.rfidText)+"^FS ^RZ05312008,E,L^FS^RZ05312008,A,L^FS\n";
		}
		for (var i=0;i<this.text.length;++i){
			if(this.isBarcode[i]){
				this.zebraCommand += "^BXN,"+(this.fontSize[i]).toString()+",200^FO"+Math.round((this.xCoords[i])).toString()+","+Math.round((this.yCoords[i])).toString()+"^FD"+this.text[i]+"^FS\n";
			}			
			else{
				this.zebraCommand += "^A0N,"+(this.fontSize[i]).toString()+","+this.fontSize[i].toString()+"^FO"+Math.round((this.xCoords[i])).toString()+","+Math.round(this.yCoords[i]).toString()+"^FD"+this.text[i]+"^FS\n";
			} 	
		}	
		this.zebraCommand += "^PQ"+this.quantity+"^XZ";
		return this.zebraCommand;
	}


	addPrinter(){
		if((this.newPrinterName.length > 2)&&(this.newPrinterIP.length>7)){
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
						this.selectedPrinter = this.printers[0];
			  	});
	  		});
	  	}
	}

	addPrinterForm(){
		const dialogRef = this.dialog.open(AddPrinterDialog,{
			width: '250px',
			data: {name: this.newPrinterName,address: this.newPrinterIP}
		});
		dialogRef.afterClosed().subscribe((result) => {
			this.newPrinterName = result.name;
			this.newPrinterIP = result.address;
			console.log(result);
			this.addPrinter();
		});		
	}

	printLabel(){
		if(this.increment.some((x)=>{return x})){
			this.printRegulatedLabels(0,this.quantity);
			return;
		}
		else{
			var tempPrinter = JSON.parse(this.selectedPrinter);
			var data = {
				ip_address: tempPrinter.address,
				port: tempPrinter.port,
				zpl: this.zebraCommand
			}
			this.printersService.printLabels(data).subscribe();
		}
	}

	printRegulatedLabels(i:number=0, x: number=0){
		this.quantity = 1;
		this.generateZebraString();
		console.log(i);
		if(i >= x){
			return;
		}
		var tempPrinter = JSON.parse(this.selectedPrinter);
		var data = {
			ip_address: tempPrinter.address,
			port: tempPrinter.port,
			zpl: this.zebraCommand
		}	
		this.printersService.printLabels(data).subscribe();
		//increment all text array numbers that require it
		this.text.map((x,index)=>{
			if(this.increment[index]){
				x = (parseInt(this.text[index])+1).toString();
			}
		});
		this.text[0] = (parseInt(this.text[0])+1).toString();
		setTimeout(() =>
    {
        this.printRegulatedLabels(i + 1, x);

    }, 2000);
	}

	printQueueClicked(size: number, index: number = 0){
		this.labelTemplate = this.printQueue[index].template
		this.changeTemplate();
		for(var lineIndex in this.printQueue[index].lines){
			this.text[lineIndex]=this.printQueue[index].lines[lineIndex];
			this.increment[lineIndex]=false
		}
		this.generateZebraString();
		this.printLabel();
		if(index<this.printQueue.length-1){
			setTimeout(() =>{this.printQueueClicked(this.printQueue.length, index+1)}, 2000);
		}
	}

	deletePrinter(){
		var tempPrinter = JSON.parse(this.selectedPrinter);
		var data = {
			id: tempPrinter.id
		}
	  	this.instrumentService.deleteInstrument(data).subscribe(res1 => {
			var data = {
				type: "zebra_printer"
			}
		  	this.instrumentService.getInstruments(data).subscribe(res1 => {
					this.printers = res1;
					this.selectedPrinter = this.printers[0];
			});
		});
	}

	randomTrueOrFalse(){
		let tempRandom = Math.random();
		if(tempRandom>0.5){
			return true;
		}
		else{
			return false;
		}
	}

	absoluteValue(x: number){
		return Math.abs(x);
	}

	getPrintQueue(queue: any[]){
		this.printQueue = queue;
		console.log(this.printQueue);
	}

	printQueueSize(){
		if(this.printQueue.length){
			return this.printQueue.length;
		}
		else return 0
	}

	queueClicked(){
		document.getElementById('printQueue').style.display='block';
	}

	eraseQueue(){
		this.printQueue = [];
	}

  // importXL(event: any){
  //   /* wire up file reader */
  //   const target: DataTransfer = <DataTransfer>(event.target);
  //   if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  //   const reader: FileReader = new FileReader();
  //   reader.onload = (e: any) => {
  //     /* read workbook */
  //     const bstr: string = e.target.result;
  //     const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

  //     /* grab first sheet */
  //     const wsname: string = wb.SheetNames[0];
  //     const ws: XLSX.WorkSheet = wb.Sheets[wsname];

  //     /* save data */
  //     this.uploadedData = <Array<Array<any>>>(XLSX.utils.sheet_to_json(ws, {header: 1}));
  //   };
  //   reader.readAsBinaryString(target.files[0]);
  //   console.log(this.uploadedData);
  // }	

}



function hexEncode(str){
  var hex, i, str;

  var result = "";
  for (i=0; i<str.length; i++) {
      hex = str.charCodeAt(i).toString(16);
      result += (hex).slice(-4);
  }

  return result
}


@Component({
  selector: 'add-printer-dialog',
  templateUrl: './add-printer-dialog.html',
  styleUrls: ['./add-printer-dialog.scss']
})
export class AddPrinterDialog {

  constructor(
    public dialogRef: MatDialogRef<AddPrinterDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }

}