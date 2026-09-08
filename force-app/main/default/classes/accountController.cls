public with sharing class accountController {
    @AuraEnabled
    public static void createAccount(String accName) {
     Account acc = new Account();
     acc.Name = accName;
     insert acc;
    }
}