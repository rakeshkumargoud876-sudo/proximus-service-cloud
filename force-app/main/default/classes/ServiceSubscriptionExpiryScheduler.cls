global class ServiceSubscriptionExpiryScheduler implements schedulable {
    global void execute (schedulableContext sc){
        Database.executebatch(new ServiceSubscriptionExpiryBatch(),200);
    }
}