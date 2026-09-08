import { LightningElement, api, wire } from 'lwc';
import getCases from '@salesforce/apex/Customer360_2.getCases';
import updateCases from '@salesforce/apex/Customer360_2.updateCases';
import deleteCase from '@salesforce/apex/Customer360_2.deleteCase';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from 'lightning/navigation';

const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];

const COLUMNS = [
    {
        label: 'Case Number',
        fieldName: 'CaseNumber',
        sortable: true
    },
    {
        label: 'Subject',
        fieldName: 'Subject',
        editable: true,
        sortable: true
    },
    {
        label: 'Status',
        fieldName: 'Status',
        editable: true,
        sortable: true
    },
    {
        label: 'Priority',
        fieldName: 'Priority',
        editable: true,
        sortable: true
    },
    {
        label: 'Origin',
        fieldName: 'Origin',
        sortable: true
    },
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions
        }
    }
];

export default class Customer360Case extends NavigationMixin(LightningElement) {

    @api recordId;

    services = [];
    filteredservice = [];

    columns = COLUMNS;

    currentpage = 1;
    pagesize = 5;
    totalpages;

    searchtext;

    sortedBy;
    sortedDirection;

    wiredResult;

    @wire(getCases, { accountId: '$recordId' })
    wiredCases(result) {

        this.wiredResult = result;

        if (result.data) {

            this.filteredservice = result.data;

            this.totalpages =
                Math.ceil(this.filteredservice.length / this.pagesize);

            this.pageload();

        }
        else if (result.error) {

            console.log(result.error);

        }

    }

    pageload() {

        const start = (this.currentpage - 1) * this.pagesize;

        const end = start + this.pagesize;

        this.services = this.filteredservice.slice(start, end);

    }

    handlesave(event) {

        const changedRecords = event.detail.draftValues;

        updateCases({ caseList: changedRecords })

            .then(() => {

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Case Updated Successfully',
                        variant: 'success'
                    })
                );

                return refreshApex(this.wiredResult);

            })

            .catch(() => {

                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Update Failed',
                        variant: 'error'
                    })
                );

            });

    }

    handlerowaction(event) {

        const actionName = event.detail.action.name;

        const row = event.detail.row;

        if (actionName === 'view') {

            this[NavigationMixin.Navigate]({

                type: 'standard__recordPage',

                attributes: {

                    recordId: row.Id,

                    objectApiName: 'Case',

                    actionName: 'view'

                }

            });

        }

        if (actionName === 'edit') {

            this[NavigationMixin.Navigate]({

                type: 'standard__recordPage',

                attributes: {

                    recordId: row.Id,

                    objectApiName: 'Case',

                    actionName: 'edit'

                }

            });

        }

        if (actionName === 'delete') {

            deleteCase({ caseId: row.Id })

                .then(() => {

                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Case Deleted',
                            variant: 'success'
                        })
                    );

                    return refreshApex(this.wiredResult);

                });

        }

    }

    handlechange(event) {

        this.searchtext = event.target.value.toLowerCase();

        this.filteredservice = this.wiredResult.data.filter(caseRec => {

            return (

                (caseRec.CaseNumber || '').toLowerCase().includes(this.searchtext) ||

                (caseRec.Subject || '').toLowerCase().includes(this.searchtext) ||

                (caseRec.Status || '').toLowerCase().includes(this.searchtext) ||

                (caseRec.Priority || '').toLowerCase().includes(this.searchtext) ||

                (caseRec.Origin || '').toLowerCase().includes(this.searchtext)

            );

        });

        this.currentpage = 1;

        this.totalpages =
            Math.ceil(this.filteredservice.length / this.pagesize);

        this.pageload();

    }

    handlenext() {

        if (this.currentpage < this.totalpages) {

            this.currentpage++;

            this.pageload();

        }

    }

    handleprevious() {

        if (this.currentpage > 1) {

            this.currentpage--;

            this.pageload();

        }

    }

    handlesort(event) {

        const field = event.detail.fieldName;

        const direction = event.detail.sortDirection;

        this.sortedBy = field;

        this.sortedDirection = direction;

        this.filteredservice.sort((a, b) => {

            if (direction === 'asc') {

                return a[field] > b[field] ? 1 : -1;

            }

            return a[field] > b[field] ? -1 : 1;

        });

        this.pageload();

    }

}