trigger AccountTrigger on Account (After Update) {
    if(trigger.isAfter && trigger.isUpdate){
        AccountTriggerHandler.AfterUpdate(trigger.new,trigger.oldmap);
    }
}