'use strict';
var Common = require('./common.js');

module.exports = function(Asteroid) {
	
	Asteroid.disableRemoteMethodByName("upsert");
	Asteroid.disableRemoteMethodByName("find");
	Asteroid.disableRemoteMethodByName("replaceOrCreate");
	Asteroid.disableRemoteMethodByName("create");
	Asteroid.disableRemoteMethodByName("prototype.updateAttributes");
	Asteroid.disableRemoteMethodByName("findById");
	Asteroid.disableRemoteMethodByName("exists");
	Asteroid.disableRemoteMethodByName("replaceById");
	Asteroid.disableRemoteMethodByName("deleteById");
	Asteroid.disableRemoteMethodByName("createChangeStream");
	Asteroid.disableRemoteMethodByName("count");
	Asteroid.disableRemoteMethodByName("findOne");
	Asteroid.disableRemoteMethodByName("update");
	Asteroid.disableRemoteMethodByName("upsertWithWhere");

	
	Asteroid.getAsteroid = async(mapId) => {
		const MapPoints = Asteroid.app.models.MapPoints;
		try {
			const result = MapPoints.getPointFromKey(mapId);
			if (!result) return Promise.resolve(Common.makeReturnValue(false, 'Asteroids/generate', 'invalid mapId'));

			const asteiods = await Asteroid.find({
				fields: ['id', 'minerals'],
				where: {
					mapId: mapId,
				}
			});
			return Promise.resolve(Common.makeReturnValue(true, 'Asteroids/get-asteroid', Common.RETURN_TYPE.Success, asteiods));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Asteroid.remoteMethod('getAsteroid', {
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
		http: {path:'/get-asteroid', verb: 'post'}
	});

	Asteroid.loginCockpit = async(asteroid) => {
		try {
			let cockpit = await asteroid.cockpit.get();
			if (!cockpit) {
				cockpit = await asteroid.cockpit.create({
					type: 'asteroid',
					username: 'asteroid',
					user_token: asteroid.id.toString(),
					socketId: asteroid.id.toString(),
					mapId: -1,
					defencer_token: null,
					asteroidId: asteroid.id
				});
			}
			return Promise.resolve(cockpit);
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Asteroid.enterGameMap = async(mapId, cockpitId) => {
		const Cockpit = Asteroid.app.models.Cockpit;
		try {
			const cockpit = await Cockpit.findById(cockpitId);
			if (!cockpit) throw "wrong cockpitId";
			
			const exitedRobot = await Cockpit.find({
				where: {
					mapId: mapId,
					type: 'asteroid'
				}
			});
			if (exitedRobot.length > Common.MAX_ASTEROID_NUM) {
				return Promise.resolve();
			}

			await cockpit.updateAttributes({
				mapId: mapId
			});
			const asteroid = await cockpit.asteroid.get();
			if (asteroid) {
				const data = {
					token: asteroid.token.toString(),
					family_name: asteroid.family_name,
					full_hp: asteroid.full_hp,
					current_hp: asteroid.current_hp,
					visual_type: asteroid.visual_type,
					minerals: asteroid.minerals,
				}
				Asteroid.app.websocket.socketEnterGameMap('asteroid', cockpit.id.toString(), cockpit.id.toString(), mapId, data);
			}
		} catch(e) {
			return Promise.reject(e);
		}
	}

	Asteroid.prototype.dropMinerals = async function(mapId) {
		const MapPoints = Asteroid.app.models.MapPoints;
		try {
			if (this.minerals.length > 0) {
				const mapPoint = await MapPoints.findOne({
					where: {
						mapId: mapId,
					}
				});
				if (mapPoint) {
					const pointMinerals = Common.addMinerals(this.minerals, mapPoint.minerals);
					await mapPoint.updateAttribute('minerals', pointMinerals);
					return Promise.resolve(pointMinerals);
				}
			}
			return Promise.resolve();
		} catch(e) {
			return Promise.reject(e);
		}
	}
	
	Asteroid.leaveGameMap = async(cockpitId) => {
		const Cockpit = Asteroid.app.models.Cockpit;
		try {
			const cockpit = await Cockpit.findById(cockpitId);
			if (!cockpit) throw "wrong cockpitId";
			
			Asteroid.app.websocket.socketLeaveGameMap(cockpitId.toString(), 'asteroid', cockpit.user_token, cockpit.mapId);
			await cockpit.updateAttribute('mapId', -1);

			return Promise.resolve(cockpit);
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Asteroid.jumpMap = async(mapId, cockpitId) => {
		try {
			await Asteroid.leaveGameMap(cockpitId);
			await Asteroid.enterGameMap(mapId, cockpitId);
			return Promise.resolve(mapId);
		} catch(e) {
			return Promise.reject(e);
		}
	}


	
	Asteroid.enterMapAsteroid = async(asteroidId, mapId) => {
		const STPair = Asteroid.app.models.STPair;
		const MapPoints = Asteroid.app.models.MapPoints;
		const Cockpit = Asteroid.app.models.Cockpit;
		try {
			const result = MapPoints.getPointFromKey(mapId);
			if (!result) return Promise.resolve(Common.makeReturnValue(false, 'Asteroids/enter-map', 'invalid mapId'));
			
			const asteroid = await Asteroid.findById(asteroidId);
			if (!asteroid) return Promise.resolve(Common.makeReturnValue(false, 'Asteroids/enter-map', 'invalid asteroidId'));

			let cockpit = await Asteroid.loginCockpit(asteroid);
			if (cockpit) {
				if (cockpit.mapId == mapId) {
					return Promise.resolve(Common.makeReturnValue(false, 'Asteroids/enter-map', 'this asteroid is already login'));
				}
			}

			await cockpit.updateAttributes({
				mapId: mapId
			});
			// const minerals = [];
			// for (let i = 0; i < 2; i++) {
				// minerals[i] = STPair.generateRandom();
			// }
			Cockpit.app.websocket.socketEnterGameMap(cockpit.id.toString(), mapId, asteroid);
			return Promise.resolve(Common.makeReturnValue(true, 'Asteroids/enter-map', Common.RETURN_TYPE.Success, cockpit));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Asteroid.remoteMethod('enterMapAsteroid', {
		accepts: [
			{arg: 'asteroidId', type: 'string', required: true, description: 'map Point ID'},
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
		http: {path:'/enter-map', verb: 'post'}
	});
	
	Asteroid.leaveMapAsteroid = async(asteroidId) => {
		const MapPoints = Asteroid.app.models.MapPoints;
		const Cockpit = Asteroid.app.models.Cockpit;
		try {			
			const asteroid = await Asteroid.findById(asteroidId);
			if (!asteroid) return Promise.resolve(Common.makeReturnValue(false, 'Asteroids/leave-map', 'invalid asteroidId'));

			let cockpit = await asteroid.cockpit.get();
			if (!cockpit) {
				return Promise.resolve(Common.makeReturnValue(false, 'Asteroids/enter-map', 'this asteroid is already login'));
			}

			await cockpit.updateAttributes({
				mapId: -1
			});
			Robot.app.websocket.socketLeaveGameMap(cockpit.id.toString(), cockpit.user_token, robot_cockpitId, robot_cockpit.mapId);
			return Promise.resolve(Common.makeReturnValue(true, 'Asteroids/enter-map', Common.RETURN_TYPE.Success, cockpit));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Asteroid.remoteMethod('leaveMapAsteroid', {
		accepts: [
			{arg: 'asteroidId', type: 'string', required: true, description: 'map Point ID'},
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



	// Asteroid.generateAsteroid = async(mapId) => {
	// 	const STPair = Asteroid.app.models.STPair;
	// 	const MapPoints = Asteroid.app.models.MapPoints;
	// 	try {
	// 		const result = MapPoints.getPointFromKey(mapId);
	// 		if (!result) return Promise.resolve(Common.makeReturnValue(false, 'Asteroids/generate', 'invalid mapId'));

	// 		const asteiods = await Asteroid.find({
	// 			where: {
	// 				mapId: mapId,
	// 			}
	// 		});
	// 		if (asteiods.length >= Common.MAX_ASTEROID_NUM) {
	// 			return Promise.resolve(Common.makeReturnValue(false, 'Asteroids/generate', 'exceed Max Asteroid Count'));
	// 		}
	// 		const minerals = [];
	// 		for (let i = 0; i < 2; i++) {
	// 			minerals[i] = STPair.generateRandom();
	// 		}
	// 		const newAsteroid = await Asteroid.create({
	// 			mapId: mapId,
	// 			minerals: minerals,
	// 		});
	// 		if (newAsteroid) {
	// 			Asteroid.app.websocket.generateAsteroid(mapId, newAsteroid.id, minerals);
	// 		}
	// 		return Promise.resolve(Common.makeReturnValue(true, 'Asteroids/generate', Common.RETURN_TYPE.Success, newAsteroid));
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	// };
	// Asteroid.remoteMethod('generateAsteroid', {
	// 	accepts: [
	// 		{arg: 'mapId', type: 'string', required: true, description: 'map Point ID'},
	// 	],
	// 	description: [
	// 		'(every)',
	// 	],
	// 	returns: {
    //         root: true,
	// 		arg: '',
	// 		type: 'object',
	// 		description: [
	// 			'return logined user info\n',
	// 		]
	// 	},
	// 	http: {path:'/generate', verb: 'post'}
	// });
	
	// Asteroid.deleteAsteroid = async(asteroidId) => {
	// 	try {
	// 		const asteroid = await Asteroid.findById(asteroidId);
	// 		const mapId = asteroid.mapId;
	// 		if (!asteroid) return Promise.resolve(Common.makeReturnValue(false, 'Asteroids/del-asteroid', 'wrong asteroid ID'));
	// 		const res = await Asteroid.deleteById(asteroidId);
	// 		if (res.count > 0) {
	// 			Asteroid.app.websocket.destroyAsteroid(mapId, asteroidId);
	// 		}
	// 		return Promise.resolve(Common.makeReturnValue(true, 'Asteroids/del-asteroid', Common.RETURN_TYPE.Success, res));
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	// };
	// Asteroid.remoteMethod('deleteAsteroid', {
	// 	accepts: [
	// 		{arg: 'asteroidId', type: 'string', required: true, description: 'map Point ID'},
	// 	],
	// 	description: [
	// 		'(every)',
	// 	],
	// 	returns: {
    //         root: true,
	// 		arg: '',
	// 		type: 'object',
	// 		description: [
	// 			'return logined user info\n',
	// 		]
	// 	},
	// 	http: {path:'/del-asteroid', verb: 'post'}
	// });

	Asteroid.createAsteroids = async() => {
		const Cockpit = Asteroid.app.models.Cockpit;
		try {
			var asteroid_data = require('../../storage/AsteroidData.json').asteroid_families;
			const asteroids = await Asteroid.find();
			await Promise.all(asteroids.map(async obj => {
				await obj.cockpit.destroy();
				await Asteroid.deleteById(obj.id);
			}))
			const cockpits = await Cockpit.find({
				where: {
					type: 'asteroid'
				}
			})
			await Cockpit.destroyAll({
				type: 'asteroid'
			})
			await Promise.all(asteroid_data.map(async data => {				
				for (let i = 0; i < data.max_asteroids; i++) {
					const minerals = [];
					data.minerals.forEach((mineral) => {
						minerals.push({
							table_id: mineral.id,
							current_value: Common.getIntRandomInRange(mineral.count.min, mineral.count.max)
						})
					})
					const full_hp = Common.getIntRandomInRange(data.full_hp.min, data.full_hp.max);
					const newAsteroid = await Asteroid.create({
						table_id: data.id,
						token: 'token',
						family_name: data.family_name,
						full_hp: full_hp,
						current_hp: full_hp,
						visual_type: data.visual_type,
						minerals: minerals,
						path_points_id: data.path_points_id,
						jump_delay: Common.getIntRandomInRange(data.jump_delay.min, data.jump_delay.max),
						respawn_delay: Common.getIntRandomInRange(data.respawn_delay.min, data.respawn_delay.max),
						experience: Common.getIntRandomInRange(data.experience.min, data.experience.max),
						money: Common.getIntRandomInRange(data.money.min, data.money.max)
					});
					await newAsteroid.updateAttribute('token', newAsteroid.id.toString());
				}
			}))
			return Promise.resolve();
		} catch(e) {
			return Promise.reject(e);
		}
	};
	
	// Asteroid.registerAsteroid = async(hp) => {
	// 	const Accounts = Asteroid.app.models.Accounts;
	// 	const Cockpit = Asteroid.app.models.Cockpit;
	// 	const Robot = Asteroid.app.models.Robot;
	// 	const STPair = Asteroid.app.models.STPair;
	// 	try {
	// 		const mineral = STPair.generateRandom();
	// 		const count = await Asteroid.count();
	// 		const newAsteroid = await Asteroid.create({
	// 			token: 'token',
	// 			family_name: '',
	// 			full_hp: 100,
	// 			current_hp: 100,
	// 			visual_type: 0,
	// 			minerals: [mineral],
	// 		});
	// 		await newAsteroid.updateAttribute('token', newAsteroid.id.toString());
	// 		await Cockpit.registerAsteroid(newAsteroid);
	// 		return Promise.resolve(Common.makeReturnValue(true, 'Asteroids/register', Common.RETURN_TYPE.Success, newAsteroid));
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	// };
	// Asteroid.remoteMethod('registerAsteroid', {
	// 	accepts: [
	// 		{arg: 'hp', type: 'number', required: true, description: 'AI ship name'},
	// 	],
	// 	description: [
	// 		'(every)',
	// 	],
	// 	returns: {
    //         root: true,
	// 		arg: '',
	// 		type: 'object',
	// 		description: [
	// 			'return logined user info\n',
	// 		]
	// 	},
	// 	http: {path:'/register', verb: 'post'}
	// });
};
