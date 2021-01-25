'use strict';

var Common = require('./common.js');
var loopback = require('loopback');
var request = require('async-request');


module.exports = function(Accounts) {
	Accounts.disableRemoteMethodByName("upsert");                               // disables PATCH /MyUsers
	Accounts.disableRemoteMethodByName("find");                                 // disables GET /MyUsers
	Accounts.disableRemoteMethodByName("replaceOrCreate");                      // disables PUT /MyUsers
	Accounts.disableRemoteMethodByName("create");                               // disables POST /MyUsers
	Accounts.disableRemoteMethodByName("prototype.updateAttributes");           // disables PATCH /MyUsers/{id}
	Accounts.disableRemoteMethodByName("findById");                             // disables GET /MyUsers/{id}
	Accounts.disableRemoteMethodByName("exists");                               // disables HEAD /MyUsers/{id}
	Accounts.disableRemoteMethodByName("replaceById");                          // disables PUT /MyUsers/{id}
	Accounts.disableRemoteMethodByName("deleteById");                           // disables DELETE /MyUsers/{id}

	Accounts.disableRemoteMethodByName('prototype.__get__accessTokens');        // disable GET /MyUsers/{id}/accessTokens
	Accounts.disableRemoteMethodByName('prototype.__create__accessTokens');     // disable POST /MyUsers/{id}/accessTokens
	Accounts.disableRemoteMethodByName('prototype.__delete__accessTokens');     // disable DELETE /MyUsers/{id}/accessTokens
	Accounts.disableRemoteMethodByName('prototype.__findById__accessTokens');   // disable GET /MyUsers/{id}/accessTokens/{fk}
	Accounts.disableRemoteMethodByName('prototype.__updateById__accessTokens'); // disable PUT /MyUsers/{id}/accessTokens/{fk}
	Accounts.disableRemoteMethodByName('prototype.__destroyById__accessTokens');// disable DELETE /MyUsers/{id}/accessTokens/{fk}
	Accounts.disableRemoteMethodByName('prototype.__count__accessTokens');      // disable  GET /MyUsers/{id}/accessTokens/count

	Accounts.disableRemoteMethodByName("prototype.verify");                     // disable POST /MyUsers/{id}/verify
	Accounts.disableRemoteMethodByName("changePassword");                       // disable POST /MyUsers/change-password
	Accounts.disableRemoteMethodByName("createChangeStream");                   // disable GET and POST /MyUsers/change-stream

	Accounts.disableRemoteMethodByName("confirm");                              // disables GET /MyUsers/confirm
	Accounts.disableRemoteMethodByName("count");                                // disables GET /MyUsers/count
	Accounts.disableRemoteMethodByName("findOne");                              // disables GET /MyUsers/findOne
	Accounts.disableRemoteMethodByName("login");                                // disables POST /MyUsers/login
	Accounts.disableRemoteMethodByName("logout");                               // disables POST /MyUsers/logout
	Accounts.disableRemoteMethodByName("resetPassword");                        // disables POST /MyUsers/reset
	Accounts.disableRemoteMethodByName("setPassword");                          // disables POST /MyUsers/reset-password
	Accounts.disableRemoteMethodByName("update");                               // disables POST /MyUsers/update
	Accounts.disableRemoteMethodByName("upsertWithWhere");                      // disables POST /MyUsers/upsertWithWhere

	Accounts.disableRemoteMethodByName('prototype.__get__option');
	Accounts.disableRemoteMethodByName('prototype.__create__option');
	Accounts.disableRemoteMethodByName('prototype.__delete__option');
	Accounts.disableRemoteMethodByName('prototype.__destroy__option');
	Accounts.disableRemoteMethodByName('prototype.__findById__option');
	Accounts.disableRemoteMethodByName('prototype.__update__option');
	Accounts.disableRemoteMethodByName('prototype.__updateById__option');
	Accounts.disableRemoteMethodByName('prototype.__destroyById__option');
	Accounts.disableRemoteMethodByName('prototype.__count__option');
	
	Accounts.disableRemoteMethodByName('prototype.__get__photos');
	Accounts.disableRemoteMethodByName('prototype.__create__photos');
	Accounts.disableRemoteMethodByName('prototype.__delete__photos');
	Accounts.disableRemoteMethodByName('prototype.__findById__photos');
	Accounts.disableRemoteMethodByName('prototype.__updateById__photos');
	Accounts.disableRemoteMethodByName('prototype.__destroyById__photos');
	Accounts.disableRemoteMethodByName('prototype.__count__photos');

	Accounts.disableRemoteMethodByName('prototype.__get__jobs');
	Accounts.disableRemoteMethodByName('prototype.__create__jobs');
	Accounts.disableRemoteMethodByName('prototype.__delete__jobs');
	Accounts.disableRemoteMethodByName('prototype.__findById__jobs');
	Accounts.disableRemoteMethodByName('prototype.__updateById__jobs');
	Accounts.disableRemoteMethodByName('prototype.__destroyById__jobs');
	Accounts.disableRemoteMethodByName('prototype.__count__jobs');

	Accounts.disableRemoteMethodByName('prototype.__get__client');
	Accounts.disableRemoteMethodByName('prototype.__create__client');
	Accounts.disableRemoteMethodByName('prototype.__delete__client');
	Accounts.disableRemoteMethodByName('prototype.__findById__client');
	Accounts.disableRemoteMethodByName('prototype.__update__client');
	Accounts.disableRemoteMethodByName('prototype.__updateById__client');
	Accounts.disableRemoteMethodByName('prototype.__destroy__client');
	Accounts.disableRemoteMethodByName('prototype.__destroyById__client');
	Accounts.disableRemoteMethodByName('prototype.__count__client');

	Accounts.disableRemoteMethodByName('prototype.__get__professional');
	Accounts.disableRemoteMethodByName('prototype.__create__professional');
	Accounts.disableRemoteMethodByName('prototype.__delete__professional');
	Accounts.disableRemoteMethodByName('prototype.__findById__professional');
	Accounts.disableRemoteMethodByName('prototype.__update__professional');
	Accounts.disableRemoteMethodByName('prototype.__updateById__professional');
	Accounts.disableRemoteMethodByName('prototype.__destroy__professional');
	Accounts.disableRemoteMethodByName('prototype.__destroyById__professional');
	Accounts.disableRemoteMethodByName('prototype.__count__professional');

	Accounts.disableRemoteMethodByName('prototype.__get__searchLogs');
	Accounts.disableRemoteMethodByName('prototype.__create__searchLogs');
	Accounts.disableRemoteMethodByName('prototype.__delete__searchLogs');
	Accounts.disableRemoteMethodByName('prototype.__findById__searchLogs');
	Accounts.disableRemoteMethodByName('prototype.__updateById__searchLogs');
	Accounts.disableRemoteMethodByName('prototype.__destroyById__searchLogs');
	Accounts.disableRemoteMethodByName('prototype.__count__searchLogs');

	Accounts.disableRemoteMethodByName('prototype.__get__payments');
	Accounts.disableRemoteMethodByName('prototype.__create__payments');
	Accounts.disableRemoteMethodByName('prototype.__delete__payments');
	Accounts.disableRemoteMethodByName('prototype.__findById__payments');
	Accounts.disableRemoteMethodByName('prototype.__updateById__payments');
	Accounts.disableRemoteMethodByName('prototype.__destroyById__payments');
	Accounts.disableRemoteMethodByName('prototype.__count__payments');

	Accounts.disableRemoteMethodByName('prototype.__get__phoneNumbers');
	Accounts.disableRemoteMethodByName('prototype.__create__phoneNumbers');
	Accounts.disableRemoteMethodByName('prototype.__delete__phoneNumbers');
	Accounts.disableRemoteMethodByName('prototype.__findById__phoneNumbers');
	Accounts.disableRemoteMethodByName('prototype.__updateById__phoneNumbers');
	Accounts.disableRemoteMethodByName('prototype.__destroyById__phoneNumbers');
	Accounts.disableRemoteMethodByName('prototype.__count__phoneNumbers');
	
	Accounts.disableRemoteMethodByName('prototype.__get__addresses');
	Accounts.disableRemoteMethodByName('prototype.__create__addresses');
	Accounts.disableRemoteMethodByName('prototype.__delete__addresses');
	Accounts.disableRemoteMethodByName('prototype.__findById__addresses');
	Accounts.disableRemoteMethodByName('prototype.__updateById__addresses');
	Accounts.disableRemoteMethodByName('prototype.__destroyById__addresses');
	Accounts.disableRemoteMethodByName('prototype.__count__addresses');

	Accounts.disableRemoteMethodByName('prototype.__get__user_log');
	Accounts.disableRemoteMethodByName('prototype.__create__user_log');
	Accounts.disableRemoteMethodByName('prototype.__delete__user_log');
	Accounts.disableRemoteMethodByName('prototype.__findById__user_log');
	Accounts.disableRemoteMethodByName('prototype.__updateById__user_log');
	Accounts.disableRemoteMethodByName('prototype.__destroyById__user_log');
	Accounts.disableRemoteMethodByName('prototype.__count__user_log');

	Accounts.disableRemoteMethodByName('prototype.__get__firebase_tokens');
	Accounts.disableRemoteMethodByName('prototype.__create__firebase_tokens');
	Accounts.disableRemoteMethodByName('prototype.__delete__firebase_tokens');
	Accounts.disableRemoteMethodByName('prototype.__findById__firebase_tokens');
	Accounts.disableRemoteMethodByName('prototype.__update__firebase_tokens');
	Accounts.disableRemoteMethodByName('prototype.__updateById__firebase_tokens');
	Accounts.disableRemoteMethodByName('prototype.__destroy__firebase_tokens');
	Accounts.disableRemoteMethodByName('prototype.__destroyById__firebase_tokens');
	Accounts.disableRemoteMethodByName('prototype.__count__firebase_tokens');

	Accounts.disableRemoteMethodByName('prototype.__get__userPicture');
	Accounts.disableRemoteMethodByName('prototype.__create__userPicture');
	Accounts.disableRemoteMethodByName('prototype.__delete__userPicture');
	Accounts.disableRemoteMethodByName('prototype.__findById__userPicture');
	Accounts.disableRemoteMethodByName('prototype.__update__userPicture');
	Accounts.disableRemoteMethodByName('prototype.__updateById__userPicture');
	Accounts.disableRemoteMethodByName('prototype.__destroy__userPicture');
	Accounts.disableRemoteMethodByName('prototype.__destroyById__userPicture');
	Accounts.disableRemoteMethodByName('prototype.__count__userPicture');

	// logout
	Accounts.logOutUser = async(access_token) => {
		try {
			await Accounts.logout(access_token);
			return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Accounts.remoteMethod('logOutUser', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true},
		],
		description: [
			'(every) LogOut'
		],
		returns: {arg: 'res', type: 'ResSchema_Common'},
		http: {path:'/logOutUser', verb: 'post'}
	});

	Accounts.createRole = async(email, roleName) => {
		var Role = Accounts.app.models.Role;
		var RoleMapping = Accounts.app.models.RoleMapping;
		try {
			//create the admin role
			const role = await Role.upsertWithWhere({ name: roleName }, { name: roleName });
			const query = {
				where: {
					principalId: email
				}
			}
			const data = {
				principalType: RoleMapping.USER,
				principalId: email,
				roleId: role.id
			}
			let principal = await RoleMapping.findOne(query);
			if (principal) {
				principal = principal.updateAttribute('roleId', role.id);
				return Promise.resolve(Common.makeResult(true, 'update Principal', principal));
			} else {
				principal = await role.principals.create({
					principalType: RoleMapping.USER,
					principalId: email
				});
				return Promise.resolve(Common.makeResult(true, 'create Principal', principal));
			}
		} catch(e) {
			return Promise.reject(e);
		}
	}

	// login with phone number
	// Accounts.loginUserWithPhone = async(req, phone_number, password) => {
	// 	try {
	// 		const query = {
	// 			where: {
	// 				phone_number: phone_number
	// 			}
	// 		}
	// 		const account = await Accounts.findOne(query);
	// 		if (!account) return Promise.resolve(Common.makeResult(false, 'wrong phone number'));
	// 		const res = await Accounts.loginUser(req, account.email, password);
	// 		if (!res.success) {
	// 			return Promise.resolve(Common.makeResult(false, res.content));
	// 		} else {
	// 			return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success, res.result));
	// 		}
	// 	} catch(e) {
	// 		if (e.code == "LOGIN_FAILED") {
	// 			return Promise.resolve(Common.makeResult(false, 'login failed'));
	// 		}
	// 		return Promise.reject(e);
	// 	}
	// };
	// Accounts.remoteMethod('loginUserWithPhone', {
	// 	accepts: [
	// 		{arg: 'req', type: 'object', http: { source:'req' }},
	// 		{arg: 'phone_number', type: 'string', required: true, description: 'phone number'},
	// 		{arg: 'password', type: 'string', required: true, description: 'password'},
	// 	],
	// 	description: [
	// 		'(every) User Login with phone number',
	// 	],
	// 	returns: {
	// 		arg: 'res',
	// 		type: 'ResSchema_LoginUser',
	// 		description: [
	// 			'return user info.\n'
	// 		]
	// 	},
	// 	http: {path:'/login-phone', verb: 'post'}
	// });

	Accounts.registerAdmin = async(req, email, password, realname, deviceType, fb_token) => {
		try {
			const data = {
				email: email,
				password: password,
				realname: realname,
				verified: true,
				createdAt: Date(),
				modifiedAt: Date(),
				phone_number: 'xxxxxxxxxxx',
				role: 'admin'
			}
			const account = await Accounts.create(data);
			const res = await Accounts.createRole(account.id, 'admin');
			if (!res.success) {
				return Promise.resolve(Common.makeResult(false, res.content));
			} else {
				const res = await Accounts.loginUser(req, email, password, deviceType, fb_token);
				if (!res.success) {
					return Promise.resolve(Common.makeResult(false, res.content));
				} else {
					return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success, res.result));
				}
			}
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Accounts.remoteMethod('registerAdmin', {
		accepts: [
			{arg: 'req', type: 'object', http: { source:'req' }},
			{arg: 'email', type: 'string', required: true},
			{arg: 'password', type: 'string', required: true},
			{arg: 'realname', type: 'string', required: true},
			{arg: 'deviceType', type: 'number', required: false, description: '0: iphone, 1: android, 2: user web, 3: admin web'},
			{arg: 'fb_token', type: 'string', required: false, description: 'firebase token'},
		],
		description: [
			'(admin)register admin',
		],
		returns: {arg: 'res', type: 'string'},
		http: {path:'/register-admin', verb: 'post'}
	});

	Accounts.beforeRegister = async(email, realname, phone_number) => {
		try {
			let userObj = await Accounts.findOne({
				where: {
					email: email
				}
			});
			if (userObj) return Promise.resolve(Common.makeResult(false, Common.RETURN_TYPE.Success, 'user email is exited already'));
			userObj = await Accounts.findOne({
				where: {
					phone_number: phone_number
				}
			});
			if (userObj) return Promise.resolve(Common.makeResult(false, Common.RETURN_TYPE.Success, 'phone number is exited already'));
			return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success, ""));
		} catch(e) {
			return Promise.reject(e);
		}
	};

	Accounts.registerClient = async(req, email, realname, password, phone_number, deviceType, fb_token) => {
		const Languages = Accounts.app.models.Languages;
		try {
			const res_before = await Accounts.beforeRegister(email, realname, phone_number);
			if (!res_before.success) return res_before;

			let userId = realname + Date.now();
			userId = Common.makeID(userId);
			const userObj = await Accounts.create({
				email: email,
				userId: userId,
				realname: realname,
				password: password,
				verified: false,
				createdAt: Date(),
				modifiedAt: Date(),
				phone_number: phone_number,
				register_ip: req.ip,
				role: 'client'
			});
			const lang = await Languages.getDefaultLang();
			await userObj.option.create({
				languageId: lang.id
			});
			await userObj.phoneNumbers.create({
				phone_number: phone_number,
				createdAt: Date(),
			});
			await userObj.client.create({
				createdAt: Date(),
			})
			const res = await Accounts.createRole(userObj.id, 'client');

			if (!res.success) {
				return Promise.resolve(Common.makeResult(false, res.content));
			} else {
				const res = await Accounts.loginUser(req, email, password, deviceType, fb_token);
				if (!res.success) {
					return Promise.resolve(Common.makeResult(false, res.content));
				} else {
					return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success, res.result));
				}
			}
		} catch(e) {
			return Promise.reject(e);
		}
	}

	Accounts.remoteMethod('registerClient', {
		accepts: [
			{arg: 'req', type: 'object', http: { source:'req' }},
			{arg: 'email', type: 'string', required: true, description: 'user email'},
			{arg: 'realname', type: 'string', required: true, description: 'user name'},
			{arg: 'password', type: 'string', required: true, description: 'password'},
			{arg: 'phone_number', type: 'string', required: true},
			{arg: 'deviceType', type: 'number', required: false, description: '0: iphone, 1: android, 2: user web, 3: admin web'},
			{arg: 'fb_token', type: 'string', required: false, description: 'firebase token'},
		],
		description: [
			'(every) Client User registeration	',
			'https://zpl.io/bA7A13o',
		],
		returns: {
			arg: 'res',
			type: 'ResSchema_Common',
			description: 'If registration is successful, return registered user info.'
		},
		http: {path:'/register-client', verb: 'post'}
	});

	Accounts.registerProfessional = async(req, email, realname, password, phone_numbers, countryId, invite_code, deviceType, fb_token) => {
		const Languages = Accounts.app.models.Languages;
		try {
			if (phone_numbers.length == 0) return Promise.resolve(Common.makeResult(false, Common.RETURN_TYPE.ERROR_PARAMETER, 'wrong phone_number parameter'));
			const res_before = await Accounts.beforeRegister(email, realname, phone_numbers[0]);
			if (!res_before.success) {
				return res_before;
			}
			let userId = realname + Date.now();
			userId = Common.makeID(userId);
			
			const userObj = await Accounts.create({
				email: email,
				userId: userId,
				realname: realname,
				password: password,
				verified: false,
				createdAt: Date(),
				modifiedAt: Date(),
				register_ip: req.ip,
				role: 'pro'
			});
			const res = await Accounts.createRole(userObj.id, 'pro');
			const lang = await Languages.getDefaultLang();
			await userObj.option.create({
				languageId: lang.id
			});
			const address = await userObj.addresses.create({
				isClient: false,
				countryId: countryId,
				createdAt: Date(),
				modifiedAt: Date()
			});
			const pro = await userObj.professional.create({
				createdAt: Date(),
				modifiedAt: Date()
			})
			await pro.option.create();
			await Promise.all(phone_numbers.map(async phone_number => {
				await userObj.phoneNumbers.create({
					phone_number: phone_number,
					createdAt: Date()
				})
			}))
			
			if (!res.success) {
				return Promise.resolve(Common.makeResult(false, res.content));
			} else {
				const res = await Accounts.loginUser(req, email, password, deviceType, fb_token);
				if (!res.success) {
					return Promise.resolve(Common.makeResult(false, res.content));
				} else {
					return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success, res.result));
				}
			}
		} catch(e) {
			return Promise.reject(e);
		}
	}

	Accounts.remoteMethod('registerProfessional', {
		accepts: [
			{arg: 'req', type: 'object', http: { source:'req' }},
			{arg: 'email', type: 'string', required: true, description: 'user email'},
			{arg: 'realname', type: 'string', required: true, description: 'user name'},
			{arg: 'password', type: 'string', required: true, description: 'password'},
			{arg: 'phone_numbers', type: 'array', required: true, description: 'array of phonenumbers e.g. ["+35231231", "+01232144325"])'},
			{arg: 'countryId', type: 'string', required: true, description: 'AddressCountry id e.g "5eeb17360895297d503ca0f1"'},
			{arg: 'invite_code', type: 'string', required: false, description: 'invitation code'},
			{arg: 'deviceType', type: 'number', required: false, description: '0: iphone, 1: android, 2: user web, 3: admin web'},
			{arg: 'fb_token', type: 'string', required: false, description: 'firebase token'},
		],
		description: [
			'(every) professional user registeration	',
			'https://zpl.io/2pvXpvo'
		],
		returns: {
			arg: 'res',
			type: 'ResSchema_Common',
			description: 'If registration is successful, return registered user info.'
		},
		http: {path:'/register-pro', verb: 'post'}
	});


	// get user
	Accounts.getUserFromUserId = async(userId) => {
		try {
			const query = {
				where: {userId: userId}
			}
			const userObj = await Accounts.findOne(query);
			if (userObj) return userObj;
			else throw 'wrong userId';
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Accounts.getUserFromToken = async(access_token) => {
		try {
			const token = await Accounts.accessToken.findById(access_token);
			if (!token) {
				return Promise.resolve(null);
				// throw 'token error';
			} else {
				const user = await Accounts.findById(token.userId);
				if (user) {
					return Promise.resolve(user);
				} else {
					return Promise.resolve(null);
					// throw 'token user error';
				}
			}
		} catch(e) {
			return Promise.reject(e);
		}
	};
	
	// update password
	Accounts.updatePassword = async(access_token, current_pass, new_pass) => {
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			if (!userObj) return Promise.resolve(Common.makeResult(false, Common.RETURN_TYPE.ERROR_PARAMETER, 'wrong access_token'));
			
			const isMatch = await userObj.hasPassword(current_pass);
			if (!isMatch) {
				return Promise.resolve(Common.makeResult(false, Common.RETURN_TYPE.Warning, 'wrong current_pass'));
			} else {
				await userObj.updateAttribute('password', Accounts.hashPassword(new_pass));
				return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success));
			}
		} catch(e) {
			return Promise.reject(e);
		}
	};

	Accounts.remoteMethod('updatePassword', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'access token'},
			{arg: 'current_pass', type: 'string', required: true, description: 'current password'},
			{arg: 'new_pass', type: 'string', required: true, description: 'new password'},
		],
		description: [
			'(every) change password\n',
		],
		returns: {
			arg: 'res',
			type: 'ResSchema_Common',
			description: [
				'if success, return true or not false	',
				'client: https://zpl.io/blDxQDG	',
				'client: https://zpl.io/amAYZWA	',
				'pro: https://zpl.io/VYgdNQe	'
			]
		},
		http: {path:'/update-password', verb: 'post'}
	});

	// Accounts.afterRemote('loginUser', function(ctx){
	//   ctx.res.cookie('access_token', ctx.result.id, { signed: true, maxAge: ctx.result.ttl * 1000 });
	//   return Promise.resolve();
	// });

	// Accounts.afterRemote('logout', function(ctx){
	//   ctx.res.clearCookie('access_token');
	//   return Promise.resolve();
	// });

	
	// Accounts.getRegisterType = async(mail) => {
	// 	try {
	// 		const query = {
	// 			fields: ['mail', 'register_type'],
	// 			where: {
	// 				mail: mail
	// 			}
	// 		}
	// 		const userObj = await Accounts.findOne(query);
	// 		if (userObj) {
	// 			return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success, userObj.register_type));
	// 		} else {
	// 			return Promise.resolve(Common.makeResult(false, 'there is no registered mail'));
	// 		}
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	// };

	// Accounts.remoteMethod('getRegisterType', {
	// 	accepts: [
	// 		{arg: 'mail', type: 'string', required: true, description: '유저메일'},
	// 	],
	// 	description: [
	// 		'(전체) 메일을 가지고 등록타입을 돌려준다.',
	// 	],
	// 	returns: {
	// 		arg: 'res',
	// 		type: 'string',
	// 		description: [
	// 			'site: 웹싸이트, android: 앱, kat: 카톡'
	// 		]
	// 	},
	// 	http: {path:'/get-registertype', verb: 'get'}
	// });
	
	// Accounts.getAppNotify = async(access_token) => {
	// 	const AccessLogs = Accounts.app.models.AccessLogs;
	// 	try {
	// 		const res = await Accounts.getUserWithToken(access_token);
	// 		let userObj = res.result;
	// 		if (!res.success) {
	// 			return Promise.resolve(Common.makeResult(false, res.content));
	// 		}
	// 		const result = await AccessLogs.unreadDocuments(userObj);
	// 		const query = {
	// 			fields: ['id', 'title', 'modifiedAt'],
	// 			where: {
	// 				status: 'checked',
	// 				read: { neq: true },
	// 			}
	// 		}
	// 		result.questions = await userObj.questions.find(query);
	// 		return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success, result));
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	// };

	// Accounts.remoteMethod('getAppNotify', {
	// 	accepts: [
	// 		{arg: 'access_token', type: 'string', required: true, description: '유저토큰'},
	// 	],
	// 	description: [
	// 		'(유저) 읽지 않은 문서들을 알림\n',
	// 	],
	// 	returns: {
	// 		arg: 'res',
	// 		type: 'string',
	// 		description: [
	// 			'notices: 공지\n',
	// 			'notices.title: 공지제목\n',
	// 			'notices.createdAt: 날자\n',
	// 			'events: 이벤트\n',
	// 			'events.title: 이벤트제목\n',
	// 			'events.createdAt: 날자\n',
	// 			'questions: 질문\n',
	// 			'questions.title: 질문제목\n',
	// 			'questions.modifiedAt: 날자\n',
	// 		]
	// 	},
	// 	http: {path:'/get-app-notify', verb: 'get'}
	// });


	Accounts.searchUser = async(name, role, pageNum, pageIndex) => {
		if (!name) name = '';
		if (pageNum == undefined) {
			pageNum = 100;
		}
		if (pageIndex == undefined) {
			pageIndex = 0;
		}
		const query = {
			where: {
				or: [
					{ realname: { like: name, options: 'i' } }
				],
			},
			limit: pageNum,
			skip: pageNum * pageIndex
		};
		if (role) {
			if (role == 'all') {
				query.where.role = { neq: 'admin' };
			} else {
				query.where.role = role;
			}
		}
		try {
			const users = await Accounts.find(query);
			if (users.length > 0) {
				return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success, users));
			} else {
				return Promise.resolve(Common.makeResult(false, 'There is no result'));
			}
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Accounts.remoteMethod('searchUser', {
		accepts: [
			{arg: 'name', type: 'string', description: 'if it is empty, search total.'},
			{arg: 'role', type: 'string', description: 'if it is empty, search total. client / pro / admin'},
			{arg: 'pageNum', type: 'number'},
			{arg: 'pageIndex', type: 'number'},
		],
		description: [
			'(admin) return search result.',
		],
		returns: {
			arg: 'res',
			type: 'string',
			description: 'array of user info'
		},
		http: {path:'/search-user', verb: 'get'}
	});
	

	// update setting
	Accounts.updateRealName = async(access_token, realname) => {
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			const result = await userObj.updateAttributes({
				realname: realname
			})
			return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success, result));
		} catch(e) {
			return Promise.reject(e);
		}
	};

	Accounts.remoteMethod('updateRealName', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'access token'},
			{arg: 'realname', type: 'string', required: false, description: 'realname'},
		],
		description: [
			'(client, pro) update account realname 	',
			'client: https://zpl.io/aRJj9xN'
		],
		returns: {
			arg: 'res',
			type: 'Accounts',
			description: [
				''
			]
		},
		http: {path:'/update-realname', verb: 'post'}
	});

	
	Accounts.getCurUserState = async(access_token) => {
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			const result = {
				user: userObj
			};
			if (userObj.role == 'client') {
				result.state = {
					'schedule': 2,
					'contact': 1,
				}
			} else {
				result.state = {
					'schedule': 1,
					'finance': 2,
				}
			}
			return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success, result));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Accounts.remoteMethod('getCurUserState', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true},
		],
		description: [
			'(client, pro) return current menu state.	',
			'https://zpl.io/VYr35oL'
		],
		returns: {
			arg: 'res',
			type: 'object',
			description: 'cur state'
		},
		http: {path:'/get-curstate', verb: 'get'}
	});
	
	Accounts.checkEmail = async(email) => {
		try {
			let userObj = await Accounts.findOne({
				where: {
					email: email
				}
			});
			if (userObj) {
				return Promise.resolve(Common.makeResult(false, Common.RETURN_TYPE.Success, 'The mail has already been registered'));
			}
			return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.Success, "valid email"));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Accounts.remoteMethod('checkEmail', {
		accepts: [
			{arg: 'email', type: 'string', required: true},
		],
		description: [
			'(every) check repeated email.	',
			'client: https://zpl.io/agQplz1	',
			'pro: https://zpl.io/VQv7lvm	',
		],
		returns: {
			arg: 'res',
			type: 'ResSchema_Common',
			description: 'success == true'
		},
		http: {path:'/check-email', verb: 'get'}
	});
	
	Accounts.checkPhoneNumber = async(phone_number) => {
		try {
			let user = await Accounts.findOne({
				where: {
					phone_number: phone_number
				}
			});
			if (user) {
				return Promise.resolve(Common.makeResult(false, Common.RETURN_TYPE.Success, 'this phone_number is exited already', ""));
			}
			const result = Common.makeResult(true, Common.RETURN_TYPE.Success, "valid phone number");
			return Promise.resolve(result);
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Accounts.remoteMethod('checkPhoneNumber', {
		accepts: [
			{arg: 'phone_number', type: 'string', required: true},
		],
		description: [
			'(every) check entered phone number.	',
			'client: https://zpl.io/agQplz1	',
			'pro: https://zpl.io/VQv7lvm	',
			'pro: https://zpl.io/bAJrXL8	',
		],
		returns: {
			arg: 'res',
			type: 'ResSchema_Common',
			description: ''
		},
		http: {path:'/check-phone', verb: 'get'}
	});





	Accounts.getUserInfo = async(username) => {
		
	}



	
	Accounts.registerUser = async(req, userId, password, store_name, mac_address) => {
		const Robot = Accounts.app.models.Robot;
		const Asteroid = Accounts.app.models.Asteroid;
		const STPlayerState = Accounts.app.models.STPlayerState;
		const STPossessionInfo = Accounts.app.models.STPossessionInfo;
		try {
			let account = await Accounts.findOne({
				where: {
					userId: userId
				}
			});
			if (account) {
				return Promise.resolve(Common.makeReturnValue(false, 'Accounts/registerUser', 'the user is exited already'));
			}
			const robot = await Robot.findOne({
				where: {
					username: username,
				}
			});
			if (robot) {
				return Promise.resolve(Common.makeReturnValue(false, 'Accounts/registerUser', 'the robotname is already exited'));
			}
			const asteroid = await Asteroid.findOne({
				where: {
					username: username,
				}
			});
			if (asteroid) {
				return Promise.resolve(Common.makeReturnValue(false, 'Accounts/registerUser', 'the asteroidName is already exited'));
			}
			const userObj = await Accounts.create({
				email: userId + '@disapora.com',
				username: userId,
				userId: userId,
				realname: userId,
				password: password,
				verified: false,
				createdAt: Date(),
				modifiedAt: Date(),
				register_ip: req.ip,
				store_name: store_name,
				mac_address: mac_address,
				status: 1,
				player_state: STPlayerState.getDefaultVal(),
				possessionInfo: STPossessionInfo.getDefaultVal(),
				role: 'user',
				register_type: 'game'
			});
			const res = await Accounts.createRole(userObj.id, 'user');
			if (!res.success) {
				return Promise.resolve(Common.makeReturnValue(false, 'Accounts/registerUser', res.content));
			} else {
				const token = await Accounts.login({
					email: userId + '@disapora.com',
					password: password
				});
				if (token) {
					const userInfo = await Accounts.returnLoginUserInfo(req, token);
					return Promise.resolve(Common.makeReturnValue(true, 'Accounts/registerUser', Common.RETURN_TYPE.Success, {
						user: userInfo,
						token: token.id,
					}));
				}
				return Promise.resolve(Common.makeReturnValue(false, 'Accounts/registerUser', Common.RETURN_TYPE.ERROR_ACCOUNT, {}))
			}
		} catch(e) {
			return Promise.reject(e);
		}
	}

	Accounts.remoteMethod('registerUser', {
		accepts: [
			{arg: 'req', type: 'object', http: { source:'req' }},
			{arg: 'userId', type: 'string', required: true, description: 'user name'},
			{arg: 'password', type: 'string', required: true, description: 'password'},
			{arg: 'store_name', type: 'string', required: true, description: 'store name'},
			{arg: 'mac_address', type: 'string', required: true, description: 'mac address'},
		],
		description: [
			'(every) user registeration	',
		],
		returns: {
            root: true,
			arg: '',
			type: 'object',
			description: [
				'return logined user info\n',
			]
		},
		http: {path:'/registerUser', verb: 'post'}
	});


	Accounts.loginOldServer = async(req, userId, password, store_name, mac_address) => {
		try {
			const response = await request('https://diasporabr.azurewebsites.net/api/Auth', {
				method: 'POST',
				data: {
					user_login: userId,
					user_passwd: password,
					theStore: store_name,
					user_mac: mac_address,
				}
			})
			const resp = JSON.parse(response.body);
			if (resp.status != 0) {
				const response2 = await request('https://diasporabr.azurewebsites.net/api/Auth/Verify', {
					method: 'POST',
					headers: {
						Authorization: 'Basic Yjk4YTk2ZDAtNTNhMS00YWM4LWE2MGQtYTBjMDQ3YTJlMTE4NGViYzBkMjMtMjc3Ni00ZmRhLWJmNmUtODQ1Y2ViZDYyMjQ4Om9pSzI7aEtSdEx0Q0JBYkpsUUNWclBWS2JmbnFialdvd0p6T3JhdGt1aFNOaGprSDhJ'
					},
					data: {
						token: resp.tok,
						user_banned: 0,
						user_curr_ip: req.ip,
						IsPremium: 0,
						user_mac: mac_address,
					}
				})
				const resp2 = JSON.parse(response2.body);
				if (resp2.status == 'true') {
					const response3 = await request('https://diasporabr.azurewebsites.net/api/PDC/GetWallet/' + resp2.user_id, {
						method: 'GET',
						headers: {
							Authorization: 'Basic Yjk4YTk2ZDAtNTNhMS00YWM4LWE2MGQtYTBjMDQ3YTJlMTE4NGViYzBkMjMtMjc3Ni00ZmRhLWJmNmUtODQ1Y2ViZDYyMjQ4Om9pSzI7aEtSdEx0Q0JBYkpsUUNWclBWS2JmbnFialdvd0p6T3JhdGt1aFNOaGprSDhJ'
						},
						data: {}
					})
					const resp3 = JSON.parse(response3.body);
					return Promise.resolve({
						userId: resp3.user_id,
						balance: resp3.balance,
						walletId: resp3.wallet_id,
						token_server: resp.tok,
						status: resp.status
					});
				}
			}
			return Promise.resolve();
		} catch(e) {
			return Promise.reject(e);
		}
	}

	Accounts.returnLoginUserInfo = async(req, token) => {
		const Userlog = Accounts.app.models.UserLog;
		const STPlayerState = Accounts.app.models.STPlayerState;
		const STPossessionInfo = Accounts.app.models.STPossessionInfo;
		try {
			const userObj = await Accounts.findById(token.userId);
			await Userlog.addLog(userObj, token.id, req.ip, 'app');
			const deletes = await Accounts.accessToken.destroyAll({
				userId: userObj.id,
				id: {
					neq: token.id
				}
			});
//			if (!userObj.player_state) userObj.player_state = STPlayerState.getDefaultVal();
//			if (!userObj.possessionInfo) userObj.possessionInfo = STPossessionInfo.getDefaultVal(),
//			userObj.picture = (userObj.picture ? userObj.picture : "user-picture/user_default.png");
//			await userObj.save();
			return Promise.resolve({
				userId: userObj.userId,
				username: userObj.userId,
				status: userObj.status,
				picture: userObj.picture,
				player_state: userObj.player_state,
				possessionInfo: userObj.possessionInfo,
			});
		} catch(e) {
			return Promise.reject(e);
		}
	}

	// login
	Accounts.loginUser = async(req, userId, password, store_name, mac_address) => {
		const STPlayerState = Accounts.app.models.STPlayerState;
		const STPossessionInfo = Accounts.app.models.STPossessionInfo;
		try {
			const token = await Accounts.login({
				email: userId + '@disapora.com',
				password: password
			});
			if (token) {
				const userInfo = await Accounts.returnLoginUserInfo(req, token);
				return Promise.resolve(Common.makeReturnValue(true, 'Accounts/loginUser', Common.RETURN_TYPE.Success, {
					user_name: userInfo.username,
					user_token: token.id,
					possessions: userInfo.possessionInfo,
					current_state: userInfo.player_state,
				}));
			}
			return Promise.resolve(Common.makeReturnValue(false, 'Accounts/loginUser', Common.RETURN_TYPE.ERROR_ACCOUNT, {}));
		} catch(e) {
			if (e.code == "LOGIN_FAILED") {
				let account = await Accounts.findOne({
					where: {
						userId: userId
					}
				});
				if (account) {
					return Promise.resolve(Common.makeReturnValue(false, 'Accounts/loginUser', 'password is wrong'));
				} else {
					const oldAccount = await Accounts.loginOldServer(req, userId, password, store_name, mac_address);
					if (oldAccount) {
						const newAccount = await Accounts.create({
							userId_old: oldAccount.userId,
							userId: userId,
							username: userId,
							realname: userId,
							email: userId + '@disapora.com',
							password: password,
							store_name: store_name,
							mac_address: mac_address,
							status: oldAccount.status,
							token_server: oldAccount.token_server,
							player_state: STPlayerState.getDefaultVal(),
							possessionInfo: STPossessionInfo.getDefaultVal(),
							register_type: 'old'
						});
						const token = await Accounts.login({
							email: userId + '@disapora.com',
							password: password
						});
						if (token) {
							const userInfo = await Accounts.returnLoginUserInfo(req, token);
							return Promise.resolve(Common.makeReturnValue(true, 'Accounts/loginUser', Common.RETURN_TYPE.Success, {
								user_name: userInfo.username,
								user_token: token.id,
								possessions: userInfo.possessionInfo,
								current_state: userInfo.player_state,
							}));
						}
					}
				}
				return Promise.resolve(Common.makeReturnValue(false, 'Accounts/loginUser', 'login failed'));
			}
			return Promise.reject(e);
		}
	};
	Accounts.remoteMethod('loginUser', {
		accepts: [
			{arg: 'req', type: 'object', http: { source:'req' }},
			{arg: 'userId', type: 'string', required: true, description: 'user name'},
			{arg: 'password', type: 'string', required: true, description: 'password'},
			{arg: 'store_name', type: 'string', required: true, description: 'store name'},
			{arg: 'mac_address', type: 'string', required: true, description: 'mac address'},
		],
		description: [
			'(every)',
		],
		returns: {
            root: true,
			arg: '',
			type: 'object',
			description: [
				'return logined user info\n',
			]
		},
		http: {path:'/loginUser', verb: 'post'}
	});

	// get user status
	Accounts.getUserStatus = async(access_token) => {
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			if (!userObj) {
				return Promise.resolve(Common.makeReturnValue(false, 'Accounts/get-status', Common.RETURN_TYPE.ERROR_Token, {}));
			}
			return Promise.resolve(Common.makeReturnValue(true, 'Accounts/get-status', Common.RETURN_TYPE.Success, {
				userId: userObj.userId,
				username: userObj.userId,
				status: userObj.status,
				picture: userObj.picture,
				player_state: userObj.player_state,
				possessionInfo: userObj.possessionInfo,
			}));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Accounts.remoteMethod('getUserStatus', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'user access token'},
		],
		description: [
			'(every)',
		],
		returns: {
            root: true,
			arg: '',
			type: 'object',
			description: [
				'return logined user info\n',
			]
		},
		http: {path:'/get-status', verb: 'post'}
	});


	Accounts.getCurShip = (userObj) => {
		const activeShipIdx = userObj.possessionInfo.activeShipIdx;
		if (activeShipIdx >= 0 && activeShipIdx < userObj.possessionInfo.Ships.length) {
			return userObj.possessionInfo.Ships[activeShipIdx];
		} else {
			console.error(activeShipIdx);
		}
		return null;
	}
	
	Accounts.prototype.getActivatedShip = function() {
		const equiped_ship = this.possessionInfo.inventory.equiped_ship;
		if (equiped_ship) {
			for (let i = 0; i < this.possessionInfo.inventory.ships.length; i++) {
				if (this.possessionInfo.inventory.ships[i].uniq_id == equiped_ship) {
					return this.possessionInfo.inventory.ships[i];
				}
			}
		} else {
			console.error(equiped_ship);
		}
		return null;
	}
	Accounts.prototype.dropMinerals = async function(mapId) {
		const MapPoints = Accounts.app.models.MapPoints;
		try {
			const activatedShip = this.getActivatedShip();
			const minerals = activatedShip.minerals;
			if (minerals.length > 0) {
				const mapPoint = await MapPoints.findOne({
					where: {
						mapId: mapId,
					}
				});
				if (mapPoint) {
					const pointMinerals = Common.addMinerals(minerals, mapPoint.minerals);
					await mapPoint.updateAttribute('minerals', pointMinerals);
					return Promise.resolve(pointMinerals);
				}
			}
			return Promise.resolve();
		} catch(e) {
			return Promise.reject(e);
		}
	}
};

