public class AccountTriggerHandler {
    public static void AfterUpdate(List<Account>acclist,map<Id,Account>oldacclist){
        set<Id>accids=new set<Id>();
        for(Account acc : acclist){
            Account oldacc=oldacclist.get(acc.Id);
            if(acc.Customer_Status__c=='Suspended' && oldacc.Customer_Status__c!='Suspended'){
                accids.add(acc.Id);
            }
        }
          AccountService.serviceUpdate(accids);
       
    }
}