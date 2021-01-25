'use strict';
var Common = require('./common.js');
var loopback = require('loopback');

module.exports = function(Professional) {
    Professional.disableRemoteMethodByName("upsert");
    Professional.disableRemoteMethodByName("find");
    Professional.disableRemoteMethodByName("replaceOrCreate");
    Professional.disableRemoteMethodByName("create");
    Professional.disableRemoteMethodByName("prototype.updateAttributes");
    Professional.disableRemoteMethodByName("findById");
    Professional.disableRemoteMethodByName("exists");
    Professional.disableRemoteMethodByName("replaceById");
    Professional.disableRemoteMethodByName("deleteById");
    Professional.disableRemoteMethodByName("createChangeStream");
    Professional.disableRemoteMethodByName("count");
    Professional.disableRemoteMethodByName("findOne");
    Professional.disableRemoteMethodByName("update");
    Professional.disableRemoteMethodByName("upsertWithWhere");

	Professional.disableRemoteMethodByName('prototype.__get__accounts');

	Professional.disableRemoteMethodByName('prototype.__get__option');
	Professional.disableRemoteMethodByName('prototype.__delete__option');
	Professional.disableRemoteMethodByName('prototype.__findById__option');
	Professional.disableRemoteMethodByName('prototype.__create__option');
	Professional.disableRemoteMethodByName('prototype.__update__option');
	Professional.disableRemoteMethodByName('prototype.__updateById__option');
	Professional.disableRemoteMethodByName('prototype.__destroy__option');
	Professional.disableRemoteMethodByName('prototype.__destroyById__option');
	Professional.disableRemoteMethodByName('prototype.__count__option');

	Professional.disableRemoteMethodByName('prototype.__get__sections');
	Professional.disableRemoteMethodByName('prototype.__delete__sections');
	Professional.disableRemoteMethodByName('prototype.__findById__sections');
	Professional.disableRemoteMethodByName('prototype.__create__sections');
	Professional.disableRemoteMethodByName('prototype.__updateById__sections');
	Professional.disableRemoteMethodByName('prototype.__destroy__sections');
	Professional.disableRemoteMethodByName('prototype.__destroyById__sections');
	Professional.disableRemoteMethodByName('prototype.__count__sections');

	Professional.disableRemoteMethodByName('prototype.__get__jobs');
	Professional.disableRemoteMethodByName('prototype.__delete__jobs');
	Professional.disableRemoteMethodByName('prototype.__findById__jobs');
	Professional.disableRemoteMethodByName('prototype.__create__jobs');
	Professional.disableRemoteMethodByName('prototype.__updateById__jobs');
	Professional.disableRemoteMethodByName('prototype.__destroy__jobs');
	Professional.disableRemoteMethodByName('prototype.__destroyById__jobs');
	Professional.disableRemoteMethodByName('prototype.__count__jobs');
	
	Professional.disableRemoteMethodByName('prototype.__get__workdate');
	Professional.disableRemoteMethodByName('prototype.__delete__workdate');
	Professional.disableRemoteMethodByName('prototype.__findById__workdate');
	Professional.disableRemoteMethodByName('prototype.__create__workdate');
	Professional.disableRemoteMethodByName('prototype.__updateById__workdate');
	Professional.disableRemoteMethodByName('prototype.__destroy__workdate');
	Professional.disableRemoteMethodByName('prototype.__destroyById__workdate');
	Professional.disableRemoteMethodByName('prototype.__count__workdate');

	// function includeArray(keyArray, array) {
	// 	if (array.length == 0) return false;
	// 	for(let key of keyArray) {
	// 		let isFind = false;
	// 		for (let service of array) {
	// 			if (service.group_id == key) {
	// 				isFind = true;
	// 				break;
	// 			}
	// 		}
	// 		if (!isFind) return false;
	// 	}
	// 	return true;
	// }
	// Professional.searchProfessional = async(city, searchKey, findServices, limit) => {
	// 	const Accounts = Professional.app.models.Accounts;
	// 	try {
	// 		const query = {
	// 			fields: ['id', 'userId', 'realname', 'description', 'phone_number', 'status', 'photo', 'score', 'email'],
	// 			where: {
	// 				or: [
	// 					{ city: { like: searchKey, options: 'i' } },
	// 					{ street: { like: searchKey, options: 'i' } },
	// 					{ realname: { like: searchKey, options: 'i' } },
	// 				],
	// 				role: 'pro'
	// 			},
	// 			include: {
	// 				relation: "professional",
	// 				scope: {
	// 					fields: ['id', 'status', 'description', 'score'],
	// 					include: {
	// 						relation: "services",
	// 						scope: {
	// 							fields: ['id', 'group_id', 'name', 'fee'],
	// 						}
	// 					}
	// 				}
	// 			},
	// 			limit: limit
	// 		};
	// 		const accounts = await Accounts.find(query);
	// 		if (findServices && findServices.length > 0) {
	// 			const results = [];
	// 			for (let account of accounts) {
	// 				if (account.professional) {
	// 					const services = account.professional().services();
	// 					if (services.length > 0) {
	// 						if (includeArray(findServices, services)) {
	// 							results.push(account);
	// 						}
	// 					}
	// 				}
	// 			}
	// 			return Promise.resolve(Common.makeResult(true, 'success', results));
	// 		}
	// 		return Promise.resolve(Common.makeResult(true, 'success', accounts));
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	//   }
	
	//   Professional.remoteMethod('searchProfessional', {
	// 	accepts: [
	// 		{arg: 'city', type: 'string', required: false, description: 'city name'},
	// 		{arg: 'searchKey', type: 'string', required: false, description: 'search key'},
	// 		{arg: 'findServices', type: 'array', required: false, description: 'array of servicegroup idx, e.g [0, 2]'},
	// 		{arg: 'limit', type: 'number', required: false, description: ''},
	// 	],
	// 	description: [
	// 		'(client) search professional with key.\n',
	// 	],
	// 	returns: {
	// 		arg: 'res',
	// 		type: 'string',
	// 		description: [
	// 		]
	// 	},
	// 	http: {path:'/search-professional', verb: 'get'}
	// });

	
	// Professional.searchProAtMap = async(access_token, lat, lng, groupIds) => {
	// 	const Accounts = Professional.app.models.Accounts;
	// 	const here = new loopback.GeoPoint({lat: lat, lng: lng});
	// 	try {
	// 		const clientObj = await Accounts.getUserFromToken(access_token);
	// 		const query = {
	// 			fields: ['id', 'userId', 'realname', 'description', 'phone_number', 'status', 'photo', 'score', 'email'],
	// 			where: {
	// 				geoLocation: {
	// 					near: here
	// 				},
	// 				role: 'pro'
	// 			},
	// 			limit: 1000,
	// 			include: [
	// 				{
	// 					relation: "professional",
	// 					scope: {
	// 						fields: ['id', 'status', 'description', 'score'],
	// 						include: {
	// 							relation: "sections",
	// 							scope: {
	// 								fields: ['id', 'title', 'groupIds', 'isBundle'],
	// 							}
	// 						}
	// 					}
	// 				},
	// 			]
	// 		};
	// 		const pros = await Accounts.find(query);
	// 		if (pros.length == 0) {
	// 			return Promise.resolve(Common.makeResult(false, Common.RETURN_TYPE.Warning, 'there is no result', ''));
	// 		}

	// 		const before = Date.now() - 1000 * 60 * 60; // 1hour
	// 		const searchLogs = await clientObj.searchLogs.find({
	// 			where: {

	// 			},
	// 			createdAt: {
	// 				between: [before, Date.now()]
	// 			},
	// 		});
	// 		let results = [];
	// 		if (groupIds && groupIds.length > 0) {
	// 			for (let proObj of pros) {
	// 				if (proObj.professional) {
	// 					const services = proObj.professional.services();
	// 					if (services.length > 0) {
	// 						if (includeArray(groupIds, services)) {
	// 							results.push(proObj);
	// 						}
	// 					}
	// 				}
	// 			}
	// 		} else {
	// 			results = pros;
	// 		}
	// 		if (results.length > 0) {
	// 			let res_pro;
	// 			for (let pro of results) {
	// 				let isFind = false;
	// 				for (let log of searchLogs) {
	// 					if (log.proUserId == pro.userId) {
	// 						isFind = true;
	// 						break;
	// 					}
	// 				}
	// 				if (!isFind) {;
	// 					res_pro = pro;
	// 					break;
	// 				}
	// 			}
	// 			if (res_pro) {
	// 				clientObj.searchLogs.create({
	// 					clientUserId: clientObj.userId,
	// 					proUserId: pro.userId,
	// 					createdAt: Date()
	// 				})
	// 			}
	// 			return Promise.resolve(Common.makeResult(true, 'success', res_pro));
	// 		}
	// 		return Promise.resolve(Common.makeResult(false, 'there is no result', ''));
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	//   }
	
	//   Professional.remoteMethod('searchProAtMap', {
	// 	accepts: [
	// 		{arg: 'access_token', type: 'string', required: true},
	// 		{arg: 'lat', type: 'number', required: true, description: 'latitude e.g. 38.751119'},
	// 		{arg: 'lng', type: 'number', required: true, description: 'longitude e.g. -9.186468'},
	// 		{arg: 'groupIds', type: 'array', required: false, description: 'array of servicegroup id, e.g ["5eebc4f6acfd8848b13e4fba", "5eebc4f6acfd8848b13e4fbd"]'},
	// 	],
	// 	description: [
	// 		'(client) regular search.	',
	// 		'https://zpl.io/VDJP9l3'
	// 	],
	// 	returns: {
	// 		arg: 'res',
	// 		type: '[Professional]',
	// 		description: [
	// 		]
	// 	},
	// 	http: {path:'/search-pro-map', verb: 'get'}
	// });
	

	
	// Professional.addServicePicture = async(access_token, req, res, serviceId) => {
	// 	const Accounts = Professional.app.models.Accounts;
	// 	const ServiceGroup = Professional.app.models.ServiceGroup;
	// 	try {
	// 		const userObj = await Accounts.getUserFromToken(access_token);
	// 		// const group = await ServiceGroup.findById(group_id);
	// 		// if (!res) return Promise.resolve(Common.makeResult(false, 'parameter error', 'wrong group_id'));
	// 		// const proObj = await userObj.professional.get();
	// 		// if (!proObj) return Promise.resolve(Common.makeResult(false, 'error', 'have no professional info'));

	// 		// if (service_groups)
	// 		// await proObj.updateAttribute('service_groups', service_groups);
	// 		// const newService = await proObj.services.create({
	// 		// 	group_id: group_id,
	// 		// 	group_idx: group.index,
	// 		// 	name: service_name,
	// 		// 	fee: fee
	// 		// })
	// 		return Promise.resolve(Common.makeResult(true, 'success', ''));
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	//   }
	
	//   Professional.remoteMethod('addService', {
	// 	accepts: [
	// 		{arg: 'access_token', type: 'string', required: true},
    //         { arg: 'req', type: 'object', http: { source:'req' } },
    //         { arg: 'res', type: 'object', http: { source:'res' } },
	// 		{arg: 'serviceId', type: 'string', required: true, description: 'service id'},
	// 	],
	// 	description: [
	// 		'(professional) add service picture.\n',
	// 	],
	// 	returns: {
	// 		arg: 'res',
	// 		type: 'string',
	// 		description: [
	// 		]
	// 	},
	// 	http: {path:'/add-service-pict', verb: 'post'}
	// });
	

	
	// Professional.searchWithPurpleService = async(access_token, cityId, lat, lng, group_id) => {
	// 	const Accounts = Professional.app.models.Accounts;
	// 	const here = new loopback.GeoPoint({lat: lat, lng: lng});
	// 	try {
	// 		const clientObj = await Accounts.getUserFromToken(access_token);
	// 		const query = {
	// 			fields: ['id', 'userId', 'realname', 'description', 'phone_number', 'status', 'photo', 'score', 'email'],
	// 			where: {
	// 				cityId: cityId,
	// 				geoLocation: {
	// 					near: here
	// 				},
	// 				role: 'pro'
	// 			},
	// 			limit: 1000,
	// 			include: [
	// 				{
	// 					relation: "professional",
	// 					scope: {
	// 						fields: ['id', 'status', 'description', 'phone_number2', 'score'],
	// 						include: {
	// 							relation: "services",
	// 							scope: {
	// 								fields: ['id', 'group_id', 'name', 'fee'],
	// 							}
	// 						}
	// 					}
	// 				},
	// 			]
	// 		};
	// 		const pros = await Accounts.find(query);
	// 		let results = [];
	// 		let findServices = [group_id];
	// 		for (let proObj of pros) {
	// 			if (proObj.professional) {
	// 				const services = proObj.professional.services();
	// 				if (services.length > 0) {
	// 					if (includeArray(findServices, services)) {
	// 						results.push(proObj);
	// 					}
	// 				}
	// 			}
	// 		}
			
	// 		if (results.length > 0) {
	// 			let res_pro;
	// 			for (let account of results) {
	// 				let isFind = false;
	// 				for (let log of account.searchLogs) {
	// 					if (log.clientUserId == clientObj.userId) {
	// 						var diff = Math.abs(new Date() - log.createdAt);
	// 						if (diff < 1000 * 60 * 60 * 1) {
	// 							isFind = true;
	// 						}
	// 						break;
	// 					}
	// 				}
	// 				if (isFind) continue;
	// 				res_pro = account;
	// 			}
	// 			if (res_pro) {
	// 				const pro = await Accounts.findById(res_pro.id);
	// 				pro.searchLogs.create({
	// 					clientUserId: clientObj.userId,
	// 					proUserId: pro.userId,
	// 					createdAt: Date()
	// 				})
	// 				return Promise.resolve(Common.makeResult(true, 'success', res_pro));
	// 			}
	// 		}
	// 		return Promise.resolve(Common.makeResult(false, 'there is no result', ''));
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	//   }
	
	//   Professional.remoteMethod('searchWithPurpleService', {
	// 	accepts: [
	// 		{arg: 'access_token', type: 'string', required: true},
	// 		{arg: 'cityId', type: 'string', required: true, description: 'city id'},
	// 		{arg: 'lat', type: 'number', required: true, description: 'latitude'},
	// 		{arg: 'lng', type: 'number', required: true, description: 'longitude'},
	// 		{arg: 'group_id', type: 'string', required: true, description: 'service group id'},
	// 	],
	// 	description: [
	// 		'(client) search professionals with purple service.	',
	// 		'https://zpl.io/2v9R3Pj'
	// 	],
	// 	returns: {
	// 		arg: 'res',
	// 		type: '[Professional]',
	// 		description: [
	// 		]
	// 	},
	// 	http: {path:'/search-purple', verb: 'get'}
	// });

	// Professional.searchWithRedService = async(access_token, cityId, lat, lng, group_id) => {
	// 	const Accounts = Professional.app.models.Accounts;
	// 	const here = new loopback.GeoPoint({lat: lat, lng: lng});
	// 	try {
	// 		const clientObj = await Accounts.getUserFromToken(access_token);
	// 		const query = {
	// 			fields: ['id', 'userId', 'realname', 'description', 'phone_number', 'status', 'photo', 'score', 'email'],
	// 			where: {
	// 				cityId: cityId,
	// 				geoLocation: {
	// 					near: here
	// 				},
	// 				role: 'pro'
	// 			},
	// 			limit: 1000,
	// 			include: [
	// 				{
	// 					relation: "professional",
	// 					scope: {
	// 						fields: ['id', 'status', 'description', 'phone_number2', 'score'],
	// 						include: {
	// 							relation: "services",
	// 							scope: {
	// 								fields: ['id', 'group_id', 'name', 'fee'],
	// 							}
	// 						}
	// 					}
	// 				},
	// 			]
	// 		};
	// 		const pros = await Accounts.find(query);
	// 		let results = [];
	// 		let findServices = [group_id];
	// 		for (let proObj of pros) {
	// 			if (proObj.professional) {
	// 				const services = proObj.professional.services();
	// 				if (services.length > 0) {
	// 					if (includeArray(findServices, services)) {
	// 						results.push(proObj);
	// 					}
	// 				}
	// 			}
	// 		}
			
	// 		if (results.length > 0) {
	// 			let res_pro;
	// 			for (let account of results) {
	// 				let isFind = false;
	// 				for (let log of account.searchLogs) {
	// 					if (log.clientUserId == clientObj.userId) {
	// 						var diff = Math.abs(new Date() - log.createdAt);
	// 						if (diff < 1000 * 60 * 60 * 1) {
	// 							isFind = true;
	// 						}
	// 						break;
	// 					}
	// 				}
	// 				if (isFind) continue;
	// 				res_pro = account;
	// 			}
	// 			if (res_pro) {
	// 				const pro = await Accounts.findById(res_pro.id);
	// 				pro.searchLogs.create({
	// 					clientUserId: clientObj.userId,
	// 					proUserId: pro.userId,
	// 					createdAt: Date()
	// 				})
	// 				return Promise.resolve(Common.makeResult(true, 'success', res_pro));
	// 			}
	// 		}
	// 		return Promise.resolve(Common.makeResult(false, 'there is no result', ''));
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	//   }
	
	//   Professional.remoteMethod('searchWithRedService', {
	// 	accepts: [
	// 		{arg: 'access_token', type: 'string', required: true},
	// 		{arg: 'city', type: 'string', required: true, description: 'city id'},
	// 		{arg: 'lat', type: 'number', required: true, description: 'latitude'},
	// 		{arg: 'lng', type: 'number', required: true, description: 'longitude'},
	// 		{arg: 'group_id', type: 'string', required: true, description: 'service group id'},
	// 	],
	// 	description: [
	// 		'(client) search professionals with red service.	',
	// 		'https://zpl.io/a8o8nJ6'
	// 	],
	// 	returns: {
	// 		arg: 'res',
	// 		type: '[Professional]',
	// 		description: [
	// 		]
	// 	},
	// 	http: {path:'/search-red', verb: 'get'}
	// });


	
	
	// Professional.getServiceStatus = async(cityId, findServices) => {
	// 	const Services = Professional.app.models.Services;
	// 	try {
	// 		const query = {
	// 			cityId: cityId,
	// 			service_groups: { like: 'key', options: 'i' },
	// 		};
	// 		const result = [];
	// 		for (let service_name of findServices) {
	// 			query.service_groups.like = service_name;
	// 			const cnt = await Professional.count(query);
	// 			result.push({
	// 				name: service_name,
	// 				count: cnt
	// 			})
	// 		}
	// 		return Promise.resolve(Common.makeResult(true, 'success', result));
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	//   }
	
	//   Professional.remoteMethod('getServiceStatus', {
	// 	accepts: [
	// 		{arg: 'cityId', type: 'string', required: true, description: 'cityId'},
	// 		{arg: 'findServices', type: 'array', required: true, description: 'array of servicegroup title, e.g ["Manicure", "wax"]'},
	// 	],
	// 	description: [
	// 		'(client) get service number.\n',
	// 	],
	// 	returns: {
	// 		arg: 'res',
	// 		type: 'string',
	// 		description: [
	// 		]
	// 	},
	// 	http: {path:'/get-service-status', verb: 'get'}
	// });



	Professional.getProfessionInfo = async(access_token) => {
		const Accounts = Professional.app.models.Accounts;
		const Jobs = Professional.app.models.Jobs;
		const Review = Professional.app.models.Review;
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			const proInfo = await userObj.professional.getAsync();
			if (!proInfo) return Promise.resolve(Common.makeResult(false, 'account has no professional info'));
			
			const resUser = {};
			resUser.userId = userObj.userId;
			resUser.realname = userObj.realname;
			resUser.option = await userObj.option.getAsync();
			resUser.addresses = await userObj.addresses.getAsync();
			resUser.phoneNumbers = await userObj.phoneNumbers.getAsync();
			resUser.payments = await userObj.payments.getAsync();

			const sections = await proInfo.sections.find({
				fields: ['id', 'groupIds', 'title', 'isBundle'],
				limit: 100,
				include: [
					{
						relation: "services",
						scope: {
							fields: ['id', 'name', 'price', 'time'],
						}
					},
					{
						relation: "sectionPhotos",
						scope: {
							fields: ['id', 'filepath'],
						}
					}
				]
			});
			// const reviews = await Jobs.find({
			// 	fields: ['id', 'status', 'clientUserId', 'proUserId', 'modifiedAt'],
			// 	where: {
			// 		proUserId: userObj.userId,
			// 	},
			// 	limit: 100,
			// 	order: 'modifiedAt DESC',
			// 	include: [
			// 		{
			// 			relation: 'review',
			// 			scope: {
			// 				fields: ['id', 'score', 'comment', 'clientUserId'],
			// 			},
			// 			include: {
			// 				relation: 'photos',
			// 				scope: {
			// 					fields: ['favorite', 'shareSocial', 'shareOther', 'isUsedByPro', 'galleryId', 'filepath'],
			// 				}
			// 			},
			// 		},
			// 		{
			// 			relation: 'job_services',
			// 			scope: {
			// 				fields: ['id', 'sectionId', 'serviceId'],
			// 			}
			// 		}
			// 	]
			// });
			return Promise.resolve(Common.makeResult(true, 'success', {
				user: resUser,
				sections: sections,
				// reviews: reviews
			}));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Professional.remoteMethod('getProfessionInfo', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'professional token id'}
		],
		description: [
			'(pro) return professional info.	',
			'https://zpl.io/VDJerdl	',
		],
		returns: {
			arg: 'res',
			type: 'string',
			description: 'array of user info'
		},
		http: {path:'/get-proinfo', verb: 'get'}
	});



	// Professional.getAllSchedules = async(access_token) => {
	// 	const Accounts = Professional.app.models.Accounts;
	// 	const Jobs = Professional.app.models.Jobs;
	// 	try {
	// 		const userObj = await Accounts.getUserFromToken(access_token);
	// 		const proObj = await userObj.professional.get();
	// 		const jobs = await Jobs.find({
	// 			fields: ['id', 'proposeAt'],
	// 			where: {
	// 				or : [
	// 					{ status: Common.STATUS_JOB.kWaitting },
	// 					{ status: Common.STATUS_JOB.kApprovedByPro },
	// 					{ status: Common.STATUS_JOB.kFinished },
	// 					{ status: Common.STATUS_JOB.kProgressing },
	// 				],
	// 				proUserId: proObj.userId,
	// 			}
	// 		})
	// 		return Promise.resolve(Common.makeResult(true, 'success', jobs));
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	//   }
	
	//   Professional.remoteMethod('getAllSchedules', {
	// 	accepts: [
	// 		{arg: 'access_token', type: 'string', required: true, description: 'professional token id'}
	// 	],
	// 	description: [
	// 		'(professional) scheduled dates.\n',
	// 	],
	// 	returns: {
	// 		arg: 'res',
	// 		type: '[Jobs]',
	// 		description: [
	// 		]
	// 	},
	// 	http: {path:'/get-schedules-all', verb: 'get'}
	// });
	
	// Professional.getSchedulesFromMonth = async(access_token, month) => {
	// 	const Accounts = Professional.app.models.Accounts;
	// 	const Jobs = Professional.app.models.Jobs;
	// 	try {
	// 		const userObj = await Accounts.getUserFromToken(access_token);
	// 		const proObj = await userObj.professional.get();

	// 		month.setHours(0, 0, 0);
	// 		const next = new Date(month)
	// 		next.setMonth(next.getMonth() + 1)
	// 		const jobs = await Jobs.find({
	// 			fields: ['id', 'status', 'proposeAt', 'proUserId'],
	// 			where: {
	// 				or : [
	// 					{ status: Common.STATUS_JOB.kWaitting },
	// 					{ status: Common.STATUS_JOB.kApprovedByPro },
	// 					{ status: Common.STATUS_JOB.kFinished },
	// 					{ status: Common.STATUS_JOB.kProgressing },
	// 				],
	// 				proUserId: proObj.userId,
	// 				proposeAt: {
	// 					between: [month, next]
	// 				},
	// 				order: 'proposeAt ASC'
	// 			}
	// 		})
	// 		// const result = [];
	// 		// let date;
	// 		// for (let job of jobs) {
	// 		// 	if (date != job.proposeAt.getDate()) {
	// 		// 		result['proposeAt'] = proposeAt
	// 		// 		result.push(job);
	// 		// 		date = job.proposeAt.getDate();
	// 		// 	}
	// 		// }
	// 		return Promise.resolve(Common.makeResult(true, 'success', jobs));
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	//   }
	
	//   Professional.remoteMethod('getSchedulesFromMonth', {
	// 	accepts: [
	// 		{arg: 'access_token', type: 'string', required: true, description: 'professional token'},
	// 		{arg: 'month', type: 'date', required: true, description: 'date e.g "2020-05-01"'},
	// 	],
	// 	description: [
	// 		'(professional) all schedules	',
	// 		'https://zpl.io/VDJW6l3'
	// 	],
	// 	returns: {
	// 		arg: 'res',
	// 		type: 'string',
	// 		description: [
	// 			'	[',
	// 			'		{',
	// 			'			proposeAt: date',
	// 			'			id: string',
	// 			'			status: number',
	// 			'		}',
	// 			'	]',
	// 		]
	// 	},
	// 	http: {path:'/get-schedules-month', verb: 'get'}
	// });

	Professional.getSchedulesFromDate = async(access_token, date) => {
		const Accounts = Professional.app.models.Accounts;
		const Jobs = Professional.app.models.Jobs;
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			const proObj = await userObj.professional.get();

			date.setHours(0, 0, 0);
			var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
			var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			const jobs_month = await proObj.jobs.find({
				fields: ['status', 'proposeAt'],
				where: {
					proposeAt: {
						between: [firstDay, lastDay]
					}
				},
				order: 'proposeAt ASC',
				limit: 1000,
			});
			const results_month = [];
			let month = -1, dd = -1;
			for (let job of jobs_month) {
				const curMonth = job.proposeAt.getMonth();
				const curDate = job.proposeAt.getDate();
				if (month == curMonth && dd == curDate) {
				} else {
					month = curMonth;
					dd = curDate;
					results_month.push({
						month: curMonth + 1,
						date: curDate
					})
				}
			}
			
			const tommorow = new Date(date);
			tommorow.setDate(tommorow.getDate() + 1)
			const jobs = await proObj.jobs.find({
				fields: ['id', 'type', 'status', 'changed', 'cost', 'addressId', 'proposeAt', 'accountsId'],
				where: {
					// or : [
					// 	{ status: Common.STATUS_JOB.kWaitting },
					// 	{ status: Common.STATUS_JOB.kApprovedByPro },
					// 	{ status: Common.STATUS_JOB.kFinished },
					// 	{ status: Common.STATUS_JOB.kProgressing },
					// ],
					proposeAt: {
						between: [date, tommorow]
					},
				},
				include: [
					{
						relation: 'accounts',
						scope: {
							fields: ['userId', 'realname'],
						}
					},
					{
						relation: "address",
						scope: {
							fields: ['countryId', 'stateId', 'cityId', 'strAddress', 'geoLocation'],
							include: [
								{
									relation: "country",
									scope: {
										fields: ['code', 'name'],
									}
								},
								{
									relation: "state",
									scope: {
										fields: ['name'],
									}
								},
								{
									relation: "city",
									scope: {
										fields: ['name'],
									}
								},
							]
						}
					},
					{
						relation: "job_services",
						scope: {
							fields: ['id', 'serviceId', 'price'],
						}
					},
				]
			})
			return Promise.resolve(Common.makeResult(true, 'success', {
				firstDay: firstDay,
				lastDay: lastDay,
				current: date,
				month: results_month,
				date: jobs
			}));
		} catch(e) {
			return Promise.reject(e);
		}
	  }
	
	  Professional.remoteMethod('getSchedulesFromDate', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'professional token'},
			{arg: 'date', type: 'date', required: true, description: 'date e.g "2020-02-28"'},
		],
		description: [
			'(professional) schedules in specific date.	',
			'https://zpl.io/VKZyWz8	'
		],
		returns: {
			arg: 'res',
			type: '[Jobs]',
			description: [
			]
		},
		http: {path:'/get-schedules-date', verb: 'get'}
	});

	
	Professional.getFinancesAll = async(access_token) => {
		const Accounts = Professional.app.models.Accounts;
		const Jobs = Professional.app.models.Jobs;
		try {
			const proUser = await Accounts.getUserFromToken(access_token);
			const proObj = await proUser.professional.get();
			let jobs = await proObj.jobs.find({
				fields: ['status', 'proposeAt'],
				where: {
				},
				order: 'proposeAt DESC',
				limit: 1000,
			});
			let results = [];
			let year = 0, month = -1;
			for (let job of jobs) {
				const curYear = job.proposeAt.getFullYear();
				const curMonth = job.proposeAt.getMonth();
				if (year == curYear && month == curMonth) {
				} else {
					year = curYear;
					month = curMonth;
					results.push({
						year: curYear,
						month: curMonth + 1
					})
				}
			}
			return Promise.resolve(Common.makeResult(true, 'success', results));
		} catch(e) {
			return Promise.reject(e);
		}
	  }
	
	  Professional.remoteMethod('getFinancesAll', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'professional token'},
		],
		description: [
			'(professional) finances of professionals.	',
			'https://zpl.io/V0QwdZE	'
		],
		returns: {
			arg: 'res',
			type: 'string',
			description: [
			]
		},
		http: {path:'/get-finance-all', verb: 'get'}
	});

	Professional.getFinancesMonth = async(access_token, month) => {
		const Accounts = Professional.app.models.Accounts;
		const Jobs = Professional.app.models.Jobs;
		try {
			const proUser = await Accounts.getUserFromToken(access_token);
			const proObj = await proUser.professional.get();
			const month_first = new Date(month);
			month_first.setDate(0);
			const month_end = new Date(month);
			month_end.setMonth(month_end.getMonth() + 1);
			month_end.setDate(0);

			let jobs = await proObj.jobs.find({
				fields: ['id', 'status', 'proposeAt', 'accountsId', 'cost'],
				where: {
					proposeAt: {
						between: [month_first, month_end]
					},
				},
				order: 'proposeAt DESC',
				limit: 1000,
				include: [
					{
						relation: 'accounts',
						scope: {
							fields: ['userId', 'realname'],
						}
					},
					{
						relation: "job_services",
						scope: {
							fields: ['id', 'serviceId', 'price'],
						}
					},
					// {
					// 	relation: "payment_logs",
					// 	scope: {
					// 		fields: ['id', 'payment_no', 'amount'],
					// 	}
					// }
				]
			});
			let canceled = 0, plan = 0, received = 0;
			for (let job of jobs) {
				if (job.status == Common.STATUS_JOB.kFinished) {
					received += job.cost;
				} else if (job.status == Common.STATUS_JOB.kCanceldByClient || job.status == Common.STATUS_JOB.kDeclinedByPro) {
					canceled += job.cost;
				} else {
					plan += job.cost;
				}
			}
			return Promise.resolve(Common.makeResult(true, 'success', {
				canceled: canceled,
				plan: plan,
				received: received,
				jobs: jobs
			}));
		} catch(e) {
			return Promise.reject(e);
		}
	  }
	
	  Professional.remoteMethod('getFinancesMonth', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'professional token'},
			{arg: 'month', type: 'date', required: true, description: 'date e.g: "2020-02-01"'},
		],
		description: [
			'(professional) finances of professionals.	',
			'https://zpl.io/VqjL9OZ'
		],
		returns: {
			arg: 'res',
			type: 'string',
			description: [
			]
		},
		http: {path:'/get-finance-month', verb: 'get'}
	});

	
	Professional.getHistoryAll = async(access_token) => {
		const Accounts = Professional.app.models.Accounts;
		const Jobs = Professional.app.models.Jobs;
		try {
			const proUser = await Accounts.getUserFromToken(access_token);
			const proObj = await proUser.professional.get();
			let jobs = await proObj.jobs.find({
				fields: ['status', 'proposeAt'],
				where: {
				},
				order: 'proposeAt DESC',
				limit: 1000,
			});
			let results = [];
			let year = 0, month = -1;
			for (let job of jobs) {
				const curYear = job.proposeAt.getFullYear();
				const curMonth = job.proposeAt.getMonth();
				if (year == curYear && month == curMonth) {
				} else {
					year = curYear;
					month = curMonth;
					results.push({
						year: curYear,
						month: curMonth + 1
					})
				}
			}
			return Promise.resolve(Common.makeResult(true, 'success', results));
		} catch(e) {
			return Promise.reject(e);
		}
	  }
	
	  Professional.remoteMethod('getHistoryAll', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'professional token id'},
		],
		description: [
			'(professional) get all history.	',
			'https://zpl.io/aBJLGGk'
		],
		returns: {
			arg: 'res',
			type: 'string',
			description: [
			]
		},
		http: {path:'/get-history-all', verb: 'get'}
	});
	
	Professional.getHistoryMonth = async(access_token, month) => {
		const Accounts = Professional.app.models.Accounts;
		const Jobs = Professional.app.models.Jobs;
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			const proObj = await userObj.professional.get();
			const month_first = new Date(month);
			month_first.setDate(0);
			const month_end = new Date(month);
			month_end.setMonth(month_end.getMonth() + 1);
			month_end.setDate(0);
			
			const jobs = await proObj.jobs.find({
				fields: ['id', 'type', 'status', 'changed', 'cost', 'addressId', 'proposeAt', 'accountsId', 'paymentId'],
				where: {
					proUserId: proObj.userId,
					proposeAt: {
						between: [month_first, month_end]
					},
				},
				order: 'proposeAt DESC',
				include: [
					{
						relation: 'accounts',
						scope: {
							fields: ['id', 'userId', 'realname', 'picture'],
						}
					},
					{
						relation: "address",
						scope: {
							fields: ['countryId', 'stateId', 'cityId', 'strAddress', 'geoLocation'],
							include: [
								{
									relation: "country",
									scope: {
										fields: ['code', 'name'],
									}
								},
								{
									relation: "state",
									scope: {
										fields: ['name'],
									}
								},
								{
									relation: "city",
									scope: {
										fields: ['name'],
									}
								},
							]
						}
					},
					{
						relation: "job_services",
						scope: {
							fields: ['id', 'serviceId', 'price'],
						}
					},
					{
						relation: 'payment',
						scope: {
							fields: ['type', 'card_number']
						}
					}
				]
			});
			
			let canceled = 0, plan = 0, received = 0;
			for (let job of jobs) {
				if (job.status == Common.STATUS_JOB.kFinished) {
					received++;
				} else if (job.status == Common.STATUS_JOB.kCanceldByClient || job.status == Common.STATUS_JOB.kDeclinedByPro) {
					canceled++;
				} else {
					plan++;
				}
			}
			return Promise.resolve(Common.makeResult(true, 'success', {
				canceled: canceled,
				plan: plan,
				canceled: received,
				jobs: jobs
			}));
		} catch(e) {
			return Promise.reject(e);
		}
	  }
	
	  Professional.remoteMethod('getHistoryMonth', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'professional token id'},
			{arg: 'month', type: 'date', required: true, description: 'date 2020-05-01'},
		],
		description: [
			'(professional) get history.	',
			'https://zpl.io/blwLW6e'
		],
		returns: {
			arg: 'res',
			type: 'string',
			description: [
			]
		},
		http: {path:'/get-history-month', verb: 'get'}
	});

	
	Professional.getActionCenter = async(access_token, isArchieved) => {
		const Accounts = Professional.app.models.Accounts;
		try {
			const proUser = await Accounts.getUserFromToken(access_token);
			const proObj = await proUser.professional.getAsync();
			const query = {
				fields: ['id', 'type', 'status', 'proUserId', 'comment', 'addressId', 'proposeAt', 'accountsId', 'professionalId', 'cost', 'isArchieved'],
				where: {
					// or: [
					// 	{ status: Common.STATUS_JOB.kWaitting},
					// 	{ status: Common.STATUS_JOB.kApprovedByPro},
					// 	{ status: Common.STATUS_JOB.kOnHoldByPro},
					// 	{ status: Common.STATUS_JOB.kOnGoing},
					// ]
				},
				include: [
					{
						relation: 'accounts',
						scope: {
							fields: ['id', 'userId', 'realname', 'picture'],
						}
					},
					{
						relation: "address",
						scope: {
							fields: ['countryId', 'stateId', 'cityId', 'strAddress', 'geoLocation'],
							include: [
								{
									relation: "country",
									scope: {
										fields: ['code', 'name'],
									}
								},
								{
									relation: "state",
									scope: {
										fields: ['name'],
									}
								},
								{
									relation: "city",
									scope: {
										fields: ['name'],
									}
								},
							]
						}
					},
					{
						relation: 'job_services',
						scope: {
							fields: ['id', 'servicesId', 'name', 'price', 'time', 'createdAt'],	
							include: {
								relation: 'services',
								scope: {
									fields: ['id', 'serviceSectionId'],
									include: {
										relation: 'serviceSection',
										scope: {
											fields: ['id', 'groupId', 'title', 'icon', 'isBundle'],
										}
									},
								}
							}
						}
					}
				]
			}
			if (isArchieved) {
				query.where = {
					isArchieved: isArchieved
				}
			}
			const jobObj = await proObj.jobs.find(query);
			return Promise.resolve(Common.makeResult(true, jobObj));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Professional.remoteMethod('getActionCenter', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'professional token id'},
			{arg: 'isArchieved', type: 'boolean', required: true, description: 'false: actived, true: archived'}
		],
		description: [
			'(pro) return job infos at action center.	',
			'https://zpl.io/a35kYr8'
		],
		returns: {
			arg: 'res',
			type: '[Jobs]',
			description: 'job'
		},
		http: {path:'/get-actioncenter', verb: 'get'}
	});

	Professional.updateCostActionCenter = async(access_token, jobId, cost) => {
		const Accounts = Professional.app.models.Accounts;
		try {
			const proUser = await Accounts.getUserFromToken(access_token);
			const proObj = await proUser.professional.getAsync();
			const jobObj = await proObj.jobs.findById(jobId);
			const result = await jobObj.updateAttributes({
				cost: cost
			});
			return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success, result));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Professional.remoteMethod('updateCostActionCenter', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'professional token id'},
			{arg: 'jobId', type: 'string', required: true, description: 'Jobs id e.g "5ef50a9a038b3c34bf442c93"'},
			{arg: 'cost', type: 'number', required: true, description: 'discounted cost'}
		],
		description: [
			'(pro) discount at action center.	',
			'https://zpl.io/VKRDA8R	'
		],
		returns: {
			arg: 'res',
			type: 'Jobs',
			description: 'job'
		},
		http: {path:'/update-cost-pro', verb: 'post'}
	});

	Professional.updateArchiveActionCenter = async(access_token, jobId, isArchieved) => {
		const Accounts = Professional.app.models.Accounts;
		try {
			const proUser = await Accounts.getUserFromToken(access_token);
			const proObj = await proUser.professional.getAsync();
			const jobObj = await proObj.jobs.findById(jobId);
			const result = await jobObj.updateAttributes({
				isArchieved: isArchieved
			});
			return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success, result));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Professional.remoteMethod('updateArchiveActionCenter', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'professional token id'},
			{arg: 'jobId', type: 'string', required: true, description: 'Jobs id e.g "5ef50a9a038b3c34bf442c93"'},
			{arg: 'isArchieved', type: 'boolean', required: true, description: 'archive'},
		],
		description: [
			'(pro) archive at action center.	',
			'https://zpl.io/VKRDA8R	'
		],
		returns: {
			arg: 'res',
			type: 'Jobs',
			description: 'job'
		},
		http: {path:'/update-archive-pro', verb: 'post'}
	});
};
