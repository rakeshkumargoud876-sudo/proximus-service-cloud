public class AccountService {
    public static void serviceUpdate(set<Id>accountIds){
         List<Service_Subscription__c>sslist=new List<Service_Subscription__c>();
        List<Service_Subscription__c>serviceToUpdate=[select id,Status__c from Service_Subscription__c where
                                                	Account__c IN:accountIds];
        for(Service_Subscription__c service:serviceToUpdate){
            service.Status__c='Suspended';
            sslist.add(service);
        }
        if(!sslist.isEmpty()){
            update sslist;
        }
    }
}