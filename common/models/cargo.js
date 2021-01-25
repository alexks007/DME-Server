'use strict';

var Common = require('./common.js');

module.exports = function(Cargo) {

	Cargo.disableRemoteMethodByName("upsert");
	Cargo.disableRemoteMethodByName("find");
	Cargo.disableRemoteMethodByName("replaceOrCreate");
	Cargo.disableRemoteMethodByName("create");
	Cargo.disableRemoteMethodByName("prototype.updateAttributes");
	Cargo.disableRemoteMethodByName("findById");
	Cargo.disableRemoteMethodByName("exists");
	Cargo.disableRemoteMethodByName("replaceById");
	Cargo.disableRemoteMethodByName("deleteById");
	Cargo.disableRemoteMethodByName("createChangeStream");
	Cargo.disableRemoteMethodByName("count");
	Cargo.disableRemoteMethodByName("findOne");
	Cargo.disableRemoteMethodByName("update");
	Cargo.disableRemoteMethodByName("upsertWithWhere");

/*	Cargo.buyItem = async(userToken, itemType, itemId) => {
		const Accounts = Cargo.app.models.Accounts;
		const STShipStateInfo = Accounts.app.models.STShipStateInfo;
		try {
			const userObj = await Accounts.getUserFromToken(userToken);
			if (!userObj) return Promise.resolve(Common.makeReturnValue(false, 'Cargos/buyItem', Common.RETURN_TYPE.ERROR_Token));
			if (itemType == Common.CargoItemType.Ship) {
				const shipInfo = new STShipStateInfo();
				const ship = {
					shipId: itemId,
					hull: 100,
					equipedSkin: -1,
					Guns: [],
					Miscs: [],
					minerals: []
				};
				userObj.possessionInfo.Ships.push(ship);
				await userObj.save();
			}
			return Promise.resolve(Common.makeReturnValue(false, 'Cargos/buyItem', Common.RETURN_TYPE.Success, {
				avatars: []
			}));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Cargo.remoteMethod('buyItem', {
		accepts: [
			{arg: 'userToken', type: 'string', required: true, description: 'user token'},
			{arg: 'itemType', type: 'number', required: true, description: 'CargoItemType'},
			{arg: 'itemId', type: 'number', required: true, description: 'item ID'},
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
		http: {path:'/buyItem', verb: 'post'}
	});*/

	function addMinerals(srcAry, dstAry, isSubstract) {
		if (!srcAry) srcAry = [];
		if (!dstAry) dstAry = [];
		for (let i = 0; i < srcAry.length; i++) {
			let isFind = false;
			for (let k = 0; k < dstAry.length; k++) {
				if (srcAry[i].table_id == dstAry[k].table_id) {
					const current_value = parseInt(srcAry[i].current_value);
					if (isSubstract) {
						dstAry[k].current_value -= current_value;
					} else {
						dstAry[k].current_value += current_value;
					}
					isFind = true;
					break;
				}
			}
			if (!isFind && !isSubstract) {
				dstAry.push(srcAry[i]);
			}
		}
		return dstAry;
	}

	Cargo.lootCargo = async(userToken, minerals) => {
		const Accounts = Cargo.app.models.Accounts;
		const MapPoints = Cargo.app.models.MapPoints;
		try {
			const userObj = await Accounts.getUserFromToken(userToken);
			if (!userObj) return Promise.resolve(Common.makeReturnValue(false, 'Cargos/lootCargo', Common.RETURN_TYPE.ERROR_Token));
			
			if (minerals.length == 0) {
				return Promise.resolve(Common.makeReturnValue(false, 'Cargos/lootCargo', 'minerals.length == 0'));
			}
			
			const mapId = userObj.player_state.current_location_id;
			const mapPoint = await MapPoints.findOne({
				where: {
					mapId: mapId,
				}
			});
			if (!mapPoint) return Promise.resolve(Common.makeReturnValue(false, 'Cargos/lootCargo', 'wrong mapId'));

			const curShip = userObj.getActivatedShip();
			let pointMinerals = [];
			console.log('parmeter:' + JSON.stringify(minerals));
			console.log('--start map:' + mapPoint.minerals + ' ship:' + curShip.minerals);
			curShip.minerals = Common.addMinerals(minerals, curShip.minerals);
			pointMinerals = Common.addMinerals(minerals, mapPoint.minerals, true);
			await mapPoint.updateAttribute('minerals', pointMinerals);
			console.log('--result map:' + pointMinerals, ' ship:' + curShip.minerals);
			// if (minerals[0].current_value > 0) { // loot
			// } else { //drop
			// 	curShip.minerals = Common.addMinerals(minerals, curShip.minerals, true);
			// 	pointMinerals = Common.addMinerals(minerals, mapPoint.minerals, false);
			// 	await mapPoint.updateAttribute('minerals', pointMinerals);
			// }
			Cargo.app.websocket.OnLootMinerals(mapId, pointMinerals);
			await userObj.save();
			return Promise.resolve(Common.makeReturnValue(true, 'Cargos/lootCargo', Common.RETURN_TYPE.Success, {
				minerals: minerals
			}));
		} catch(e) {
			return Promise.reject(e);
		}
	};
	Cargo.remoteMethod('lootCargo', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'user token'},
			{arg: 'minerals', type: 'array', required: true, description: 'cargoInfo Array'},
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
		http: {path:'/lootCargo', verb: 'post'}
	});

};
