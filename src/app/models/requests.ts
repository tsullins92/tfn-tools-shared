export class Request {

	initialized: boolean = false;
	requestid: string;
	requestdt: string;
	duedt: string;
	requesterid: string;
	purpose: string;
	requeststatus: string;
	projectid: string;
	notes: string;

	constructor(requestData: any){
	  this.initialized = true;
		this.requestid = String(requestData.requestid);
		this.requestdt = String(requestData.requestdt);
		this.duedt = String(requestData.duedt);
		this.requesterid = String(requestData.requesterid);
		this.purpose = String(requestData.purpose);
		this.requeststatus = String(requestData.requeststatus);
		this.projectid = String(requestData.projectid);
		this.notes = String(requestData.notes);
	}

  getValues(){
  	if(this.initialized){return Object.values(this).slice(1,Object.values(this).length);}
  }

	print(){
    console.log(Object.getOwnPropertyNames(this));		
	}
}

export class RequestArray {
	requests: Request[];
	untouchedRequests: Request[];
	sortArray: any[];
	searchString: string = '';

	constructor(requestData: any[]){
		this.requests = requestData.map((data)=>{return new Request(data)});
		this.untouchedRequests = requestData.map((data)=>{return new Request(data)});
		this.sortArray = this.getHeaders().map((header)=>{return {header: header, sort: 'none'}});
	}

  getHeaders(){
  	if(this.requests != null){return Object.getOwnPropertyNames(this.requests[0]).slice(1,Object.getOwnPropertyNames(this.requests[0]).length);}
  }

  sortByHeader(header){
  	if(header.sort=='none'){header.sort='asc';}
  	else if(header.sort=='asc'){header.sort='desc';}
  	else {header.sort = 'none';}
   	this.sortArray.forEach((sort)=>{
   		if(sort.header!=header.header){sort.sort='none'};
   	});
  }

  getRequests(){
  	let sortHeader = this.sortArray[this.sortArray.findIndex((header)=>{return header.sort != 'none'})]
  	let tempRequests;
  	if(sortHeader == null){tempRequests = this.untouchedRequests;}
  	else if(sortHeader.sort=='asc'){
	  	tempRequests = this.requests.sort((a,b)=>{
		    if(a[sortHeader.header] < b[sortHeader.header]) return -1;
		    if(a[sortHeader.header] > b[sortHeader.header]) return 1;
		    return 0;
	  	})
  	}
  	else if (sortHeader.sort=='desc'){
	  	tempRequests = this.requests.sort((a,b)=>{
		    if(a[sortHeader.header] < b[sortHeader.header]) return 1;
		    if(a[sortHeader.header] > b[sortHeader.header]) return -1;
		    return 0;
	  	})
  	}
  	tempRequests = tempRequests.filter((tempRequest)=>{return tempRequest.getValues().findIndex((value)=>{return value.toLowerCase().includes(this.searchString.toLowerCase())}) != -1});
  	return tempRequests;
  }

	print(){
    console.log(this.requests);		
	}
}