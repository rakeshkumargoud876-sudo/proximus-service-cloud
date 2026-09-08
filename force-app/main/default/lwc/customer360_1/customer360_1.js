import { LightningElement,api,wire } from 'lwc';
import getRecords from '@salesforce/apex/cutsomer360_1.getRecords';
import updateRecords from '@salesforce/apex/cutsomer360_1.updateRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';
import deleteRecord from '@salesforce/apex/cutsomer360_1.deleteRecord';






const actions=[{label:'view',name:'view'},
                {label:'Edit',name:'edit'},
                {label:'Delete',name:'delete'}
];

const COLUMNS=[{label:'Name',fieldName:'Name',sortable:true},
                {label:'Service Type',fieldName:'Service_Type__c' ,editable:true},
                {label:'Plan',fieldName:'Plan__c'},
                {label:'Status',fieldName:'Status__c',editable:true},
                {label:'action', type:'action',typeAttributes:{rowActions:actions}}
];


export default class Customer360_1 extends NavigationMixin (LightningElement) {
@api recordId;
services=[];
filteredservice=[];
currentpage=1;
pagesize=5;
totalpages;
searchtext;
columns=COLUMNS;
sortedBy;
sortedDirection;

@wire(getRecords,{accountId: '$recordId' })
    wiredservices({data,error}){
    if(data){
this.services=data;
this.filteredservice=data;
this.totalpages=Math.ceil(this.filteredservice.length/this.pagesize);
this.pageload();
 }
    else if(error){
console.log(error);
    }
}
pageload(){
    const start=(this.currentpage-1)*this.pagesize;
    const end=start+this.pagesize;
    this.services=this.filteredservice.slice(start,end);
}
handlesave(event){
    const changedrecords=event.detail.draftValues;
    updateRecords({services:changedrecords})
    
     .then(()=>{
        const toast = new ShowToastEvent({
            title:'Success',
            message:'record updated succesfully',
            variant:'success'
        });
        this.dispatchEvent(toast);
     })
     .catch(error=>{
        const toast = new ShowToastEvent({
            title:'Error',
            message:'record update failed',
            variant:'error'
        });
        this.dispatchEvent(toast);
     })
}


handlerowaction(event)
{
const actionName=event.detail.action.name;
const actionrow=event.detail.row;
if(actionName==='view'){
     this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: actionrow.Id,
                objectApiName: 'Service_Subscription__c',
                actionName: 'view'
            }
        });
}
if(actionName==='edit'){
    this[NavigationMixin.Navigate]({
       type:'standard__recordPage',
       attributes:{
        recordId:actionrow.Id,
        objectApiName:'Service_Subscription__c',
          actionName: 'edit'
       }
    })
}
if(actionName==='delete'){
    deleteRecord({serviceId:actionrow.Id})
}
}
handlechange(event){
this.searchtext=event.target.value.toLowerCase();
this.services=this.filteredservice.filter(service=>{
    return (
            (service.Name || '').toLowerCase().includes(this.searchtext) ||
            (service.Service_Type__c || '').toLowerCase().includes(this.searchtext) ||
            (service.Plan__c || '').toLowerCase().includes(this.searchtext) ||
            (service.Status__c || '').toLowerCase().includes(this.searchtext)
        );
});
}
handlenext(){
    if(this.currentpage<this.totalpages){
        this.currentpage++;
        this.pageload();
    }
}
handleprevious(){
    if(this.currentpage>1){
        this.currentpage--;
        this.pageload();
    }
}
handlesort(event) {

    const field = event.detail.fieldName;
    const direction = event.detail.sortDirection;

    this.sortedBy = field;
this.sortedDirection = direction;

    this.services.sort((a, b) => {

        if (direction === 'asc') {
            return a[field] > b[field] ? 1 : -1;
        }

        return a[field] > b[field] ? -1 : 1;

    });

    this.services = [...this.services];
}

}