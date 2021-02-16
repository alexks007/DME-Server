
'use strict';

//var http = require('http');
const { resolve } = require('path');
const util = require('util');
const common = require('../../../common/models/common');
//const buypossession = require('../../../common/hangar/buypossession.js'); //Possession Code
const config = require('../../config.json');
const socket_pcport = config.socket_pcport;

const event_join_asteroid = "OnAsteroidPointJoin";
const event_join_avatar = "OnAvatarPointJoin";
const event_leave = "OnObjectPointLeave";
const event_fire_start = "OnPointStartFire";
const event_fire_stop = "OnPointStopFire";
const event_changed = "OnDamage";
const event_lootMinerals = "OnLootMinerals";


const clients = {};	//track connected clients
const players = {};
module.exports = function(WebSocketInstance) {

	WebSocketInstance.init = function(app) {
		WebSocketInstance.app = app;
		const httpServer = require('http').Server(app);
		
		//Start the Server
		httpServer.listen(socket_pcport, () => {
			console.log('listening on *:' + socket_pcport);
		});

		const io = require('socket.io')(httpServer);
		//When a client connects, bind each desired event to the client socket
		io.on('connection', socket => {
			//track connected clients via log
			clients[socket.id] = {
				socket: socket,
				username: '',
				user_token: '',
				mapId: '-1',
			};
			const clientConnectedMsg = 'User connected ' + util.inspect(socket.id) + ', total: ' + Object.keys(clients).length;
			console.log(clientConnectedMsg);



			
			socket.on('create', function(room) {
				console.log('created room: ' + room);
			});

//			socket.on(event_join, msg => {
//				clients[socket.id] = msg;
//				console.log('join:' + msg.userId);
//				socket.room = msg.mapId;
//				socket.join(mapId);
//			});

			//track disconnected clients via log
			socket.on('disconnect', ()=>{
				if (clients[socket.id]) {
					const username = clients[socket.id].username;
					const user_token = clients[socket.id].user_token;
					delete clients[socket.id];
					if (!user_token) {
						console.error(username + ': user_token null');
					} else {
						io.emit(event_leave, {
							user_token: user_token,
							socketId: socket.id
						});
						app.models.Cockpit.leaveGameMap(user_token, false, (e) => {
						});
						console.log('exit game:' + username);
					}
					socket.leave(socket.room);
				} else {
					console.error('disconnect error');
				}
			})
			socket.on(event_fire_start, msg => {
				console.log('start firing: ' + JSON.stringify(msg));
//				msg.attacker = 'sample';
//				msg.defencer = 'highdev';
//				io.to(msg.mapId).emit(event_fire_start, msg);
//				WebSocketInstance.firing(msg.attacker, msg.defencer, msg.mapId);
			});
			socket.on(event_fire_stop, msg => {
				console.log('stop firing: ' + JSON.stringify(msg));
//				msg.attacker = 'sample';
//				msg.defencer = 'highdev';
//				io.to(msg.mapId).emit(event_fire_stop, msg);
//				if (players[msg.attacker]) {
//					players[msg.attacker].isFiring = false;
//				}
			});
//			socket.on(event_hit, msg => {
//				console.log(msg);
//				io.to(msg.mapId).emit(event_changed, msg);
//			});
		});
		WebSocketInstance.wsServer = io;
	}
	
	function getCurrentHP(userObj) {
		const curShipIdx = userObj.possessionInfo.activeShipIdx;
		let curHP = 0;
		if (curShipIdx >= 0 && curShipIdx < userObj.possessionInfo.Ships.length) {
			curHP = userObj.possessionInfo.Ships[curShipIdx].hull;
		} else {
			console.error('curShipIdx error');
		}
		return curHP;
	}
	function setCurrentHP(cockpitObj, hp) {
		cockpitObj.updateAttribute('hp', hp, function(e) {
			if (e) console.error(e);
		});
		if (cockpitObj.type == 'avatar') {
			cockpitObj.user_token()
			const possessionInfo = userObj.possessionInfo;
			const curShipIdx = userObj.possessionInfo.activeShipIdx;
			if (curShipIdx >= 0 && curShipIdx < userObj.possessionInfo.Ships.length) {
				possessionInfo.Ships[curShipIdx].hull = hp;
				userObj.updateAttribute('possessionInfo', possessionInfo, function(e) {
					if (e) console.error(e);
				});
			} else {
				console.error('curShipIdx error');
			}
		} else {
		}
	}

	WebSocketInstance.startFiring = async(attackerToken, defencerToken, mapId, attackerObj, defencerObj) => {
		players[attackerToken] = {
			hp: 100, //attackerObj.hp,
			shield: 100,
			isFiring: true
		};
		players[defencerToken] = {
			hp: 100, //defencerObj.hp,
			shield: 100,
			isFiring: false
		}
		let refreshIntervalId = setInterval(async() => {
			const msg = {
				token: defencerToken,
				current_hp: players[defencerToken].hp,
				// shield: players[defencerToken].shield,
			}
			console.log('fire: ' + JSON.stringify(msg));
			WebSocketInstance.wsServer.to(mapId).emit(event_changed, msg);
			if (players[defencerToken].hp > 0 && players[attackerToken].isFiring) {
				players[defencerToken].hp -= 10;
				// await WebSocketInstance.broadCastGame(gameId);
			} else {
				if (players[defencerToken].hp <= 0) {
					players[attackerToken].isFiring  = false;
					players[defencerToken].hp = 0;
					await WebSocketInstance.app.models.Cockpit.leaveGameMap(defencerToken, true);
				}
				clearInterval(refreshIntervalId);
				refreshIntervalId = undefined;
				// const updatedHp = await WebSocketInstance.stopFire(attackerToken, defencerToken, mapId, defencerObj);
			}
		}, 1000);
	}

	WebSocketInstance.connectedSocket = (username, user_token, socketId) => {
		if (clients[socketId]) {
			clients[socketId].username = username;
			clients[socketId].user_token = user_token;
			clients[socketId].mapId = -1;
		} else {
			console.error('connectedSocket error: ' + username);
		}
		return clients;
	}
	WebSocketInstance.socketEnterGameMap = (type, socketId, user_token, mapId, data) => {
		if (type != 'avatar') {
		 	if (!clients[socketId]) {
		 		clients[socketId] = {};
		 	}
		}
		if (clients[socketId]) {
			// clients[socketId].username = username;
			clients[socketId].user_token = user_token;
			clients[socketId].mapId = mapId;
			if (type == 'avatar' || type == 'avatar_ai')  {
				if (type == 'avatar')
					clients[socketId].socket.join(mapId);
				WebSocketInstance.wsServer.to(mapId).emit(event_join_avatar, data);
				console.log('enter: (' + data.avatar_name + ') map:' + mapId);
			} else if (type == 'asteroid') {
				WebSocketInstance.wsServer.to(mapId).emit(event_join_asteroid, data);
				// console.log('enter: (asteroid) map:' + mapId);
			}
		} else {
			console.error('enterGameMap error: socketId')
		}
	}
	WebSocketInstance.socketLeaveGameMap = (socketId, username, user_token, mapId) => {
		// console.log('leave:' + username);
		if (clients[socketId] && clients[socketId].socket) {
			clients[socketId].socket.leave(mapId);
		}
		WebSocketInstance.wsServer.to(mapId).emit(event_leave, {
			// username: username,
			token: user_token,
			// mapId: mapId
		});
		// console.log('leave: (' + username + ') map:' + mapId);
	}
	// WebSocketInstance.destroyAsteroid = (mapId, id) => {
	// 	WebSocketInstance.wsServer.to(mapId).emit(event_leave, {
	// 		username: 'asteroid',
	// 		user_token: id,
	// 		mapId: mapId,
	// 	});
	// 	console.log('leave: (asteroid) map:' + mapId);
	// }
	WebSocketInstance.startFire = (attackerToken, defencerToken, mapId, attackerObj, defencerObj) => {
		const msg = {
			attacker_token: attackerToken,
			defencer_token: defencerToken,
			// gunType: 0,
			// mapId: mapId
		}
		WebSocketInstance.wsServer.to(mapId).emit(event_fire_start, msg);
		WebSocketInstance.startFiring(attackerToken, defencerToken, mapId, attackerObj, defencerObj);
		console.log('startfire: (' + msg.attacker + '->' + msg.defencer + ') map:' + mapId);
	}
	WebSocketInstance.stopFire = (attackerToken, defencerToken, mapId, defencerObj) => {
		const msg = {
			attacker_token: attackerToken,
			defencer_token: defencerToken,
			// gunType: 0,
			// mapId: mapId
		}
		WebSocketInstance.wsServer.to(mapId).emit(event_fire_stop, msg);
		let updatedHP = 0;
		if (players[attackerToken]) {
			players[attackerToken].isFiring = false;
			if (defencerToken) updatedHP = players[defencerToken].hp ? players[defencerToken].hp : 0;
			// if (players[defencerToken] && defencerObj) {
				// WebSocketInstance.app.models.Cockpit.updateHP(defencerObj, players[defencerToken].hp);
			// }
		}
		console.log('stopFire: (' + attackerToken + '->' + defencerToken + ') map:' + mapId);
		return updatedHP;
	}
	WebSocketInstance.OnLootMinerals = (mapId, minerals) => {
		const msg = {
			minerals: minerals
		}
		WebSocketInstance.wsServer.to(mapId).emit(event_lootMinerals, msg);
		console.log('OnLootMinerals: (' + minerals + ') map:' + mapId);
		return minerals;
	}

	// WebSocketInstance.generateAsteroid = (mapId, id, minerals) => {
	// 	WebSocketInstance.wsServer.to(mapId).emit(event_join, {
	// 		type: 'asteroid',
	// 		username: 'asteroid',
	// 		user_token: id,
	// 		mapId: mapId,
	// 		hp: 100,
	// 		minerals: minerals,
	// 	});
	// 	console.log('enter: (asteroid) map:' + mapId);
	// }

	WebSocketInstance.generateRobot = (mapId, robotId, hp, username, shipId) => {
		WebSocketInstance.wsServer.to(mapId).emit(event_join, {
			type: 'avatar_ai',
			username: username,
			user_token: robotId,
			shipId: shipId,
			mapId: mapId,
			hp: hp,
		});
		console.log('enter: (avatar_ai -> ' + username + ') map:' + mapId);
	}









	





}
