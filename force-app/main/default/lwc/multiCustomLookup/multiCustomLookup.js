import { LightningElement, wire, api } from 'lwc';
import fetchLookupData from '@salesforce/apex/customLookupController.fetchLookupData';

const DELAY = 300;
export default class MultiCustomLookup extends LightningElement {

    searchKey;
    @api objectApiName = 'Account';
    hasRecords = false;
    searchOutput=[];
    @api label ='Account';
    @api placeholder = 'Search Account...';
    delayTimeout;


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
    }
}