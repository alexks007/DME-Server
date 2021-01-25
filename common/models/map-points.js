'use strict';

var Common = require('./common.js');

module.exports = function(MapPoints) {
	MapPoints.disableRemoteMethodByName("upsert");
	MapPoints.disableRemoteMethodByName("find");
	MapPoints.disableRemoteMethodByName("replaceOrCreate");
	MapPoints.disableRemoteMethodByName("create");
	MapPoints.disableRemoteMethodByName("prototype.updateAttributes");
	MapPoints.disableRemoteMethodByName("findById");
	MapPoints.disableRemoteMethodByName("exists");
	MapPoints.disableRemoteMethodByName("replaceById");
	MapPoints.disableRemoteMethodByName("deleteById");
	MapPoints.disableRemoteMethodByName("createChangeStream");
	MapPoints.disableRemoteMethodByName("count");
	MapPoints.disableRemoteMethodByName("findOne");
	MapPoints.disableRemoteMethodByName("update");
	MapPoints.disableRemoteMethodByName("upsertWithWhere");

	
	MapPoints.updateMapData = async() => {
		try {
			const mapPoints = require('../../storage/PointsData.json');
			mapPoints.forEach(data => {
				data.mapId = data.ID;
				data.minerals = [];
			})
			const datas = await MapPoints.create(mapPoints);
			return Promise.resolve(Common.makeResult(true, 'success', datas));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	MapPoints.remoteMethod('updateMapData', {
		accepts: [
		],
		description: [
		],
		returns: {
			arg: 'res',
			type: 'string',
			description: [
			]
		},
		http: {path:'/update-data', verb: 'post'}
	});

	MapPoints.getMapPoints = async(access_token) => {
		const Accounts = MapPoints.app.models.Accounts;
		const mapPoints = MapPoints.app.models.GameConstants.mapPoints;
		try {
			// const userObj = await Accounts.getUserFromToken(access_token);
			// const results = [];
			// mapPoints.forEach((item) => {
			// 	let pointType = 0;
			// 	if (item.Type == 'point') pointType = 0;
			// 	else if (item.Type == 'gate') pointType = 1;
			// 	else if (item.Type == 'station') pointType = 2;
			// 	else if (item.Type == 'planet') pointType = 3;
			// 	else pointType = 0;
			// 	results.push({
			// 		key: item.key,
			// 		EconomicCondition: item.EconomicCondition,
			// 		ID: item.ID,
			// 		XPos: item.XPos,
			// 		YPos: item.YPos,
			// 		Name: item.Name,
			// 		pointType: pointType,
			// 		Connections: item.Connections,
			// 		Galaxy: item.Galaxy,	
			// 	})
			// })
			const results = await MapPoints.find();
			return Promise.resolve(Common.makeReturnValue(true, 'MapPoints/get-map', Common.RETURN_TYPE.Success, {
				points: results
			}));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	MapPoints.remoteMethod('getMapPoints', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true},
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
		http: {path:'/get-map', verb: 'post'}
	});

	
	MapPoints.getPointFromKey = (mapId) => {
		const mapPoints = MapPoints.app.models.GameConstants.mapPoints;
		for (let i = 0; i < mapPoints.length; i++) {
			if (mapPoints[i].ID == mapId) {
				return mapPoints[i];
			}
		}
		return null;
	}
	MapPoints.isValidJumpId = (currentId, newId) => {
		if (currentId == newId) {
			return Common.makeReturnValue(false, 'MapPoints/jump-map', 'currentId is equal with newId');
		}
		const mapPoints = MapPoints.app.models.GameConstants.mapPoints;
		const currentPoint = MapPoints.getPointFromKey(currentId);
		if (!currentPoint) {
			return Common.makeReturnValue(false, 'MapPoints/jump-map', 'current Location error');
		}
		if (currentPoint.Connections) {
			for (let i = 0; i < currentPoint.Connections.length; i++) {
				if (currentPoint.Connections[i] == newId) {
					return Common.makeReturnValue(true);
				}
			}
		}
		return Common.makeReturnValue(false, 'MapPoints/jump-map', 'cannot find connection');
	}

	MapPoints.jumpMapPoints = async(access_token, newMapId) => {
		const Accounts = MapPoints.app.models.Accounts;
		const Cockpit = MapPoints.app.models.Cockpit;
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			const current_location_id = userObj.player_state.current_location_id;
			const result = MapPoints.isValidJumpId(current_location_id, newMapId);
			if (!result.success) return result;
			
			let res = await Cockpit.leaveGameMap(access_token);
			if (!res.success) {
				return Promise.resolve(Common.makeReturnValue(false, 'MapPoints/jump-map', 'leave map failed'));
			}
			const player_state = userObj.player_state;
			player_state.current_location_id = newMapId;
			await userObj.updateAttribute('player_state', player_state);

			res = await Cockpit.enterGameMap(access_token);
			if (!res.success) {
				return Promise.resolve(Common.makeReturnValue(false, 'MapPoints/jump-map', 'enter map failed'));
			}
			return Promise.resolve(Common.makeReturnValue(true, 'MapPoints/jump-map', Common.RETURN_TYPE.Success, {
				avatars: res.avatars,
				asteroids: res.asteroids,
				minerals: res.minerals,
				satellit: res.satellites,
				jump_point_id: newMapId
			}));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	MapPoints.remoteMethod('jumpMapPoints', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true},
			{arg: 'mapId', type: 'number', required: true},
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
		http: {path:'/jump-map', verb: 'post'}
	});
};
