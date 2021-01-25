
'use strict';

//var http = require('http');
// const { resolve } = require('path');
const Common = require('../../../common/models/common');
const config = require('../../config.json');


module.exports = function(ServerMain) {

 	ServerMain.start = async function(app) {
		console.log('--starting progress--');
 		ServerMain.app = app;

		// ServerMain.timerCheckAsteroid();
		await ServerMain.loginAsteroids();
		await ServerMain.loginRobots();
		
		ServerMain.startTimerAsteroid();
		// ServerMain.timerLeaveRobot('asteroid', 25000);
		// ServerMain.timerEnterRobot('avatar_ai', 20000);
		// ServerMain.timerLeaveRobot('avatar_ai', 35000);
 	}
	
	// ServerMain.timerCheckAsteroid = () => {
	// 	const Cockpit = ServerMain.app.models.Cockpit;
	// 	const Asteroid = ServerMain.app.models.Asteroid;
	// 	// const mapPoints = ServerMain.app.models.GameConstants.mapPoints;
	// 	setTimeout(async() => {
	// 		const cockpits = await Cockpit.find({
	// 			where: {
	// 				mapId: {neq: -1}
	// 			}
	// 		})
	// 		cockpits.forEach(async cockpit => {
	// 			const mapId = cockpit.mapId;
	// 			if (cockpits.length > 0) {
	// 				await Asteroid.generateAsteroid(mapId);
	// 			}
	// 		});
	// 		ServerMain.timerCheckAsteroid();
	// 	}, 3000);
	// }
	
	ServerMain.loginAsteroids = async() => {
		const Asteroid = ServerMain.app.models.Asteroid;
		try {
			await Asteroid.createAsteroids();
			const asteroids = await Asteroid.find();
			await Promise.all(asteroids.map(async asteroid => {
				await Asteroid.loginCockpit(asteroid);
			}));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	ServerMain.loginRobots = async() => {
		const Robot = ServerMain.app.models.Robot;
		try {
			await Robot.createRobots();
			ServerMain.startTimerRobot();
		} catch(e) {
			return Promise.reject(e);
		}
	}

	ServerMain.jumpAsteroid = async(cockpitId, family) => {
		const Cockpit = ServerMain.app.models.Cockpit;
		const Asteroid = ServerMain.app.models.Asteroid;
		try {
			const cockpit = await Cockpit.findById(cockpitId);
			if (cockpit.mapId > 0) {
				const time_jump = Common.getIntRandomInRange(family.jump_delay.min, family.jump_delay.max);
				setTimeout(async() => {
					const mapId_jump = family.path_points_id[Common.getIntRandomInRange(0, family.path_points_id.length - 1)];
					await Asteroid.jumpMap(mapId_jump, cockpitId);
					// await Asteroid.leaveGameMap(cockpitId);
					// console.log('###asteroid jump: ' + mapId_jump + ' id:' + cockpitId + ' family:' + family.family_name);
					ServerMain.jumpAsteroid(cockpitId, family);
				}, time_jump * 1000);
			}
		} catch(e) {
			return Promise.reject(e);
		}
	}

	ServerMain.jumpRobot = async(cockpitId, family) => {
		const Cockpit = ServerMain.app.models.Cockpit;
		const Asteroid = ServerMain.app.models.Asteroid;
		try {
			const cockpit = await Cockpit.findById(cockpitId);
			if (cockpit.mapId > 0) {
				const time_jump = Common.getIntRandomInRange(family.jump_delay.min, family.jump_delay.max);
				setTimeout(async() => {
					const mapId_jump = family.path_points_id[Common.getIntRandomInRange(0, family.path_points_id.length - 1)];
					await Asteroid.jumpMap(mapId_jump, cockpitId);
					// await Asteroid.leaveGameMap(cockpitId);
					// console.log('###asteroid jump: ' + mapId_jump + ' id:' + cockpitId + ' family:' + family.family_name);
					ServerMain.jumpAsteroid(cockpitId, family);
				}, time_jump * 1000);
			}
		} catch(e) {
			return Promise.reject(e);
		}
	}

	ServerMain.startTimerAsteroid = async() => {
		const Cockpit = ServerMain.app.models.Cockpit;
		const Asteroid = ServerMain.app.models.Asteroid;
		const asteroid_families = require('../../../storage/AsteroidData.json').asteroid_families;
		try {
			// const asteroids = await Asteroid.find({
			// 	where: {

			// 	},
			// 	include: {
			// 		relation: "cockpit",
			// 		scope: {
			// 			fields: ['id', 'type', 'socketId', 'user_token', 'defencer_token', 'mapId'],
			// 		}
			// 	}
			// });
			let cockpits = await Cockpit.find({
				where: {
					'type': 'asteroid'
				},
				include: {
					relation: "asteroid",
					scope: {
						fields: ['id', 'table_id', 'token', 'family_name', 'full_hp', 'current_hp', 'visual_type', 'minerals', 'path_points_id', 'jump_delay', 'respawn_delay', 'experience', 'money'],
					}
				}
			});
			cockpits = JSON.parse(JSON.stringify(cockpits));
			let family_cockpits = [];
			asteroid_families.forEach(family => {
				let data = [];
				cockpits.forEach(cockpit => {
					if (cockpit.asteroid) {
						if (cockpit.asteroid.family_name == family.family_name) {
							data.push({
								family: family,
								cockpit: cockpit,
								asteroid: cockpit.asteroid
							})
						}
					}
				});
				family_cockpits.push(data);
			});
			let isFull = true;
			for (let i = 0; i < family_cockpits.length; i++) {
				for (let k = 0; k < family_cockpits[i].length; k++) {
					const family = family_cockpits[i][k].family;
					const cockpit = family_cockpits[i][k].cockpit;
					const asteroid = family_cockpits[i][k].asteroid;

					const time_respawn = Common.getIntRandomInRange(family.respawn_delay.min, family.respawn_delay.max);
					const mapId = family.path_points_id[Common.getIntRandomInRange(0, family.path_points_id.length - 1)];
					const cockpitId = cockpit.id;
					if (cockpit.mapId == -1) {
						await Asteroid.enterGameMap(mapId, cockpitId);
						// console.log('###asteroid enter: ' + mapId + ' id:' + cockpitId + ' family:' + family.family_name);
						setTimeout(async() => {
							await ServerMain.startTimerAsteroid();
						}, time_respawn * 1000);
						await ServerMain.jumpAsteroid(cockpitId, family);
						// setTimeout(async() => {
						// 	const mapId_jump = family.path_points_id[Common.getIntRandomInRange(0, family.path_points_id.length - 1)];
						// 	await Asteroid.jumpMap(mapId_jump, cockpitId);
						// 	// await Asteroid.leaveGameMap(cockpitId);
						// 	console.log('###asteroid jump: ' + mapId_jump + ' id:' + asteroid.id + ' family:' + family.family_name);
						// }, time_jump * 1000);
						isFull = false;
						break;
					} else {
					}
				}
			}
			// if (isFull) {
			// 	await Asteroid.leaveGameMap(cockpitId);
			// 	console.log('###asteroid leave id:' + asteroid.id + ' family:' + family.family_name);
			// 	setTimeout(async() => {
			// 		await ServerMain.startTimerAsteroid();
			// 	}, time_respawn * 1000);
			// }
		} catch(e) {
			return Promise.reject(e);
		}
	}

	ServerMain.startTimerRobot = async() => {
		const GuildAvatar = ServerMain.app.models.GuildAvatar;
		try {
			let guilds = await GuildAvatar.find();
			for (let i = 0; i < guilds.length; i++) {
				const robots = await guilds[i].robots.find({});
				const path_points_id = guilds[i].path_points_id;
				for (let k = 0; k < robots.length; k++) {
					const robot = robots[k];
					let cockpit = await robot.cockpit.get();
					if (!cockpit) {
						cockpit = await robot.loginCockpit();
						if (cockpit.mapId == -1) {
							const newMapId = path_points_id.getRandomItem();
							robot.enterGameMap(newMapId);
							setTimeout(async() => {
								ServerMain.startTimerRobot();
							}, robot.respawn_delay * 1000);
							break;
						} else {
						}
					}
				}
			}
		} catch(e) {
			return Promise.reject(e);
		}
	}

	ServerMain.timerEnterRobot = (type, time) => {
		const Cockpit = ServerMain.app.models.Cockpit;
		const Robot = ServerMain.app.models.Robot;
		const Asteroid = ServerMain.app.models.Asteroid;
		// const mapPoints = ServerMain.app.models.GameConstants.mapPoints;
		setTimeout(async() => {
			try {
				const cockpits = await Cockpit.find({
					where: {
						mapId: {neq: '-1'},
						type: 'avatar'
					}
				})
				// const cockpits = [
				// 	{
				// 		mapId: 10065
				// 	}
				// ]
				for (let i = 0; i < cockpits.length; i++) {
					const mapId = cockpits[i].mapId;
					const robot_cockpitId = await ServerMain.chooseEnterRobot(mapId, type);
					// if (robot_cockpitId) await Robot.entermapRobot(mapId, robot_cockpitId);
					if (robot_cockpitId) {
						if (type == 'asteroid') {
							await Asteroid.enterGameMap(mapId, robot_cockpitId);
						}
					}
					else {
						break;
					}
				}
				ServerMain.timerEnterRobot(type, time);
			} catch(e) {
				return Promise.reject(e);
			}
		}, time);
	}

	ServerMain.timerLeaveRobot = (type, time) => {
		const Cockpit = ServerMain.app.models.Cockpit;
		const Robot = ServerMain.app.models.Robot;
		const Asteroid = ServerMain.app.models.Asteroid;
		// const mapPoints = ServerMain.app.models.GameConstants.mapPoints;
		setTimeout(async() => {
			try {
				const cockpits = await Cockpit.find({
					where: {
						mapId: {neq: '-1'},
						type: type
					}
				})
				for (let i = 0; i < cockpits.length; i++) {
					const mapId = cockpits[i].mapId;
					const robotId = await ServerMain.chooseleaveRobot(mapId, type);
					if (robotId) {
						if (type == 'asteroid') {
							await Asteroid.leaveGameMap(robotId);
						} else {
							await Robot.leavemapRobot(robotId);
						}
					}
					else break;
				}
				ServerMain.timerLeaveRobot(type, time);
			} catch(e) {
				return Promise.reject(e);
			}
		}, time);
	}

	ServerMain.chooseEnterRobot = async(mapId, type) => {
		const Cockpit = ServerMain.app.models.Cockpit;
		try {
			const cockpits = await Cockpit.find({
				where: {
					mapId: {neq: mapId},
					type: type
				}
			});
			if (cockpits.length == 0) {
				return Promise.resolve(null);
			}
			const robot_cockpit = cockpits[Common.getIntRandomInRange(0, cockpits.length - 1)];
			return Promise.resolve(robot_cockpit.id);
		} catch(e) {
			return Promise.reject(e);
		}
	}
	ServerMain.chooseleaveRobot = async(mapId, type) => {
		const Cockpit = ServerMain.app.models.Cockpit;
		try {
			const cockpits = await Cockpit.find({
				where: {
					mapId: mapId,
					type: type
				}
			});
			if (cockpits.length == 0) {
				return Promise.resolve(null);
			}
			const robot_cockpit = cockpits[Common.getIntRandomInRange(0, cockpits.length - 1)];
			return Promise.resolve(robot_cockpit.id);
		} catch(e) {
			return Promise.reject(e);
		}
	}
}
