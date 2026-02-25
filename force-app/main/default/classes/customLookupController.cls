public with sharing class customLookupController {
    
    @AuraEnabled(cacheable=true)
    public static List<sObject> fetchLookupData(String searchKey, String sObjectName) {
        List<sObject> sObjectList = new List<sObject>();
        if(String.isBlank(searchKey)){
            return sObjectList;
        }else{
            String key = '%' + searchKey + '%';
            String query = 'SELECT Id, Name FROM ' + sObjectName + ' WHERE Name LIKE :key LIMIT 5';
            sObjectList = Database.query(query, AccessLevel.USER_MODE);
            return sObjectList;
        }
    }
}