import { LightningElement, api, wire, track } from 'lwc';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

import ID_Con from '@salesforce/schema/Contact.Id';
import ID_Acc from '@salesforce/schema/Account.Id';

const Fields = [
    'Contact.optinvalue1__c',
    'Contact.optinvalue2__c',
    'Contact.optinvalue3__c',
    'Contact.optinvalue4__c',
    'Account.optinvalue1__pc',
    'Account.optinvalue2__pc',
    'Account.optinvalue3__pc',
    'Account.optinvalue4__pc',
];


export default class EasyOptins extends LightningElement {
    @api title;
    @api icon;
    
    @api optin_label;
    @api optout_label;

    @api opt1_title;
    @api opt1_value;
    
    @api opt2_title;
    @api opt2_value;
    
    @api opt3_title;
    @api opt3_value;
    
    @api opt4_title;
    @api opt4_value;
    
    @api recordId;
    @track record;

    @api objectApiName;
    
    @wire(getRecord, {recordId: '$recordId', optionalFields: Fields})
    record;

    
    GetValue(index)
    {
        var schema = '';

        if (this.objectApiName == 'Contact')
            schema = 'Contact.optinvalue' + index + '__c';
        else
        if (this.objectApiName == 'Account') 
            schema = 'Account.optinvalue' + index + '__pc';
        else
        {
            console.log("GetValue - Dont know who I am - " + this.objectApiName);
            return false;
        }

        var a = getFieldValue(this.record.data, schema);

        if (typeof a == 'undefined')
            return false;
        else
            return a;

    } 

    SetValue(index, value)
    {
        const fields = {};
        var schema = '';

        if (this.objectApiName === 'Contact')
        {
            fields[ID_Con.fieldApiName] = this.recordId;
            schema = 'optinvalue' + index + '__c';
        }
        else
        if (this.objectApiName === 'Account') 
        {
            fields[ID_Acc.fieldApiName] = this.recordId;
            schema = 'optinvalue' + index + '__pc';
        }
        else
            return false;

        fields[schema] = value;

        const recordInput = { fields };
        updateRecord(recordInput) 
        .then(() => {
            /*
            console.log('Object updated');
            
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Record Is Updated',
                    variant: 'sucess',
                }),
            )*/
        })
        .catch(error => {
            console.log('error' + JSON.stringify(error, null, 2));
            return false;
        });

        return true;
    }

    @api
    get getV1()
    {
        return this.GetValue(1); 
    }

    setV1(event)
    {
        return this.SetValue(1, event.toElement.checked);
    }

    @api
    get getV2()
    {
        return this.GetValue(2);
    }

    setV2(event)
    {
        return this.SetValue(2, event.toElement.checked);
    }

    @api
    get getV3()
    {
        return this.GetValue(3);
    }

    setV3(event)
    {
        return this.SetValue(3, event.toElement.checked);
    }


    @api
    get getV4()
    {
        return this.GetValue(4);
    }

    setV4(event)
    {
        return this.SetValue(4, event.toElement.checked);
    }

}