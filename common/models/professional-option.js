'use strict';

var Common = require('./common.js');

module.exports = function(ProfessionalOption) {

	ProfessionalOption.disableRemoteMethodByName("upsert");                               // disables PATCH /MyUsers
	ProfessionalOption.disableRemoteMethodByName("find");                                 // disables GET /MyUsers
	ProfessionalOption.disableRemoteMethodByName("replaceOrCreate");                      // disables PUT /MyUsers
	ProfessionalOption.disableRemoteMethodByName("create");                               // disables POST /MyUsers
	ProfessionalOption.disableRemoteMethodByName("prototype.updateAttributes");           // disables PATCH /MyUsers/{id}
	ProfessionalOption.disableRemoteMethodByName("findById");                             // disables GET /MyUsers/{id}
	ProfessionalOption.disableRemoteMethodByName("exists");                               // disables HEAD /MyUsers/{id}
	ProfessionalOption.disableRemoteMethodByName("replaceById");                          // disables PUT /MyUsers/{id}
	ProfessionalOption.disableRemoteMethodByName("deleteById");                           // disables DELETE /MyUsers/{id}
	ProfessionalOption.disableRemoteMethodByName("createChangeStream");                   // disable GET and POST /MyUsers/change-stream
	ProfessionalOption.disableRemoteMethodByName("count");                                // disables GET /MyUsers/count
	ProfessionalOption.disableRemoteMethodByName("findOne");                              // disables GET /MyUsers/findOne
	ProfessionalOption.disableRemoteMethodByName("update");                               // disables POST /MyUsers/update
	ProfessionalOption.disableRemoteMethodByName("upsertWithWhere");                      // disables POST /MyUsers/upsertWithWhere

	ProfessionalOption.updateWatermarks = async(access_token, index, isEnable) => {
		const Accounts = ProfessionalOption.app.models.Accounts;
		try {
			const pro = await Accounts.getUserFromToken(access_token);
			const proObj = await pro.professional.getAsync();
			if (!proObj) return Promise.resolve(Common.RETURN_EXCEPTION.Error_NoPro());
			
			let proOption = await proObj.option.get();
			if (!proOption) proOption = await proObj.option.create();
			let result;
			switch(index) {
				case 0:
					result = await proOption.updateAttribute('wmark_name', isEnable);
					break;
				case 1:
					result = await proOption.updateAttribute('wmark_facebook', isEnable);
					break;
				case 2:
					result = await proOption.updateAttribute('wmark_pinterest', isEnable);
					break;
				case 3:
					result = await proOption.updateAttribute('wmark_twitter', isEnable);
					break;
				case 4:
					result = await proOption.updateAttribute('wmark_instagram', isEnable);
					break;
			}
			return Promise.resolve(Common.makeResult(true, 'success', result));
		} catch(e) {
			return Promise.reject(e);
		}
	};

	ProfessionalOption.remoteMethod('updateWatermarks', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'access token'},
			{arg: 'index', type: 'number', required: true, description: 'option index(0: your name, 1: facebook, 2: pinterest, 3: twitter, 4: instagram)'},
			{arg: 'isEnable', type: 'boolean', required: true, description: ''},
		],
		description: [
			'(pro) https://zpl.io/beE8BNl',
		],
		returns: {
			arg: 'res',
			type: 'ProfessionalOption',
			description: [
				''
			]
		},
		http: {path:'/update-watermarks', verb: 'post'}
	});

	
	ProfessionalOption.updateExtraFees = async(access_token, index, value) => {
		const Accounts = ProfessionalOption.app.models.Accounts;
		try {
			const pro = await Accounts.getUserFromToken(access_token);
			const proObj = await pro.professional.getAsync();
			if (!proObj) return Promise.resolve(Common.RETURN_EXCEPTION.Error_NoPro());
			
			let proOption = await proObj.option.get();
			if (!proOption) proOption = await proObj.option.create();
			let result;
			switch(index) {
				case 0:
					result = await proOption.updateAttribute('exfee_nonworkday', value);
					break;
				case 1:
					result = await proOption.updateAttribute('exfee_redservice', value);
					break;
				case 2:
					result = await proOption.updateAttribute('exfee_dislocation', value);
					break;
				case 3:
					result = await proOption.updateAttribute('exfee_cancelserv', value);
					break;
				case 4:
					result = await proOption.updateAttribute('exfee_refund', value);
					break;
				case 5:
					result = await proOption.updateAttribute('exfee_charge', value);
					break;
			}
			return Promise.resolve(Common.makeResult(true, 'success', result));
		} catch(e) {
			return Promise.reject(e);
		}
	};

	ProfessionalOption.remoteMethod('updateExtraFees', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'access token'},
			{arg: 'index', type: 'number', required: true, description: 'option index(0: non working day, 1: red service, 2: dislocation, 3: cancel a service, 4: refund, 5: charge)'},
			{arg: 'value', type: 'number', required: true, description: 'option value'},
		],
		description: [
			'(pro) https://zpl.io/VYvJrPJ',
		],
		returns: {
			arg: 'res',
			type: 'ProfessionalOption',
			description: [
				''
			]
		},
		http: {path:'/update-exfees', verb: 'post'}
	});

	function getNextDayOfWeek(date, dayOfWeek) {
		// Code to check that date and dayOfWeek are valid left as an exercise ;)
		var resultDate = new Date(date.getTime());
		resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
		return resultDate;
	}
	function dateDiffInDays(a, b) {
		const _MS_PER_DAY = 1000 * 60 * 60 * 24;
		// Discard the time and time-zone information.
		const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
	  
		return Math.floor((utc2 - utc1) / _MS_PER_DAY);
	}
	ProfessionalOption.getNextDate = (paymode, weekday, paydate) => {
		let result = new Date();
		const now = new Date();
		if (paymode == 0) { 
			result.setDate(now.getDate() + 1);
		} else if (paymode == 1) {
			result = getNextDayOfWeek(now, weekday);
		} else if (paymode == 2) {
			const diffDay = dateDiffInDays(paydate, now);
			if (diffDay < 0) {
				result = paydate;
			} else {
				result.setDate(paydate.getDate() + parseInt(diffDay / 14) * 14 + 14);
			}
		} else if (paymode == 3) {
			result = new Date(paydate.getTime());
			result.setMonth(now.getMonth() + 1);
		}
		result.setHours(0, 0, 0);
		return result;
	}
	
	ProfessionalOption.getPaymentOption = async(access_token) => {
		const Accounts = ProfessionalOption.app.models.Accounts;
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			const proObj = await userObj.professional.get();
			const payment = await userObj.payments.getAsync();
			let proOption = await proObj.option.get();
			if (!proOption) proOption = await proObj.option.create();
			
			const nextDate = ProfessionalOption.getNextDate(proOption.paymode, proOption.weekday, proOption.paydate);
			return Promise.resolve(Common.makeResult(true, 'success', {
				payments: payment,
				paymode: proOption.paymode,
				weekday: proOption.weekday,
				paydate: proOption.paydate,
				nextDate: nextDate
			}));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	ProfessionalOption.remoteMethod('getPaymentOption', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true},
		],
		description: [
			'(pro) get payment method and day. 	',
			'https://zpl.io/br57EY1'
		],
		returns: {
			arg: 'res',
			type: 'object',
			description: ''
		},
		http: {path:'/get-payment', verb: 'get'}
	});

	
	ProfessionalOption.updateOptionWeekly = async(access_token, paymode, weekday) => {
		const Accounts = ProfessionalOption.app.models.Accounts;
		try {
			if (paymode != 0 && paymode != 1) return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.ERROR_PARAMETER, 'weekday is 0 or 1'));
			const userObj = await Accounts.getUserFromToken(access_token);
			const proObj = await userObj.professional.get();
			let proOption = await proObj.option.get();
			if (!proOption) proOption = await proObj.option.create();
			proOption = await proOption.updateAttributes({
				paymode: paymode,
				weekday: weekday
			});			
			return Promise.resolve(Common.makeResult(true, 'success', proOption));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	ProfessionalOption.remoteMethod('updateOptionWeekly', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true},
			{arg: 'paymode', type: 'number', required: true, "description": "0: daily, 1: weekly"},
			{arg: 'weekday', type: 'number', required: true, "description": "daily: 0,  weekly: day(0-6)"},
		],
		description: [
			'(pro) update payment options of professional. 	',
			'https://zpl.io/br57EY1'
		],
		returns: {
			arg: 'res',
			type: 'ProfessionalOption',
			description: ''
		},
		http: {path:'/update-weekly', verb: 'get'}
	});


	ProfessionalOption.updateOptionDate = async(access_token, paymode, paydate) => {
		const Accounts = ProfessionalOption.app.models.Accounts;
		try {
			if (paymode != 2 && paymode != 3) return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.ERROR_PARAMETER, 'weekday is 2 or 3'));
			paydate.setHours(0, 0, 0);
			const userObj = await Accounts.getUserFromToken(access_token);
			const proObj = await userObj.professional.get();
			let proOption = await proObj.option.get();
			if (!proOption) proOption = await proObj.option.create();
			proOption = await proOption.updateAttributes({
				paymode: paymode,
				paydate: paydate
			});			
			return Promise.resolve(Common.makeResult(true, 'success', proOption));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	ProfessionalOption.remoteMethod('updateOptionDate', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true},
			{arg: 'paymode', type: 'number', required: true, "description": "2: 2weeks, 3: monthly"},
			{arg: 'paydate', type: 'date', required: true, "description": 'e.g "2020-02-01"'},
		],
		description: [
			'(pro) update payment options of professional. 	2weeks, monthly',
			'https://zpl.io/br57EY1'
		],
		returns: {
			arg: 'res',
			type: 'ProfessionalOption',
			description: ''
		},
		http: {path:'/update-date', verb: 'get'}
	});
};
