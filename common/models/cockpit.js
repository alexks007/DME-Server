'use strict';

var Common = require('./common.js');

module.exports = function(Cockpit) {

	Cockpit.disableRemoteMethodByName("upsert");
	Cockpit.disableRemoteMethodByName("find");
	Cockpit.disableRemoteMethodByName("replaceOrCreate");
	Cockpit.disableRemoteMethodByName("create");
	Cockpit.disableRemoteMethodByName("prototype.updateAttributes");
	Cockpit.disableRemoteMethodByName("findById");
	Cockpit.disableRemoteMethodByName("exists");
	Cockpit.disableRemoteMethodByName("replaceById");
	Cockpit.disableRemoteMethodByName("deleteById");
	Cockpit.disableRemoteMethodByName("createChangeStream");
	Cockpit.disableRemoteMethodByName("count");
	Cockpit.disableRemoteMethodByName("findOne");
	Cockpit.disableRemoteMethodByName("update");
	Cockpit.disableRemoteMethodByName("upsertWithWhere");
	
	Cockpit.connectSocket = async(user_token, socketId) => {
		const Accounts = Cockpit.app.models.Accounts;
		try {
			console.log('connectSocket:' + socketId);
			const userObj = await Accounts.getUserFromToken(user_token);
			if (!userObj) return Promise.resolve(Common.makeReturnValue(false, 'Cockpits/connect-socket', Common.RETURN_TYPE.ERROR_Token));
			const cockpit = await Cockpit.findOne({
				where: {
					username: userObj.username,
				}
			})
			if (cockpit) {
				await cockpit.updateAttributes({
					socketId, socketId,
					mapId: -1,
				});
			} else {
				const newObj = await userObj.cockpit.create({
					type: 'avatar',
					username: userObj.username,
					user_token: user_token,
					socketId: socketId,
					mapId: -1,
					hp: 100,
					defencer_token: null,
					accountsId: userObj.id
				});
			}
			const connected = Cockpit.app.websocket.connectedSocket(userObj.username, user_token, socketId);
			return Promise.resolve(Common.makeReturnValue(true, 'Cockpits/connect-socket', Common.RETURN_TYPE.Success));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Cockpit.remoteMethod('connectSocket', {
		accepts: [
			{arg: 'userToken', type: 'string', required: true, description: 'user name'},
			{arg: 'socketId', type: 'string', required: true, description: 'socket id'},
		],
		description: [
			'(every)',
		],
		returns: {
            root: true,
			arg: '',
			type: 'object',
			description: [
				'return username\n',
			]
		},
		http: {path:'/connect-socket', verb: 'post'}
	});

	// Cockpit.registerAsteroid = async(asteroidObj) => {
	// 	try {
	// 		const asteroidId = asteroidObj.id.toString();
	// 		const cockpit = await Cockpit.findOne({
	// 			where: {
	// 				user_token: asteroidId,
	// 			}
	// 		})
	// 		let cockpitObj;
	// 		if (cockpit) {
	// 			cockpitObj = await cockpit.updateAttributes({
	// 				mapId: -1,
	// 			});
	// 		} else {
	// 			cockpitObj = await Cockpit.create({
	// 				type: 'asteroid',
	// 				username: asteroidObj.username,
	// 				user_token: asteroidId,
	// 				socketId: asteroidId,
	// 				mapId: -1,
	// 				hp: 100,
	// 				hp_max: 100,
	// 				shipId: 101,
	// 				defencer_token: null
	// 			});
	// 		}
	// 		return Promise.resolve(cockpitObj);
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	// }

	Cockpit.loginRobot = async(type, robotObj) => {
		try {
			const robotId = robotObj.id.toString();
			const cockpit = await Cockpit.findOne({
				where: {
					user_token: robotId,
				}
			})
			let cockpitObj;
			if (cockpit) {
				cockpitObj = await cockpit.updateAttributes({
					mapId: -1,
				});
			} else {
				cockpitObj = await Cockpit.create({
					type: type,
					username: robotObj.username,
					user_token: robotId,
					socketId: null,
					mapId: -1,
					defencer_token: null,
				});
			}
			return Promise.resolve(cockpitObj);
		} catch(e) {
			return Promise.reject(e);
		}
	}

	Cockpit.enterGameMap = async(user_token, mac_address) => {
		const Accounts = Cockpit.app.models.Accounts;
		const Asteroid = Cockpit.app.models.Asteroid;
		const MapPoints = Cockpit.app.models.MapPoints;
		const STPair = Cockpit.app.models.STPair;
		try {
			const userObj = await Accounts.getUserFromToken(user_token);
			if (!userObj) return Promise.resolve(Common.makeReturnValue(false, 'Cockpits/entermap', Common.RETURN_TYPE.ERROR_Token));
/*			const account = await Accounts.findOne({
				where: {
					userId: userId
				}
			});
			if (!account) return Promise.resolve(Common.makeReturnValue(false, "wrong userId"));*/
//			cokpitList.forEach(obj => {
//				obj.username = account.username;
//			})
			const mapId = userObj.player_state.current_location_id;
			
			const cockpit = await Cockpit.findOne({
				where: {
					username: userObj.username,
				}
			})
			const avatars = [];
			const asteroids = [];
			const satellites = {};
			if (cockpit) {
				const cokpitList = await Cockpit.find({
					fields: ['id', 'type', 'socketId', 'username', 'user_token', 'mapId', 'defencer_token', 'accountsId', 'asteroidId'],
					where: {
						mapId: mapId, //
					}
				})
				cokpitList.forEach((item) => {
					// item.type = 'avatar';
					item.hp = 100; //
					item.shipId = 101;
					item.hp_max = 100;
				})
				await cockpit.updateAttributes({
					user_token: user_token,
					mapId: mapId
				});
				
				const defGun1 = {
					table_id: 109,
					uniq_id: '5eefda49a4fd67eb5bdbcaa6',
					currentValue: 100,
					equipedSkin: -1
				};
				const defGun2 = {
					table_id: 115,
					uniq_id: '5eefda49a4fd67eb5bdbcaa7',
					currentValue: 100,
					equipedSkin: -1
				};
				await Promise.all(cokpitList.map(async(item) => {
					if (item.type == 'avatar' || item.type == 'avatar_ai') {
						const userObj = await item.accounts.get();
						const curShip = userObj.getActivatedShip();
						avatars.push({
							type: item.type,
							avatar_token: item.user_token,
							avatar_name: item.username,
							guild_name: item.guild_name,
							defencer_token: item.defencer_token,
							avatar_ship: {
								table_id: curShip.table_id,
								uniq_id: curShip.uniq_id,
								current_hp: curShip.current_hp,
								equiped_skin: curShip.equiped_skin,
								guns: curShip.guns,
								miscs: curShip.miscs,
								minerals: curShip.minerals
							}
						})
					} else if (item.type == 'asteroid') {
						const asteroid = await Asteroid.findById(item.user_token);
						if (asteroid) {
							asteroids.push({
								token: item.user_token,
								family_name: asteroid.family_name,
								full_hp: asteroid.full_hp,
								current_hp: asteroid.current_hp,
								visual_type: asteroid.visual_type,
								minerals: asteroid.minerals
							})
						} else {
							console.error('asteroid errr');
						}
					}
				}));
				const avatar = {
					type: cockpit.type,
					avatar_token: user_token,
					avatar_name: userObj.username,
					guild_name: 'xxxx',
					defencer_token: cockpit.defencer_token,
					avatar_ship: userObj.getActivatedShip()
				};
				Cockpit.app.websocket.socketEnterGameMap('avatar', cockpit.socketId, user_token, mapId, avatar);
				const mapPoint = await MapPoints.findOne({
					where: {
						mapId: mapId,
					}
				});
				return Promise.resolve(Common.makeReturnValue(true, 'Cockpits/entermap', Common.RETURN_TYPE.Success, {
					avatars: avatars,
					asteroids: asteroids,
					minerals: mapPoint.minerals,
					satellit: satellites,
				}));
			}
			return Promise.resolve(Common.makeReturnValue(true, 'Cockpits/entermap', 'Common.RETURN_TYPE.Success', {
				avatars: avatars,
				asteroids: asteroids,
				minerals: [STPair.generateRandom()],
				satellit: satellites,
			}));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Cockpit.remoteMethod('enterGameMap', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'user token'},
			{arg: 'mac_address', type: 'string', required: true, description: 'user token'},
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
		http: {path:'/entermap', verb: 'post'}
	});
	
	Cockpit.leaveGameMap = async(user_token, isDestroyed) => {
		const Accounts = Cockpit.app.models.Accounts;
		try {
			const cockpit = await Cockpit.findOne({
				where: {
					user_token: user_token,
				}
			});
			if (cockpit) {
				if (isDestroyed) {
					let minerals;
					if (cockpit.type == 'asteroid') {
						const asteroid = await cockpit.asteroid.get();
						if (asteroid) minerals = await asteroid.dropMinerals(cockpit.mapId);
					} else if (cockpit.type == 'avatar' || cockpit.type == 'avatar_ai') {
						const userObj = await cockpit.accounts.get();
						if (userObj) minerals = await userObj.dropMinerals(cockpit.mapId);
					}
					if (minerals) {
						Cockpit.app.websocket.OnLootMinerals(cockpit.mapId, minerals);
					}
				}
				if (cockpit.defencer_token) {
					const hp = Cockpit.app.websocket.stopFire(user_token, cockpit.defencer_token, cockpit.mapId, cockpit);
					await Cockpit.updateHP(cockpit.defencer_token, hp);
					await cockpit.updateAttribute('defencer_token', null);
				}
				const cockpit_attackers = await Cockpit.find({
					where: {
						defencer_token: user_token,
					}
				});
				await Promise.all(cockpit_attackers.map(async cockpit_attacker => {
					if (cockpit_attacker.defencer_token) {
						const hp = Cockpit.app.websocket.stopFire(cockpit_attacker.user_token, cockpit_attacker.defencer_token, cockpit_attacker.mapId, cockpit);
						await Cockpit.updateHP(cockpit_attacker.defencer_token, hp);
						await cockpit_attacker.updateAttribute('defencer_token', null);
					}
				}))
				Cockpit.app.websocket.socketLeaveGameMap(cockpit.socketId, cockpit.username, user_token, cockpit.mapId);
				await cockpit.updateAttributes({
					mapId: '-1'
				});
				return Promise.resolve(Common.makeReturnValue(true, 'Cockpits/leavemap', Common.RETURN_TYPE.Success, {
					username: cockpit.username,
					user_token: user_token
				}))
			}
			return Promise.resolve(Common.makeReturnValue(false, 'Cockpits/leavemap', Common.RETURN_TYPE.Success));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Cockpit.remoteMethod('leaveGameMap', {
		accepts: [
			{arg: 'user_token', type: 'string', required: true, description: 'user token'},
			{arg: 'isDestroyed', type: 'boolean', required: false, description: 'user token'},
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
		http: {path:'/leavemap', verb: 'post'}
	});
	
	Cockpit.getCurPlayers = async(mapId) => {
		try {
			const cockpit = await Cockpit.find({
				where: {
					mapId: mapId,
				}
			})
//			const cockpit = Cockpit.app.websocket.getPlayers(mapId);
			return Promise.resolve(Common.makeReturnValue(true, 'Cockpits/get-players', Common.RETURN_TYPE.Success, cockpit));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Cockpit.remoteMethod('getCurPlayers', {
		accepts: [
			{arg: 'mapId', type: 'string', required: true, description: 'map index'},
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
		http: {path:'/get-players', verb: 'get'}
	});

	
	Cockpit.startFire = async(access_token, mac_address, defencer_token) => {
		const Accounts = Cockpit.app.models.Accounts;
		const Robot = Cockpit.app.models.Robot;
		try {
			// let attackerObj = await Accounts.getUserFromToken(attackerToken);
			// if (!attackerObj) {
			// 	attackerObj = await Cockpit.findById(attackerObj);
			// 	if (!attackerRobot) {
			// 		return Promise.resolve(Common.makeReturnValue(false, 'Cockpits/start-fire', Common.RETURN_TYPE.ERROR_Token));
			// 	}
			// }
			const attackerObj = await Cockpit.findOne({
				where: {
					user_token: access_token,
				}
			});
			const defencerObj = await Cockpit.findOne({
				where: {
					user_token: defencer_token,
				}
			});
			// let isRobot = true;
			// let defencerObj = await Cockpit.findById(defencerToken);
			// let userId = 'asteroid';
			// if (!defencerObj) {
			// 	defencerObj = await Accounts.getUserFromToken(defencerToken);
			// 	if (!defencerObj) {
			// 		return Promise.resolve(Common.makeReturnValue(false, 'Cockpits/start-fire', Common.RETURN_TYPE.ERROR_Token));
			// 	}
			// 	isRobot = false;
			// 	userId = defencerObj.userId;
			// }

			// const cockpit = await Cockpit.findOne({
			// 	where: {
			// 		user_token: attackerToken,
			// 	}
			// });
			if (defencerObj.type == 'avatar_ai') {
				setTimeout(async() => {
					// await Cockpit.startFire(defencerToken, attackerToken);
				}, 1000);
			}
			if (attackerObj && defencerObj) {
				console.log('start firing: ' + attackerObj.username + '->' + defencerObj.username);
				Cockpit.app.websocket.startFire(access_token, defencer_token, attackerObj.mapId, attackerObj, defencerObj);
				await attackerObj.updateAttribute('defencer_token', defencer_token);
				return Promise.resolve(Common.makeReturnValue(true, 'Cockpits/start-fire', Common.RETURN_TYPE.Success, {
					defencer_token: defencer_token
				}));
			}
			return Promise.resolve(Common.makeReturnValue(false, 'Cockpits/start-fire', Common.RETURN_TYPE.Success));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Cockpit.remoteMethod('startFire', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'attacker token'},
			{arg: 'mac_address', type: 'string', required: true, description: 'attacker token'},
			{arg: 'defencer_token', type: 'string', required: true, description: 'defencer token'},
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
		http: {path:'/start-fire', verb: 'post'}
	});
	
	Cockpit.stopFire = async(access_token, mac_address, defencer_token) => {
		const Accounts = Cockpit.app.models.Accounts;
		try {
			const attackerObj = await Accounts.getUserFromToken(access_token);
			if (!attackerObj) return Promise.resolve(Common.makeReturnValue(false, 'Cockpits/stop-fire', Common.RETURN_TYPE.ERROR_Token));
			const cockpit = await Cockpit.findOne({
				where: {
					user_token: access_token,
				}
			});
			if (cockpit) {
				console.log('stop firing: ' + attackerObj.userId);
				// const defencer_token = cockpit.defencer_token;
				let isAsteroid = true;
				if (defencer_token) {
					let defencerObj = await Cockpit.findById(defencer_token);
					if (!defencerObj) {
						defencerObj = await Accounts.getUserFromToken(defencer_token);
						isAsteroid = false;
					}
					await cockpit.updateAttribute('defencer_token', null);
					const hp = Cockpit.app.websocket.stopFire(access_token, defencer_token, cockpit.mapId, defencerObj, isAsteroid);
					await Cockpit.updateHP(defencer_token, hp);
				}
				return Promise.resolve(Common.makeReturnValue(true, 'Cockpits/stop-fire', Common.RETURN_TYPE.Success, {
					// attacker: access_token,
					defencer_token: defencer_token
				}));
			}
			return Promise.resolve(Common.makeReturnValue(false, 'Cockpits/stop-fire', 'user not found'));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Cockpit.remoteMethod('stopFire', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'attacker token'},
			{arg: 'mac_address', type: 'string', required: true, description: 'attacker token'},
			{arg: 'defencer_token', type: 'string', required: true, description: 'attacker token'},
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
		http: {path:'/stop-fire', verb: 'post'}
	});


	Cockpit.updateHP = async(user_token, hp) => {
		const Accounts = Cockpit.app.models.Accounts;
		try {
			const cockpit = await Cockpit.findOne({
				where: {
					user_token: user_token,
				}
			});
			if (!cockpit) {
				console.error('updateHP user_token error');
				return Promise.resolve(false);
			}
			await cockpit.updateAttribute('hp', hp);
			if (cockpit.type == 'avatar') {
				const userObj = await Accounts.getUserFromToken(user_token);
				if (userObj) {
					const possessionInfo = userObj.possessionInfo;
					const curShip = userObj.getActivatedShip();
					if (curShip) {
						curShip.current_hp = hp;
						await userObj.updateAttribute('possessionInfo', possessionInfo);
					} else {
						console.error('curShipIdx error');
					}
				}
			}
		} catch(e) {
			return Promise.reject(e);
		}
	}
};

