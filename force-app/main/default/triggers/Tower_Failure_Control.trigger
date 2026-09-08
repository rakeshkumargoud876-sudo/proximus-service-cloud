trigger Tower_Failure_Control on Tower_Failure__e (after insert) {
    List<Case>cclst=new List<Case>();
    for(Tower_Failure__e tw : trigger.new){
        Case cc = new Case();
         cc.Subject = 'Tower Failure - ' + tw.Tower_Id__c;
        cc.Description = tw.Description__c;
        cc.Status = 'New';
        cc.Priority = 'Medium';
        cc.Origin = 'Monitoring System';
        cclst.add(cc);
        
    }
    insert cclst;
      
}