'use strict';

var Common = require('./common.js');
module.exports = function(Robot) {

	Robot.disableRemoteMethodByName("upsert");
	Robot.disableRemoteMethodByName("find");
	Robot.disableRemoteMethodByName("replaceOrCreate");
	Robot.disableRemoteMethodByName("create");
	Robot.disableRemoteMethodByName("prototype.updateAttributes");
	Robot.disableRemoteMethodByName("findById");
	Robot.disableRemoteMethodByName("exists");
	Robot.disableRemoteMethodByName("replaceById");
	Robot.disableRemoteMethodByName("deleteById");
	Robot.disableRemoteMethodByName("createChangeStream");
	Robot.disableRemoteMethodByName("count");
	Robot.disableRemoteMethodByName("findOne");
	Robot.disableRemoteMethodByName("update");
	Robot.disableRemoteMethodByName("upsertWithWhere");

/*
	Robot.entermapRobot = async(mapId) => {
		const Accounts = Robot.app.models.Accounts;
		const Cockpit = Robot.app.models.Cockpit;
		const MapPoints = Robot.app.models.MapPoints;
		try {
			const result = MapPoints.getPointFromKey(mapId);
			if (!result) return Promise.resolve(Common.makeReturnValue(false, 'Robots/enter-map', 'invalid mapId'));

			const cokpitList = await Cockpit.find({
				fields: ['socketId', 'username', 'userToken', 'mapId', 'defencer_token'],
				where: {
					mapId: mapId, //
				}
			})
			if (cokpitList.length >= Common.MAX_Robot_NUM) {
				return Promise.resolve(Common.makeReturnValue(false, 'Robots/enter-map', 'exceed Max Robot Count'));
			}
			const Robots = await Accounts.find({
				where: {
					role: 'robot',
				}
			});
			const availableRobots = [];
			for (let i = 0; i < robots.length; i++) {
				if (robots[i].player_state.current_location_id != mapId) {
					availableRobots.push(robots[i]);
				}
			}
			if (availableRobots.length == 0) {
				return Promise.resolve(Common.makeReturnValue(false, 'Robots/enter-map', 'Robot Count == 0'));
			}
			 
			const robot = robots[Common.getIntRandomInRange(0, availableRobots.length)];
			const tokens = await robot.accessTokens.find();
			let token;
			if (tokens.length == 0) {
				const tokenObj = await Accounts.loginUser({
					email: robot.email,
					password: 'ai-ship',
				});
				if (!tokenObj) return Promise.resolve(Common.makeReturnValue(false, 'Robots/enter-map', Common.RETURN_TYPE.ERROR_ACCOUNT, 'wrong ai ship'));
				token = tokenObj.id.toString();
			} else {
				token = tokens[0].id.toString();
			}

			robot.player_state.current_location_id = mapId;
			await robot.updateAttribute('player_state', robot.player_state);

			Robot.app.websocket.generateRobot(mapId, token, 100, robot.id, robot.username);
			const res1 = await Cockpit.connectSocket(token, robot.id);
			if (!res1.Success) return Promise.resolve(Common.makeReturnValue(false, 'Accounts/enter-map', res1.msg));

			const res = await Cockpit.enterGameMap(token.id);
			if (!res.Success) return Promise.resolve(Common.makeReturnValue(false, 'Accounts/enter-map', res.msg));

			return Promise.resolve(Common.makeReturnValue(true, 'Accounts/enter-map', Common.RETURN_TYPE.Success, res.result));
		} catch(e) {
			return Promise.reject(e);
		}
	};*/

	Robot.entermapRobot = async(mapId, robot_cockpitId) => {
		const STPair = Robot.app.models.STPair;
		const MapPoints = Robot.app.models.MapPoints;
		const Cockpit = Robot.app.models.Cockpit;
		try {
			const result = MapPoints.getPointFromKey(mapId);
			if (!result) return Promise.resolve(Common.makeReturnValue(false, 'Robots/enter-map', 'invalid mapId'));
			const cockpit = await Cockpit.findById(robot_cockpitId);
			if (!cockpit) return Promise.resolve(Common.makeReturnValue(false, 'Robots/enter-map', 'invalid robotId'));

			const type = cockpit.type;
			const exitedRobot = await Cockpit.find({
				where: {
					mapId: mapId,
					type: type
				}
			});
			let socket_msg = {};
			if (type == 'asteroid') {
				if (exitedRobot.length > Common.MAX_ASTEROID_NUM) {
					return Promise.resolve(Common.makeReturnValue(false, 'Robots/enter-map', 'exceed Max astroid Count'));
				}
				socket_msg = {
					token: userToken,
					family_name: "as",
					full_hp: 100,
					current_hp: 100,
					visual_type: 0,
					minerals: []
				}
			} else if (type == 'avatar_ai') {
				if (exitedRobot.length > Common.MAX_AVARTAR_AI_NUM) {
					return Promise.resolve(Common.makeReturnValue(false, 'Robots/enter-map', 'exceed Max AI ship Count'));
				}
				socket_msg = {
					type: cockpit.type,
					avatar_token: userToken,
					avatar_name: userObj.username,
					guild_name: 'xxxx',
					defencer_token: cockpit.defencer_token,
					avatar_ship: userObj.getActivatedShip()
				};
			} else {
				return Promise.resolve(Common.makeReturnValue(false, 'Robots/enter-map', 'parameter wrong <type>'));
			}

			// const cockpit = await Cockpit.findOne({
			// 	where: {
			// 		username: robotObj.username,
			// 	}
			// });
			// if (!cockpit) {
			// 	return Promise.resolve(Common.makeReturnValue(false, 'Robots/enter-map', 'unregistered cockpit'));
			// }
			await cockpit.updateAttributes({
				mapId: mapId
			});
			Cockpit.app.websocket.socketEnterGameMap('avatar_ai', robot_cockpitId.toString(), mapId);
			return Promise.resolve(Common.makeReturnValue(true, 'Robots/enter-map', Common.RETURN_TYPE.Success, cockpit));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Robot.remoteMethod('entermapRobot', {
		accepts: [
			{arg: 'mapId', type: 'number', required: true, description: 'map Point ID'},
			{arg: 'robotId', type: 'string', required: true, description: 'map Point ID'},
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
		http: {path:'/enter-map', verb: 'post'}
	});

	Robot.leavemapRobot = async(robot_cockpitId) => {
		const Accounts = Robot.app.models.Accounts;
		const Cockpit = Robot.app.models.Cockpit;
		const MapPoints = Robot.app.models.MapPoints;
		try {
			const robot_cockpit = await Cockpit.findById(robot_cockpitId);
			if (!robot_cockpit) return Promise.resolve(Common.makeReturnValue(false, 'Robots/leave-map', 'invalid robotId'));
			
			Robot.app.websocket.socketLeaveGameMap(robot_cockpitId, robot_cockpit.username, robot_cockpitId, robot_cockpit.mapId);
			await robot_cockpit.updateAttribute('mapId', -1);

			return Promise.resolve(Common.makeReturnValue(true, 'Robots/leave-map', Common.RETURN_TYPE.Success, robot_cockpit));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Robot.remoteMethod('leavemapRobot', {
		accepts: [
			{arg: 'robotId', type: 'string', required: true, description: 'map Point ID'},
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
		http: {path:'/leave-map', verb: 'post'}
	});
	
	
/*	Robot.registerRobot = async(username) => {
		const Accounts = Robot.app.models.Accounts;
		const STPlayerState = Robot.app.models.STPlayerState;
		const STPossessionInfo = Robot.app.models.STPossessionInfo;
//		const STPair = Robot.app.models.STPair;
//		const STShipStateInfo = Robot.app.models.STShipStateInfo;
//		const MapPoints = Robot.app.models.MapPoints;
		try {
			const ship = await Accounts.findOne({
				where: {
					username: username,
				}
			});
			if (ship) {
				return Promise.resolve(Common.makeReturnValue(false, 'Robots/register-ai', 'the username is already exited'));
			}
//			const newShip = STShipStateInfo.generateRandom();
//			const mineral = STPair.generateRandom();
//			const newRobot = await Accounts.create({
//				mapId: mapId,
//				shipInfo: newShip,
//				mineral: mineral,
//			});
			const userObj = await Accounts.create({
				email: username + '@disapora.com',
				username: username,
				userId: username,
				realname: username,
				password: 'ai-ship',
				verified: true,
				createdAt: Date(),
				modifiedAt: Date(),
				register_ip: 'disapora',
				store_name: 'disapora',
				mac_address: 'mac_address',
				status: 1,
				player_state: STPlayerState.getDefaultVal(),
				possessionInfo: STPossessionInfo.getDefaultVal(),
				role: 'robot',
				register_type: 'game'
			});
			return Promise.resolve(Common.makeReturnValue(true, 'Robots/register-ai', Common.RETURN_TYPE.Success, userObj));
		} catch(e) {
			return Promise.reject(e);
		}
	};*/
/*	Robot.registerRobot = async(type, username) => {
		const Accounts = Robot.app.models.Accounts;
		// const Asteroid = Robot.app.models.Asteroid;
		const Cockpit = Robot.app.models.Cockpit;
		const STPair = Robot.app.models.STPair;
		const STShipStateInfo = Robot.app.models.STShipStateInfo;
		try {
			const ship = await Accounts.findOne({
				where: {
					username: username,
				}
			});
			if (ship) {
				return Promise.resolve(Common.makeReturnValue(false, 'Robots/register', 'the username is already exited'));
			}
			const robot = await Robot.findOne({
				where: {
					username: username,
				}
			});
			if (robot) {
				return Promise.resolve(Common.makeReturnValue(false, 'Robots/register', 'the robotname is already exited'));
			}
			// const asteroid = await Asteroid.findOne({
			// 	where: {
			// 		username: username,
			// 	}
			// });
			// if (asteroid) {
			// 	return Promise.resolve(Common.makeReturnValue(false, 'Asteroids/register', 'the asteroidName is already exited'));
			// }
			
			let shipInfo;
			if (type == 'asteroid') {
				shipInfo = {
					shipId: 101,
					hull: 100,
					equiped_skin: -1,
					Guns: [],
					Miscs: [],
					minerals: [STPair.generateRandom()]
				};
			} else if (type == 'avatar_ai') {
				shipInfo = STShipStateInfo.generateRandom();
				shipInfo.minerals = [STPair.generateRandom()];
			} else {
				return Promise.resolve(Common.makeReturnValue(false, 'Robots/register', 'wrong parameter <type>'));
			}
			const newRobot = await Robot.create({
				type: type,
				username: username,
				mapId: '-1',
				shipInfo: shipInfo,
			});
			await Cockpit.loginRobot(newRobot);
			return Promise.resolve(Common.makeReturnValue(true, 'Robots/register', Common.RETURN_TYPE.Success, newRobot));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Robot.remoteMethod('registerRobot', {
		accepts: [
			{arg: 'type', type: 'string', required: true, default: "avatar_ai", description: 'AI ship name'},
			{arg: 'username', type: 'string', required: true, description: 'AI ship name'},
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
		http: {path:'/register', verb: 'post'}
	});

	Robot.deleteRobot = async(shipId) => {
		try {
			const ship = await Robot.findById(shipId);
			if (!ship) return Promise.resolve(Common.makeReturnValue(false, 'Robots/del-ship', 'wrong shipId'));
			const res = await Robot.deleteById(shipId);
			return Promise.resolve(Common.makeReturnValue(true, 'Robots/del-ship', Common.RETURN_TYPE.Success, res));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Robot.remoteMethod('deleteRobot', {
		accepts: [
			{arg: 'mapId', type: 'string', required: true, description: 'map Point ID'},
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
		http: {path:'/del-ship', verb: 'post'}
	});*/

	
	/*Robot.getRobots = async(mapId) => {
		const MapPoints = Robot.app.models.MapPoints;
		try {
			const result = MapPoints.getPointFromKey(mapId);
			if (!result) return Promise.resolve(Common.makeReturnValue(false, 'Robots/ships', 'invalid mapId'));

			const ships = await Robot.find({
				fields: ['id', 'shipInfo'],
				where: {
					mapId: mapId,
				}
			});
			return Promise.resolve(Common.makeReturnValue(true, 'Robots/get-ships', Common.RETURN_TYPE.Success, ships));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Robot.remoteMethod('getRobots', {
		accepts: [
			{arg: 'mapId', type: 'string', required: true, description: 'map Point ID'},
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
		http: {path:'/get-ships', verb: 'post'}
	});*/

	
	Robot.createRobots = async() => {
		const Cockpit = Robot.app.models.Cockpit;
		const GuildAvatar = Robot.app.models.GuildAvatar;
		try {
			const robots = await Robot.find();
			await Promise.all(robots.map(async obj => {
				// await obj.cockpit.destroy();
				await Robot.deleteById(obj.id);
			}))
			await Cockpit.destroyAll({
				type: 'avatar_ai'
			})
			await GuildAvatar.destroyAll({});

			var robot_data = require('../../storage/AIGuildsData.json');
			await Promise.all(robot_data.map(async guildParty => {
				const guild = await GuildAvatar.create(guildParty);
				for (let i = 0; i < guildParty.ai_players.length; i++) {
					const robot_d = guildParty.ai_players[i];
					const newRobot = await guild.robots.create(robot_d);
					// await newRobot.updateAttribute('token', newAsteroid.id.toString());
				}
			}))
			return Promise.resolve();
		} catch(e) {
			return Promise.reject(e);
		}
	};
	
	Robot.prototype.loginCockpit = async function() {
		try {
			let cockpit = await this.cockpit.get();
			if (!cockpit) {
				cockpit = await this.cockpit.create({
					type: 'avatar_ai',
					username: this.ai_name,
					user_token: this.id.toString(),
					socketId: this.id.toString(),
					mapId: -1,
					defencer_token: null,
					robotId: this.id
				});
			}
			return Promise.resolve(cockpit);
		} catch(e) {
			return Promise.reject(e);
		}
	}

	Robot.prototype.loginToCockpit = async function() {
		try {
			let cockpit = await this.cockpit.get();
			if (!cockpit) {
				cockpit = await this.cockpit.create({
					type: 'avatar_ai',
					username: this.ai_name,
					user_token: this.id.toString(),
					socketId: this.id.toString(),
					mapId: -1,
					defencer_token: null,
					robotId: this.id
				});
			}
			return Promise.resolve(cockpit);
		} catch(e) {
			return Promise.reject(e);
		}
	}

	Array.prototype.getRandomItem = function() {
		return this[Math.floor(Math.random() * this.length)];
	}
	Robot.prototype.getNextMapId = async function() {
		const GuildAvatar = Robot.app.models.GuildAvatar;
		try {
			const cockpit = await this.cockpit.get();
			const guild = await GuildAvatar.findById(this.guildAvatarId);
			let idx = guild.path_points_id.indexOf(cockpit.mapId);
			if (idx >= 0) {
				if (idx == guild.path_points_id.length - 1) idx = 0;
				else idx++;
				return Promise.resolve(guild.path_points_id[idx]);
			}
			return Promise.resolve(guild.path_points_id.getRandomItem());
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Robot.prototype.enterGameMap = async function(mapId) {
		const MapPoints = Robot.app.models.MapPoints;
		try {
			const result = MapPoints.getPointFromKey(mapId);
			if (!result) return Promise.resolve();

			const cockpit = await this.loginToCockpit();
			if (cockpit) {
				if (cockpit.mapId == mapId) {
					return Promise.resolve(cockpit);
				}
			}
			await cockpit.updateAttributes({
				mapId: mapId
			});
			Robot.app.websocket.socketEnterGameMap(cockpit.id.toString(), mapId, this);
			setTimeout(async() => {
				await this.jumpGameMap(await this.getNextMapId());
			}, this.jump_delay * 1000);
			console.log('enter => robot:' + this.ai_name + ' mapId:' + mapId);
			return Promise.resolve(cockpit);
		} catch(e) {
			return Promise.reject(e);
		}
	}
	
	Robot.prototype.leaveGameMap = async function(isDied) {
		try {
			const robot_cockpit = await this.cockpit.get();
			if (!robot_cockpit) {
				console.error('robot_cockpit == null');
				return Promise.resolve(false);
			}
			
			Robot.app.websocket.socketLeaveGameMap(robot_cockpit.id, robot_cockpit.username, robot_cockpit.id, robot_cockpit.mapId);
			await robot_cockpit.updateAttribute('mapId', -1);
			console.log('leave => robot:' + this.ai_name);
			if (isDied) {
				setTimeout(async() => {
					await this.jumpGameMap(await this.getNextMapId());
				}, this.respawn_delay * 1000);
			}
			return Promise.resolve(robot_cockpit);
		} catch(e) {
			return Promise.reject(e);
		}
	}

	Robot.prototype.jumpGameMap = async function(mapId) {
		try {
			await this.leaveGameMap();
			await this.enterGameMap(mapId);
			setTimeout(async() => {
				await this.jumpGameMap(await this.getNextMapId());
			}, this.jump_delay * 1000);
			return Promise.resolve(mapId);
		} catch(e) {
			return Promise.reject(e);
		}
	}
};
