'use strict';

var Common = require('./common.js');

module.export = function(Hangar) {

	Hangar.disableRemoteMethodByName("upsert");
	Hangar.disableRemoteMethodByName("find");
	Hangar.disableRemoteMethodByName("replaceOrCreate");
	Hangar.disableRemoteMethodByName("create");
	Hangar.disableRemoteMethodByName("prototype.updateAttributes");
	Hangar.disableRemoteMethodByName("findById");
	Hangar.disableRemoteMethodByName("exists");
	Hangar.disableRemoteMethodByName("replaceById");
	Hangar.disableRemoteMethodByName("deleteById");
	Hangar.disableRemoteMethodByName("createChangeStream");
	Hangar.disableRemoteMethodByName("count");
	Hangar.disableRemoteMethodByName("findOne");
	Hangar.disableRemoteMethodByName("update");
	Hangar.disableRemoteMethodByName("upsertWithWhere");

	const gunJson = require('../../storage/GunsStaticData.json');
	const miscJson = require('../../storage/MiscStaticData.json');
	const shipJson = require('../../storage/ShipsStaticData.json');
	const shipskinJson = require('../../storage/ShipSkinsData.json');
	const deck_array = [0,1000,1000,1500,2000,2500,3000];

	//BuyPossesion
	Hangar.buyPossession = async(access_token, table_objects, decks) => {
		const Accounts = Hangar.app.models.Accounts;
		var deck_money = 0;
		decks.forEach(deck_index => {
			deck_money += deck_array[deck_index];
		});
		var ret_request = {
			"table_objects": table_objects,
			"decks": decks,
			"request_name": "Buy Possession"
		};
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			const moneyDC = userObj.player_state.money_dc;
			if (table_objects.type == "gun") {
				gunJson.forEach(guns => {
					if (table_objects.table_id == guns.ID) {
						if (moneyDC < guns.CostPrice + deck_money) {
							return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"No Money",ret_request));
						} else {
							//Update User Money
							userObj.player_state.money_dc = moneyDC - guns.CostPrice - deck_money;
							decks.forEach(deck_index => {
								userObj.possessionInfo.decks[deck_index] = "";
							});
							//Update Possesion
							userObj.possessionInfo.inventory.guns.push(guns);
							return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Gun Buy Success",ret_request));
						}
					}
				});
			}
			if (table_objects.type == "ship") {
				shipJson.forEach(ships => {
					if (table_objects.table_id == ships.ID) {
						if (moneyDC < ships.CostPrice + deck_money) {
							return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"No Money",ret_request));
						} else {
							//Update User Money
							userObj.player_state.money_dc = moneyDC - ships.CostPrice - deck_money;
							//Update Possesion
							decks.forEach(deck_index => {
								userObj.possessionInfo.decks[deck_index] = "";
							});
							userObj.possessionInfo.inventory.ships.push(ships);
							return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Ship Buy Success",ret_request));
						}
					}
				});
			}
			if (table_objects.type == "misc") {
				miscJson.forEach(miscs => {
					if (table_objects.table_id == miscs.ID) {
						if (moneyDC < miscs.CostPrice + deck_money) {
							return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"No Money",ret_request));
						} else {
							//Update User Money
							userObj.player_state.money_dc = moneyDC - miscs.CostPrice - deck_money;
							//Update Possesion
							decks.forEach(deck_index => {
								userObj.possessionInfo.decks[deck_index] = "";
							});
							userObj.possessionInfo.inventory.miscs.push(miscs);
							return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Misc Buy Success",ret_request));
						}
					}
				});
			}
			if (table_objects.type == "ship_skin") {
				shipskinJson.forEach(shipskins => {
					if (table_objects.table_id == shipskins.ID) {
						if (moneyDC < shipskins.CostPrice + deck_money) {
							return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"No Money",ret_request));
						} else {
							//Update User Money
							userObj.player_state.money_dc = moneyDC - shipskins.CostPrice - deck_money;
							//Update Possesion
							decks.forEach(deck_index => {
								userObj.possessionInfo.decks[deck_index] = "";
							});
							userObj.possessionInfo.inventory.ship_skins.push(shipskins);
							return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Ship Skin Buy Success",ret_request));
						}
					}
				});
			}
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Hangar.remoteMethod('buyPossesion', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true},
			{arg: 'table_objects', type: 'object', required: true},
			{arg: 'decks', type: 'array', required: true}
		],
		description: [
			'(every)',
		],
		returns: {
			root: true,
			arg: '',
			type: 'object',
			description: [
				'return HangarCB',
			]
		},
		http: {path: '/buy-possesion', verb: 'post'}
	});

	//SellPossesion
	Hangar.sellPossession = function(access_token,uniq_objects,uniq_skins,singleton_skins,decks) {
		const Accounts = Hangar.app.models.Accounts;
		var deck_money = 0;
		decks.forEach(deck_index => {
			deck_money += deck_array[deck_index];
		});
		var ret_request = {
			"uniq_objects": uniq_objects,
			"uniq_skins": uniq_skins,
			"singleton_skins":singleton_skins,
			"decks":decks,
			"request_name": "Sell Possession"
		};
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			if(uniq_objects.type == "ship") {
				userObj.possessionInfo.inventory.ships.forEach(shipobject => {
					if(shipobject.uniq_id == uniq_objects.table_id) {
						shipobject.guns.forEach(shipobjectgun => {
							userObj.possessionInfo.inventory.guns.push(shipobjectgun);
						});
						shipobject.miscs.forEach(shipobjectmisc => {
							userObj.possessionInfo.inventory.miscs.push(shipobjectmisc);
						});
						if(shipobject.equiped_skin != -1)
							userObj.possessionInfo.inventory.ship_skins.push(shipobject.equiped_skin);
						shipJson.forEach(shipselectobject => {
							if(shipselectobject.ID == shipobject.table_id) {
								userObj.player_state.money_dc += shipselectobject.CostPrice + deck_money;
								userObj.possessionInfo.inventory.ships.pop(shipobject);
								decks.forEach(deck_index => {
									delete userObj.possessionInfo.decks[deck_index];
								});
								return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Ship sell Success",ret_request));
							}
						});
					}
				});
			} 
			else if(uniq_objects.type == "gun") {
				let isequip = 0;
				userObj.possessionInfo.inventory.guns.forEach(gunobject => {
					if(gunobject.uniq_id == uniq_objects.table_id) {
						isequip = 1;
						gunJson.forEach(gunjsonobject => {
							if(gunjsonobject.ID == gunobject.table_id) {
								userObj.player_state.money_dc += gunjsonobject.CostPrice + deck_money;
								userObj.possessionInfo.inventory.guns.pop(gunobject);
								decks.forEach(deck_index => {
									delete userObj.possessionInfo.decks[deck_index];
								});
								return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Gun sell Success",ret_request));
							}
						});
					}
				});
				if(isequip == 0) {
					userObj.possessionInfo.inventory.ships.forEach(guneveryoject => {
						guneveryoject.guns.forEach(gunobject => {
							if(gunobject.uniq_id == uniq_objects.table_id) {
								gunJson.forEach(gunjsonobject => {
									if(gunjsonobject.ID == gunobject.table_id) {
										if(gunobject.equiped_skin != -1) userObj.possessionInfo.inventory.gun_skins.push(gunobject.equiped_skin);
										userObj.player_state.money_dc += gunjsonobject.CostPrice + deck_money;
										guneveryoject.guns.pop(gunobject);
										decks.forEach(deck_index => {
											delete userObj.possessionInfo.decks[deck_index];
										});
										return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Gun sell Success",ret_request));
									}
								});
							}
						});
					});
				}
			}
			else if(uniq_objects.type == "misc") {
				let isequip = 0;
				userObj.possessionInfo.inventory.miscs.forEach(miscobject => {
					if(miscobject.uniq_id == uniq_objects.table_id) {
						isequip = 1;
						miscJson.forEach(miscjsonobject => {
							if(miscjsonobject.ID == miscobject.table_id) {
								userObj.player_state.money_dc += miscjsonobject.CostPrice + deck_money;
								userObj.possessionInfo.inventory.miscs.pop(miscobject);
								decks.forEach(deck_index => {
									delete userObj.possessionInfo.decks[deck_index];
								});
								return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Misc sell Success",ret_request));
							}
						});
					}
				});
				if(isequip == 0) {
					userObj.possessionInfo.inventory.ships.forEach(guneveryoject => {
						guneveryoject.miscs.forEach(miscobject => {
							if(miscobject.uniq_id == uniq_objects.table_id) {
								miscJson.forEach(miscjsonobject => {
									if(miscjsonobject.ID == miscobject.table_id) {
										userObj.player_state.money_dc += miscjsonobject.CostPrice + deck_money;
										guneveryoject.miscs.pop(miscobject);
										decks.forEach(deck_index => {
											delete userObj.possessionInfo.decks[deck_index];
										});
										return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Misc sell Success",ret_request));
									}
								});
							}
						});
					});
				}
			}
//			else return "error";
			if(uniq_skins.type == "ship_skin") {
				let isequip = 0;
				userObj.possessionInfo.inventory.ship_skins.forEach(shipskinobject => {
					if(shipskinobject == uniq_skins.object_uniq_id) {
						isequip = 1;
						shipskinJson.forEach(shipskineveryobject => {
							if(shipskineveryobject.ID == uniq_skins.table_id) {
								userObj.player_state.money_dc += shipskineveryobject.CostPrice + deck_money;
								userObj.possessionInfo.inventory.ship_skins.pop(shipskinobject);
								decks.forEach(deck_index => {
									delete userObj.possessionInfo.decks[deck_index];
								});
								return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Ship Skin sell Success",ret_request));
							}
						});
					}
				});
				if(isequip == 1) {
					userObj.possessionInfo.inventory.ships.forEach(shipskineachobject => {
						if(shipskineachobject.equiped_skin == uniq_skins.object_uniq_id) {
							shipskinJson.forEach(shipskineveryobject => {
								if(shipskineveryobject.ID == uniq_skins.table_id) {
									userObj.player_state.money_dc += shipskineveryobject.CostPrice + deck_money;
									shipskineachobject = -1;
									decks.forEach(deck_index => {
										delete userObj.possessionInfo.decks[deck_index];
									});
									return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Ship Skin sell Success",ret_request));
								}
							});
						}
					});
				}
			}
		} catch (error) {
			return Promise.reject(error);			
		}
	}
	Hangar.remoteMethod('sellPossesion', {
		accepts: [
			
			{arg: 'access_token', type: 'string', required: true},
			{arg: 'uniq_objects', type: 'object', required: true},
			{arg: 'uniq_skins', type: 'object', required: true},
			{arg: 'singleton_skins', type: 'object', required: true},
			{arg: 'decks', type: 'array', required: true}
		],
		description: [
			'(every)',
		],
		returns: {
			root: true,
			arg: '',
			type: 'object',
			description: [
				'return HangarCB',
			]
		},
		http: {path: '/sell-possesion', verb: 'post'}

	});

	//RepairPossesion
	Hangar.repairPossession = function(access_token,repair_data) {
		const Accounts = Hangar.app.models.Accounts;
		var ret_request = {
			"repair_data": repair_data,
			"request_name": "Repair Possession"
		};
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			if(repair_data.uniq_object.type == "ship") {
				userObj.possessionInfo.inventory.ships.forEach(shipobject => {
					if(shipobject.uniq_id == repair_data.uniq_object.uniq_id) {
						if(shipobject.current_hp + repair_data.repair_value > 100) 
							return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"Ship Repair Fault",ret_request));
						else
							shipJson.forEach(shipjsonobject => {
								if(shipjsonobject.ID == shipobject.table_id) {
									if(userObj.player_state.money_dc < shipjsonobject.RepairPerHP * repair_data.repair_value)
										return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"Ship Repair Fault",ret_request));
									else {
										userObj.player_state.money_dc -= parseInt(shipjsonobject.RepairPerHP * repair_data.repair_value,10);
										shipobject.current_hp += repair_data.repair_value;
										return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Ship Repair Success",ret_request));
									}
								}
							});
					}
				});
			}
			if(repair_data.uniq_object.type == "gun") {
				let isequip = 0;
				userObj.possessionInfo.inventory.guns.forEach(gunobject => {
					if(gunobject.uniq_id == repair_data.uniq_object.uniq_id) {
						isequip = 1;
						if(gunobject.current_hp + repair_data.repair_value > 100) 
							return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"Gun Repair Fault",ret_request));
						else gunJson.forEach(gunjsonobject => {
							if(gunjsonobject.ID == gunobject.table_id) {
								if(userObj.player_state.money_dc < gunjsonobject.RepairPerHP * repair_data.repair_value)
									return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"Gun Repair Fault",ret_request));
								else {
									userObj.player_state.money_dc -= parseInt(gunjsonobject.RepairPerHP * repair_data.repair_value,10);
									gunobject.current_hp += repair_data.repair_value;
									return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Gun Repair Success",ret_request));
								}
							}
						});
					}
				});
				if(isequip == 0) {
					userObj.possessionInfo.inventory.ships.forEach(gunevery => {
						gunevery.guns.forEach(gunobject => {
							if(gunobject.uniq_id == repair_data.uniq_object.uniq_id) {
								if(gunobject.current_hp + repair_data.repair_value > 100) 
									return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"Gun Repair Fault",ret_request));
								else gunJson.forEach(gunjsonobject => {
									if(gunjsonobject.ID == gunobject.table_id) {
										if(userObj.player_state.money_dc < gunjsonobject.RepairPerHP * repair_data.repair_value)
											return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"Gun Repair Fault",ret_request));
										else {
											userObj.player_state.money_dc -= parseInt(gunjsonobject.RepairPerHP * repair_data.repair_value,10);
											gunobject.current_hp += repair_data.repair_value;
											return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Gun Repair Success",ret_request));
										}
									}
								});
							}
						});
					});
				}
			}
			if(repair_data.uniq_object.type == "misc") {
				let isequip = 0;
				userObj.possessionInfo.inventory.miscs.forEach(miscsobject => {
					if(miscsobject.uniq_id == repair_data.uniq_object.uniq_id) {
						isequip = 1;
						if(miscsobject.current_hp + repair_data.repair_value > 100) 
							return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"Misc Repair Fault",ret_request));
						else miscJson.forEach(miscjsonobject => {
							if(miscjsonobject.ID == miscsobject.table_id) {
								if(userObj.player_state.money_dc < miscjsonobject.RepairPerHP * repair_data.repair_value)
									return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"Misc Repair Fault",ret_request));
								else {
									userObj.player_state.money_dc -= parseInt(miscjsonobject.RepairPerHP * repair_data.repair_value,10);
									miscsobject.current_hp += repair_data.repair_value;
									return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Misc Repair Success",ret_request));
								}
							}
						});
					}
				});
				if(isequip == 0) {
					userObj.possessionInfo.inventory.ships.forEach(miscevery => {
						miscevery.miscs.forEach(miscobject => {
							if(miscobject.uniq_id == repair_data.uniq_object.uniq_id) {
								if(miscobject.current_hp + repair_data.repair_value > 100)
									return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"Misc Repair Fault",ret_request));
								else miscJson.forEach(miscjsonobject => {
									if(miscjsonobject.ID == miscobject.table_id) {
										if(userObj.player_state.money_dc < miscjsonobject.RepairPerHP * repair_data.repair_value) 
											return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"Misc Repair Fault",ret_request));
										else {
											userObj.player_state.money_dc -= parseInt(miscjsonobject.RepairPerHP * repair_data.repair_value,10);
											miscobject.current_hp += repair_data.repair_value;
											return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Misc Repair Success",ret_request));
										}
									}
								});
							}
						});
					});
				}
			}

		} catch (e) {
			return Promise.reject(e);			
		}

	}
	Hangar.remoteMethod('repairPossesion', {
		accepts: [
			
			{arg: 'access_token', type: 'string', required: true},
			{arg: 'repair_data', type: 'object', required: true},
		],
		description: [
			'(every)',
		],
		returns: {
			root: true,
			arg: '',
			type: 'object',
			description: [
				'return HangarCB',
			]
		},
		http: {path: '/repair-possesion', verb: 'post'}
	});

	//EquipShip
	Hangar.equipShip = function(access_token,is_reverse,uniq_id) {
		var ret_request = {
			"is_reverse": is_reverse,
			"uniq_id": uniq_id,
			"request_name": "Equip Ship"
		};
		const Accounts = Hangar.app.models.Accounts;
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			if(userObj.player_state.position_state == 0) {
				userObj.possessionInfo.inventory.equiped_ship = uniq_id;
				return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Success",ret_request));
			}
			if(is_reverse) {
				userObj.possessionInfo.inventory.equiped_ship = "";
				return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Success",ret_request));
			}
		} catch (e) {
			return Promise.reject(e);			
		}

	}
	Hangar.remoteMethod('equipShip', {
		accepts: [
			
			{arg: 'access_token', type: 'string', required: true},
			{arg: 'is_reverse', type: 'bool', required: true},
			{arg: 'uniq_id', type: 'string', required: true},
		],
		description: [
			'(every)',
		],
		returns: {
			root: true,
			arg: '',
			type: 'object',
			description: [
				'return HangarCB',
			]
		},
		http: {path: '/equip-ship', verb: 'post'}
	});

	//Equip MiscAndGuns
	Hangar.equipMiscAndGuns = function(access_token,is_reverse,miscs_uniq_id,guns_uniq_id,ship_uniq_id) {
		const Accounts = Hangar.app.models.Accounts;
		var ret_request = {
			"is_reverse": is_reverse,
			"miscs_uniq_id":miscs_uniq_id,
			"guns_uniq_id":guns_uniq_id,
			"ship_uniq_id": ship_uniq_id,
			"request_name": "Equip Misc And Guns"
		};
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			let current_ship;
			if(!is_reverse) {
				userObj.possessionInfo.inventory.ships.forEach(shipobject => {
					if(shipobject.uniq_id == ship_uniq_id) current_ship = shipobject;
				});
				miscs_uniq_id.forEach(miscfindobject => {
					userObj.possessionInfo.inventory.miscs.forEach(miscobject => {
						if(miscobject.uniq_id == miscfindobject) {
							userObj.possessionInfo.inventory.miscs.pop(miscobject);
							current_ship.miscs.push(miscobject);
						}
					});
					userObj.possessionInfo.inventory.ships.forEach(shipobject => {
						shipobject.miscs.forEach(shipmiscobject => {
							if(shipmiscobject.uniq_id == miscfindobject) {
								shipobject.miscs.pop(shipmiscobject);
								current_ship.miscs.push(shipmiscobject);
							}
						});
					});
				});
				guns_uniq_id.forEach(gunfindobject => {
					userObj.possessionInfo.inventory.guns.forEach(gunobject => {
						if(gunobject.uniq_id == gunfindobject) {
							userObj.possessionInfo.inventory.guns.pop(gunobject);
							current_ship.guns.push(gunobject);
						}
					});
					userObj.possessionInfo.inventory.ships.forEach(shipobject => {
						shipobject.guns.forEach(shipgunobject => {
							if(shipgunobject.uniq_id == gunfindobject) {
								shipobject.guns.pop(shipgunobject);
								current_ship.guns.push(shipgunobject);
							}
						});
					});
				});
				return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Success",ret_request));
			} else {
				current_ship.guns.forEach(gunobject => {
					current_ship.guns.pop(gunobject);
					userObj.possessionInfo.inventory.guns.push(gunobject);
				});
				current_ship.miscs.forEach(miscobject => {
					current_ship.miscs.pop(miscobject);
					userObj.possessionInfo.inventory.miscs.push(miscobject);
				});
				return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Success",ret_request));
			}
		} catch (e) {
			return Promise.reject(e);	
		}

	}
	Hangar.remoteMethod('equipMiscAndGuns', {
		accepts: [
			
			{arg: 'access_token', type: 'string', required: true},
			{arg: 'is_reverse', type: 'bool', required: true},
			{arg: 'miscs_uniq_id', type: 'array', required: true},
			{arg: 'guns_uniq_id', type: 'array', required: true},
			{arg: 'ship_uniq_id', type: 'string', required: true},
		],
		description: [
			'(every)',
		],
		returns: {
			root: true,
			arg: '',
			type: 'object',
			description: [
				'return HangarCB',
			]
		},
		http: {path: '/equip-misc-gun', verb: 'post'}
	});

	//EquipSkinToUniqObject
	Hangar.equipSkinToUniqObject = function(access_token,is_reverse,uniq_object_type,skin_table_id,object_uniq_id) {
		const Accounts = Hangar.app.models.Accounts;
		var ret_request = {
			"is_reverse": is_reverse,
			"uniq_object_type":uniq_object_type,
			"skin_table_id":skin_table_id,
			"object_uniq_id": object_uniq_id,
			"request_name": "Equip Skin To Uniq Object"
		};
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			let current_ship;
			let ship_current_skin;
			let current_gun;
			let gun_current_skin;
			if(!is_reverse) {
				if(uniq_object_type == "ship") {
					userObj.possessionInfo.inventory.ships.forEach(shipobject => {
						if(shipobject.uniq_id == object_uniq_id) current_ship = shipobject;
					});
					userObj.possessionInfo.inventory.ship_skins.forEach(shipobject => {
						if(shipobject.ID == skin_table_id) ship_current_skin = shipobject;
					});
					if(shipobject == null) {
						userObj.possessionInfo.inventory.ships.forEach(shipobject => {
							if(shipobject.equiped_skin.ID == skin_table_id) ship_current_skin = shipobject;
						});
					}
				}
				else if(uniq_object_type == "gun") {
					userObj.possessionInfo.inventory.guns.forEach(gunobject => {
						if(gunobject.uniq_id == object_uniq_id) current_gun = gunobject;
					});
					if(current_gun == null) {
						userObj.possessionInfo.inventory.ships.forEach(gunshipobject => {
							gunshipobject.guns.forEach(guneveryobject => {
								if(guneveryobject.uniq_id == object_uniq_id) current_gun = guneveryobject;
							});
						});
					}
					userObj.possessionInfo.inventory.gun_skins.forEach(gunobject => {
						if(gunobject.ID == skin_table_id) gun_current_skin = gunobject;
					});
					if(gun_current_skin == null) {
						userObj.possessionInfo.inventory.guns.forEach(gunobject => {
							if(gunobject.equiped_skin.ID == skin_table_id) gun_current_skin = gunobject.equiped_skin;
						});
					}
					if(gun_current_skin == null) {
						userObj.possessionInfo.inventory.ships.forEach(gunshipobject => {
							gunshipobject.guns.forEach(gunobject => {
								if(gunobject.equiped_skin.ID == skin_table_id) gun_current_skin = gunobject.equiped_skin;
							});
						});
					}
				}
				return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Success",ret_request));
			} else {
				if(uniq_object_type == "ship") {
					userObj.possessionInfo.inventory.ships.forEach(shipobject => {
						if(shipobject.uniq_id == object_uniq_id) {
							if(shipobject.equiped_skin != -1) userObj.possessionInfo.inventory.ship_skins.push(shipobject.equiped_skin);
							shipobject.equiped_skin = -1;
						}
					});
				} else if(uniq_object_type == "gun") {
					let isequal = 0;
					userObj.possessionInfo.inventory.guns.forEach(gunobject => {
						if(gunobject.uniq_id == object_uniq_id) {
							isequal = 1;
							if(gunobject.equiped_skin != -1) userObj.possessionInfo.inventory.gun_skins.push(gunobject.equiped_skin);
							gunobject.equiped_skin = -1;
						}
					});
					if(isequal == 0) {
						userObj.possessionInfo.inventory.ships.foreach(shipobject => {
							shipobject.guns.forEach(gunobject => {
								if(gunobject.uniq_id == object_uniq_id) {
									if(gunobject.equiped_skin != -1) userObj.possessionInfo.inventory.gun_skins.push(gunobject.equiped_skin);
									gunobject.equiped_skin = -1;
								}
							});
						});
					}
				}
				return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Success",ret_request));
			}
		} catch(e) {
			return Promise.reject(e);	
		}
	}
	Hangar.remoteMethod('equipSkinToUniqObject', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true},
			{arg: 'is_reverse', type: 'bool', required: true},
			{arg: 'uniq_object_type', type: 'string', required: true},
			{arg: 'skin_table_id', type: 'int', required: true},
			{arg: 'object_uniq_id', type: 'string', required: true},
		],
		description: [
			'(every)',
		],
		returns: {
			root: true,
			arg: '',
			type: 'object',
			description: [
				'return HangarCB',
			]
		},
		http: {path: '/equip-skin-uniqobject', verb: 'post'}

	});

	//EquipSkinToSingleton
	Hangar.equipSkinToSingleton = function() {

	}
	Hangar.remoteMethod('equipSkinToSingleton', {

	});

	//ReparkShip
	Hangar.reparkShip = function(access_token,ship_uniq_id,deck_index) {
		const Accounts = Hangar.app.models.Accounts;
		var ret_request = {
			"ship_uniq_id": ship_uniq_id,
			"deck_index":deck_index,
			"request_name": "Repark Ship"
		};
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			if(userObj.possessionInfo.decks[deck_index] != "")
			{
				let is_possible = 0;
				var cnt = 0;
				userObj.possessionInfo.decks.forEach(deck => {
					if(deck == ship_uniq_id) 
					{
						is_possible = 1;
						userObj.possessionInfo.decks[cnt] = "";
					}
					cnt++;
				});
				if(is_possible == 1) {
					userObj.possessionInfo.decks[deck_index] = ship_uniq_id;
					return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Success",ret_request));
				} else {
					return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"There is no ship",ret_request));
				}
			}
			else return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"There is a ship or Deck does not buy",ret_request));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Hangar.remoteMethod('reparkShip', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true},
			{arg: 'ship_uniq_id', type: 'string', required: true},
			{arg: 'deck_index', type: 'bool', required: true}
		],
		description: [
			'(every)',
		],
		returns: {
			root: true,
			arg: '',
			type: 'object',
			description: [
				'return HangarCB',
			]
		},
		http: {path: '/repark-ship', verb: 'post'}

	});

	//HangarCB
	Hangar.hangarCB = (possessions,current_state,success,error_message,hangar_request) => {
		var ret_request = {
			"possessions": possessions,
			"current_state": current_state,
			"success": success,
			"error_message": error_message,
			"hangar_request": hangar_request
		}
		return ret_request;
	}
	Hangar.remoteMethod('hangarCB', {

		accepts: [
			{arg: 'possessions', type: 'object', required: true},
			{arg: 'current_state', type: 'object', required: true},
			{arg: 'success', type: 'bool', required: true},
			{arg: 'error_message', type: 'string', required: true},
			{arg: 'hangar_request', type: 'object', required: true},
		],
		description: [
			'(every)',
		],
		returns: {
			root: true,
			arg: '',
			type: 'object',
			description: [
				'return HangarCB',
			]
		},
		http: {path: '/hangarCB', verb: 'post'}
	});
}