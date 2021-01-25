'use strict';
var Common = require('./common.js');

module.exports = function(PaymentLogs) {
    PaymentLogs.disableRemoteMethodByName("upsert");
    PaymentLogs.disableRemoteMethodByName("find");
    PaymentLogs.disableRemoteMethodByName("replaceOrCreate");
    PaymentLogs.disableRemoteMethodByName("create");
  
    PaymentLogs.disableRemoteMethodByName("prototype.updateAttributes");
    PaymentLogs.disableRemoteMethodByName("findById");
    PaymentLogs.disableRemoteMethodByName("exists");
    PaymentLogs.disableRemoteMethodByName("replaceById");
    PaymentLogs.disableRemoteMethodByName("deleteById");
  
    PaymentLogs.disableRemoteMethodByName("createChangeStream");
  
    PaymentLogs.disableRemoteMethodByName("count");
    PaymentLogs.disableRemoteMethodByName("findOne");
  
    PaymentLogs.disableRemoteMethodByName("update");
    PaymentLogs.disableRemoteMethodByName("upsertWithWhere");

	PaymentLogs.getAbstractCardNumber = function(card_number) {
		return card_number;
	}
};
