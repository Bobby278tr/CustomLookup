import { LightningElement, wire, api } from 'lwc';
import fetchLookupData from '@salesforce/apex/customLookupController.fetchLookupData';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const DELAY = 300;
export default class MultiCustomLookup extends LightningElement {

    searchKey;
    @api objectApiName = 'Account';
    hasRecords = false;
    searchOutput=[];
    @api label ='Account';
    @api placeholder = 'Search Account...';
    delayTimeout;
    @api iconName = 'standard:account';
    selectedRecords = [];


    changeHandler(event){
        clearTimeout(this.delayTimeout);
        let value= event.target.value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = value;
            console.log('Search Key: ', this.searchKey);
        }, DELAY);
    }

    @wire(fetchLookupData, { searchKey: '$searchKey', objectApiName: '$objectApiName' })
    wiredLookupData({ error, data }) {
        if (data) {
            this.hasRecords = data.length > 0 ? true : false;
            this.searchOutput = data;
            console.log('Search Output: ', this.searchOutput);
        } else if (error) {
            console.log('Error fetching lookup data: ', error);
        }
    }

    clickHandler(event){
        let recid = event.target.getAttribute('data-recid');
        console.log('Selected Record Id: ', recid);
        if(this.validateDuplicate(recid)){
            let selectedRecord = this.searchOutput.find(currItem => currItem.Id === recid);
            let pill = {
                type: 'icon',
                label: selectedRecord.Name,
                name: recid,
                iconName: this.iconName,
                alternativeText: selectedRecord.Name
            }
            this.selectedRecords=[...this.selectedRecords, pill];
        }
    }

    get showPillContainer(){
        return this.selectedRecords.length > 0 ? true : false;
    }

    handleItemRemove(event){
        const index = event.detail.index;
        this.selectedRecords.splice(index, 1);
    }

    validateDuplicate(selectedRecord){
        let isValid = true;
        let isRecordAlreadySelected = this.selectedRecords.find(currItem => currItem.name === selectedRecord);
        if(isRecordAlreadySelected){
            isValid = false;
            this.dispatchEvent(new ShowToastEvent({
                title: "Error",
                message: "Record already selected",
                variant: "error"
            }));
        }else{
            isValid = true;
        }
        return isValid;
    }

}