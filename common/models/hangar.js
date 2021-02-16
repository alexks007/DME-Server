'use strict';

module.exports = function(Hangar) {
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
	const decksJson = require('../../storage/DeckData.json');

	//BuyPossesion
	Hangar.buyPossession = async(access_token, table_objects, decks) => {
		const Accounts = Hangar.app.models.Accounts;
		let ret_request = {
			"table_objects": table_objects,
			"decks": decks,
			"request_name": "Buy Possession"
		};
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			const moneyDC = userObj.player_state.money_dc;
			const moneyPDC = userObj.player_state.money_pdc;
			let total_price_dc = 0;
			let total_price_pdc = 0;

			//Get Total Purchase Price of Two Kinds of Money
			//* Total sum of table objects *//
			table_objects.forEach(table_object => {
				if (table_object.type == "gun") {
					gunJson.forEach(guns => {
						if (table_object.table_id == guns.ID) {
							if (guns.MoneyType == 0) {
								total_price_dc += guns.CostPrice;
							}
							else {
								total_price_pdc += guns.CostPrice;
							}							
						}
					});
				}
				if (table_object.type == "ship") {
					shipJson.forEach(ships => {
						if (table_object.table_id == ships.ID) {
							if (ships.MoneyType == 0) {
								total_price_dc += ships.CostPrice;
							}
							else {
								total_price_pdc += ships.CostPrice;
							}
						}
					});
				}
				if (table_object.type == "misc") {
					miscJson.forEach(miscs => {
						if (table_object.table_id == miscs.ID) {
							if (miscs.MoneyType == 0) {
								total_price_dc += miscs.CostPrice;
							}
							else {
								total_price_pdc += miscs.CostPrice;
							}
						}
					});
				}
				if (table_object.type == "ship_skin") {
					shipskinJson.forEach(shipskins => {
						if (table_object.table_id == shipskins.ID) {
							if (shipskins.MoneyType == 0) {
								total_price_dc += shipskins.CostPrice;
							}
							else {
								total_price_pdc += shipskins.CostPrice;
							}
						}
					});
				}	
			});
			//* Total sum of decks *//
			decks.forEach(deck_index => {
				decksJson.forEach(deck => {
					if (deck.DeckIndex == deck_index) {
						if (deck.MoneyType == 0) {
							total_price_dc += deck[deck_index].CostPrice;
						}
						else {
							total_price_pdc += deck[deck_index].CostPrice;
						}
					}					
				});
				
			});
			//Compare Total Purchase Cost with Client Money
			if (total_price_dc > moneyDC || total_price_pdc > moneyPDC) {
				Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"Not Enough Money",ret_request));
			}
			else {
				//Update Client Money State
				userObj.player_state.money_dc = moneyDC - total_price_dc;
				userObj.player_state.money_pdc = moneyPDC - total_price_pdc;
				//Update Client Possession
				table_objects.forEach(table_object => {
					if (table_object.type == "gun") {
						gunJson.forEach(guns => {
							if (table_object.table_id == guns.ID) {
								userObj.possessionInfo.inventory.guns.push(guns);
							}
						});
					}
					if (table_object.type == "ship") {
						shipJson.forEach(ships => {
							if (table_object.table_id == ships.ID) {
								userObj.possessionInfo.inventory.ships.push(ships);
							}
						});
					}
					if (table_object.type == "misc") {
						miscJson.forEach(miscs => {
							if (table_object.table_id == miscs.ID) {
								userObj.possessionInfo.inventory.miscs.push(miscs);
							}
						});
					}
					if (table_object.type == "ship_skin") {
						shipskinJson.forEach(shipskins => {
							if (table_object.table_id == shipskins.ID) {
								userObj.possessionInfo.inventory.ship_skins.push(shipskins);
							}
						});
					}
				});
				//Update Decks
				decks.forEach(deck_index => {
					userObj.possessionInfo.decks.push(deck_index);
				});
				Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Buy Possession Success",ret_request));
			}
		} catch(e) {
			Promise.reject(e);
		}
	}
	Hangar.remoteMethod('buyPossesion', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true},
			{arg: 'table_objects', type: 'array', required: true},
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

	//Sell-Possesion
	Hangar.sellPossession = async(access_token,uniq_objects,uniq_skins,singleton_skins,decks) => {
		const Accounts = Hangar.app.models.Accounts;
		let ret_request = {
			"uniq_objects": uniq_objects,
			"uniq_skins": uniq_skins,
			"singleton_skins":singleton_skins,
			"decks":decks,
			"request_name": "Sell Possession"
		};
		try {
			//Check Objects that Client Wants To Sell
			const userObj = await Accounts.getUserFromToken(access_token);
			let moneyDC = userObj.player_state.money_dc;
			//Check uniq_objects
			let have_object = true;
			if (have_object == true) {
				uniq_objects.forEach(uniq_object => {
					if (have_object == true) {
						have_object = false;
						if(uniq_object.type == "ship") {						
							userObj.possessionInfo.inventory.ships.forEach(ship_object => {
								if(ship_object.uniq_id == uniq_object.uniq_id) {
									have_object = true;
								}
							});
						} 
						else if(uniq_object.type == "gun") {
							userObj.possessionInfo.inventory.guns.forEach(gunobject => {
								if(gunobject.uniq_id == uniq_object.uniq_id) {
									have_object = true;
								}
							});
							userObj.possessionInfo.inventory.ships.forEach(equip_ship => {
								equip_ship.guns.forEach(equip_gun => {
									if(equip_gun.uniq_id == uniq_object.uniq_id) {
										have_object = true;
									}
								});
							});
						}
						else if(uniq_object.type == "misc") {
							userObj.possessionInfo.inventory.miscs.forEach(miscobject => {
								if(miscobject.uniq_id == uniq_object.uniq_id) {
									have_object = true;
								}
							});
							userObj.possessionInfo.inventory.ships.forEach(equip_ship => {
								equip_ship.miscs.forEach(miscobject => {
									if(miscobject.uniq_id == uniq_object.uniq_id) {
										have_object = true;
									}
								});
							});
						}
					}					
				});
			}			
			
			//Check uniq_skins
			if (have_object == true) {
				uniq_skins.forEach(uniq_skin_object => {
					//check ship skin
					if (have_object == true) {
						have_object = false;
						if(uniq_skin_object.type == "ship") {						
							userObj.possessionInfo.inventory.ship_skins.forEach(ship_skin => {
								if(ship_skin == uniq_skin_object.object_uniq_id) {
									have_object = true;
								}
							});
							userObj.possessionInfo.inventory.ships.forEach(equip_ship => {
								if(equip_ship.equiped_skin == uniq_skin_object.object_uniq_id) {
									have_object = true;
								}
							});
						}
						//check gun skin
						else if (uniq_skin_object.type == "gun") {
							userObj.possessionInfo.inventory.gun_skins.forEach(gun_skin => {
								if (gun_skin == uniq_skin_object.object_uniq_id) {
									have_object = true;
								}
							});
							userObj.possessionInfo.ships.forEach(equip_ship => {
								equip_ship.guns.foreach(equip_gun => {
									if (equip_gun.equiped_skin == uniq_skin_object.object_uniq_id)
										have_object = true;
								});
							});
						}
					}
					
				});
			}
			
			//Check Singleton Skins
			if (have_object == true) {
				singleton_skins.forEach(singleton_skin_object => {
					if (have_object == true) {
						have_object = false;
						if (singleton_skin_object.type == "cockpit") {
							if (userObj.possessionInfo.inventory.equiped_cockpit_skin == singleton_skin_object.table_id) {
								have_object = true;
							}
							else {
								userObj.possessionInfo.inventory.cockpit_skins.forEach(cockpit_skin => {
									if (singleton_skin_object.table_id == cockpit_skin)
										have_object = true;
								});
							}
						}
						else {
							if (userObj.possessionInfo.inventory.equiped_map_skin == singleton_skin_object.table_id) {
								have_object = true;
							}
							else {
								userObj.possessionInfo.inventory.map_skins.forEach(map_skin => {
									if (singleton_skin_object.table_id == map_skin)
										have_object = true;
								});
							}
						}
					}					
				});
			}

			//Check Deck
			if (have_object == true) {
				decks.forEach(deck => {
					if (have_object == true) {
						have_object = false;
						userObj.possessionInfo.decks.forEach(deck_item => {
							if (deck == deck_item) {
								have_object = true
							}
						});
					}					
				});
			}

			//Update Possession
			if (have_object == true) {
				uniq_objects.forEach(uniq_object => {
					//Sell Ship
					if(uniq_object.type == "ship") {
						if (userObj.possessionInfo.inventory.equiped_ship == uniq_object.uniq_id) {
							shipJson.forEach(ship_item => {
								if (ship_item.ID == uniq_object.uniq_id) {
									userObj.player_state.money_dc += ship_item.CostPrice; 
								}
							});
							userObj.possessionInfo.inventory.equip_ship = "";
						}
						else {
							let i = 0;
							userObj.possessionInfo.inventory.ships.forEach(ship_object => {
								if(ship_object.uniq_id == uniq_object.uniq_id) {
									ship_object.guns.forEach(ship_object_gun => {
										userObj.possessionInfo.inventory.guns.push(ship_object_gun);
									});
									ship_object.miscs.forEach(ship_object_misc => {
										userObj.possessionInfo.inventory.miscs.push(ship_object_misc);
									});
									if(ship_object.equiped_skin != -1)
										userObj.possessionInfo.inventory.ship_skins.push(ship_object.equiped_skin);									
									shipJson.forEach(shipselectobject => {
										if(shipselectobject.ID == ship_object.uniq_id) {
											userObj.player_state.money_dc += shipselectobject.CostPrice;
											delete userObj.possessionInfo.inventory.ships[i];
										}										
									});
								}
								i++;
							});
						}		
					}
					//Sell Gun
					else if(uniq_object.type == "gun") {
						let i, j = 0;
						userObj.possessionInfo.inventory.guns.forEach(gun_object => {
							if(gun_object.uniq_id == uniq_object.uniq_id) {
								gunJson.forEach(gun_item => {
									if (gun_item.ID == gun_object.uniq_id) {
										userObj.player_state.money_dc += gun_item.CostPrice;
										delete userObj.possessionInfo.inventory.guns[i];
									}									
								});
							}
							i++;
						});						
						userObj.possessionInfo.ships.guns.forEach(gun_object => {
							if (gun_object.uniq_id == uniq_object.uniq_id) {
								gunJson.forEach(gun_item => {
									if (gun_item.ID == gun_object.uniq_id) {
										userObj.player_state.money_dc += gun_item.CostPrice;
										delete userObj.possessionInfo.inventory.ships.guns[j];
									}									
								});
							}
							j++;
						});
					}
					//Sell Misc
					else if (uniq_object.type == "misc") {
						let i, j = 0;
						userObj.possessionInfo.inventory.miscs.forEach(misc_object => {
							if(misc_object.uniq_id == uniq_object.uniq_id) {
								miscJson.forEach(misc_item => {
									if (misc_item.ID == misc_object.uniq_id) {
										userObj.player_state.money_dc += misc_item.CostPrice;
										delete userObj.possessionInfo.inventory.miscs[i];
									}
								});
							}
							i++;
						});
						userObj.possessionInfo.ships.misc.forEach(misc_object => {
							if (misc_object.uniq_id == uniq_object.uniq_id) {
								miscJson.forEach(misc_item => {
									if (misc_item.ID == misc_object.uniq_id) {
										userObj.player_state.money_dc += misc_item.CostPrice;
										delete userObj.possessionInfo.inventory.ships.misc[j];
									}
								});
							}
							j++;
						});
					}
				});
				uniq_skins.forEach(uniq_skin_object => {
					//Ship Skin
					if(uniq_skin_object.type == "ship") {	
						let i,j = 0;					
						userObj.possessionInfo.inventory.ship_skins.forEach(ship_skin => {
							if (ship_skin == uniq_skin_object.table_id) {
								shipskinJson.forEach(ship_skin_object => {
									if(ship_skin_object.ID == uniq_skin_object.table_id) {
										userObj.player_state.money_dc += ship_skin_object.CostPrice;
										delete userObj.possessionInfo.inventory.ship_skins[i];
									}
								});
							}
							i++;
						});
						userObj.possessionInfo,inventory.ships.forEach(ship_object => {
							if (ship_object.equiped_skin == uniq_skin_object.table_id) {
								shipskinJson.forEach(ship_skin_object => {
									if(ship_skin_object.ID == uniq_skin_object.table_id) {
										userObj.player_state.money_dc += ship_skin_object.CostPrice;
										userObj.possessionInfo.inventory.ships[j].equiped_skin = -1;
									}
								});
							}
							j++;
						});
					}
					//Gun Skin
					if(uniq_skin_object.type == "gun") {
						let i,j = 0;						
						userObj.possessionInfo.inventory.gun_skins.forEach(gun_skin => {
							if (gun_skin == uniq_skin_object.table_id) {
								gunJson.forEach(gun_object => {
									if (gun_object.ID == uniq_skin_object.table_id) {
										userObj.player_state.money_dc += gun_object.CostPrice;
										delete userObj.possessionInfo.inventory.gun_skins[i];
									}
								});
							}
							i++;
						});
						userObj.possessionInfo.inventory.guns.forEach(equip_gun => {
							if (equip_gun.equiped_skin == uniq_skin_object.table_id) {
								gunJson.forEach(gun_object => {
									if (gun_object.ID == uniq_skin_object.table_id) {
										userObj.player_state.money_dc += gun_object.CostPrice;
										userObj.possessionInfo.inventory.guns[j].equiped_skin = -1;
									}
								});
							}
							j++;
						});
					}
				});
				singleton_skins.forEach(singleton_skin_object => {
					if (singleton_skin_object.type == "cockpit") {
						if (userObj.possessionInfo.inventory.equiped_cockpit_skin == singleton_skin_object.table_id) {
							cockpit_skinJson.forEach(cock_object => {
								if (cock_object.ID == singleton_skin_object.table_id) {
									userObj.player_state.money_dc += cock_object.CostPrice;
									userObj.possessionInfo.inventory.equiped_cockpit_skin = -1;
								}
							});
						}
						else {
							let i = 0;
							userObj.possessionInfo.inventory.cockpit_skins.forEach(cockpit_skin => {
								if (singleton_skin_object.table_id == cockpit_skin) {
									cockpit_skinJson.forEach(cock_object => {
										if (cock_object.ID == singleton_skin_object.table_id) {
											userObj.player_state.money_dc += cock_object.CostPrice;
											delete userObj.possessionInfo.inventory.cockpit_skins[i];
										}
									});
								}
								i++;
							});
						}
					}
					if (singleton_skin_object.type == "map") {
						if (userObj.possessionInfo.inventory.equiped_map_skin == singleton_skin_object.table_id) {
							map_skinJson.forEach(map_skin => {
								if (map_skin.ID == singleton_skin_object.table_id) {
									userObj.player_state.money_dc += map_skin.CostPrice;
									userObj.possessionInfo.inventory.equiped_map_skin = -1;
								}
							});
						}
						else {
							let i = 0;
							userObj.possessionInfo.inventory.map_skins.forEach(map_skin => {
								if (singleton_skin_object.table_id == map_skin) {
									map_skinJson.forEach(map_skin => {
										if (map_skin.ID == singleton_skin_object.table_id) {
											userObj.player_state.money_dc += map_skin.CostPrice;
											delete userObj.possessionInfo.inventory.map_skins[i];
										}
									});
								}
								i++;
							});
						}
					}
				});
				decks.forEach(deck_index=> {
					let i = 0;
					userObj.possessionInfo.decks.forEach(deck_object => {
						if (deck_object.deck_index == deck_index) {
							decksJson.forEach(deck => {
								if (deck.DeckIndex == deck_index) {
									userObj.player_state.money_dc += deck.CostPrice;
									delete userObj.possessionInfo.decks[i];
								}
							});
						}
						i++;
					});
				});
				Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Sell Possession Success",ret_request));
			}
			else {
				Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"No object",ret_request));
			}
		} catch (error) {
			return Promise.reject(error);			
		}
	}
	Hangar.remoteMethod('sellPossesion', {
		accepts: [			
			{arg: 'access_token', type: 'string', required: true},
			{arg: 'uniq_objects', type: 'array', required: true},
			{arg: 'uniq_skins', type: 'array', required: true},
			{arg: 'singleton_skins', type: 'array', required: true},
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
	Hangar.repairPossession = async(access_token,repair_data) => {
		const Accounts = Hangar.app.models.Accounts;
		var ret_request = {
			"repair_data": repair_data,
			"request_name": "Repair Possession"
		};
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			const moneyDC = userObj.player_state.money_dc;
			let costPrice = 0;
			repair_data.forEach(repair_data_object => {
				if (repair_data_object.uniq_object.type == "ship") {
					let have_ship = false;
					userObj.possessionInfo.inventory.ships.forEach(ship_object => {
						if (ship_object.uniq_id == repair_data_object.uniq_object.uniq_id) {
							shipJson.forEach(ship_item => {
								if (ship_item.ID == ship_object.uniq_id) {
									costPrice += Math.round(ship_item.RepairPerHP * repair_data_object.repair_value);
								}
							});
							have_ship = true;
						}
					});
				}
				else if (repair_data_object.uniq_object.type == "gun") {
					let have_gun = false;
					userObj.possessionInfo.inventory.guns.forEach(gun_object => {
						if (gun_object.uniq_id == repair_data_object.uniq_object.uniq_id) {
							gunJson.forEach(gun_item => {
								if (gun_item.ID == gun_object.uniq_id) {
									costPrice += Math.round(gun_item.RepairPerHP * repair_data_object.repair_value);
								}
							});
							have_gun = true;
						}
					});
					userObj.possessionInfo.inventory.ships.forEach(ship_object => {
						ship_object.guns.forEach(equip_gun => {
							if (equip_gun.uniq_id == repair_data_object.uniq_object.uniq_id) {
								gunJson.forEach(gun_item => {
									if (gun_item.ID == equip_gun.uniq_id) {
										costPrice += Math.round(gun_item.RepairPerHP * repair_data_object.repair_value);
									}
								});
								have_gun = true;
							}
						});
					});
				}
				else if (repair_data_object.uniq_object.type == "misc") {
					let have_misc = false;
					userObj.possessionInfo.inventory.miscs.forEach(misc_object => {
						if (misc_object.uniq_id == repair_data_object.uniq_object.uniq_id) {
							miscJson.forEach(misc_item => {
								if (misc_item.uniq_id == repair_data_object.uniq_object.uniq_id) {
									costPrice += Math.round(misc_item.RepairPerHP * repair_data_object.repair_value);
								}
							});
							have_misc = true;
						}
					});
					userObj.possessionInfo.inventory.ships.forEach(ship_object => {
						ship_object.miscs.forEach(equip_misc => {
							if (equip_misc.uniq_id == repair_data_object.uniq_object.uniq_id) {
								miscJson.forEach(misc_item => {
									if (misc_item.uniq_id == repair_data_object.uniq_object.uniq_id) {
										costPrice += Math.round(misc_item.RepairPerHP * repair_data_object.repair_value);
									}
								});
								have_misc = true;
							}
						});
					});
				}

			});
			let have_all_item = false;
			if (have_gun == true && have_misc == true && have_ship == true)
				have_all_item = true;
			if (have_all_item == true && moneyDC >= costPrice) {
				repair_data.forEach(repair_data_object => {
					if (repair_data_object.uniq_object.type == "ship") {
						let i = 0;
						userObj.possessionInfo.inventory.ships.forEach(ship_object => {
							if (ship_object.uniq_id == repair_data_object.uniq_object.uniq_id) {
								userObj.possessionInfo.inventory.ships[i].current_hp += repair_data_object.repair_value;
							}
							i++;
						});
					}
					else if (repair_data_object.uniq_object.type == "gun") {
						let i,j,k = 0;
						userObj.possessionInfo.inventory.guns.forEach(gun_object => {
							if (gun_object.uniq_id == repair_data_object.uniq_object.uniq_id) {
								userObj.possessionInfo.inventory.guns[i].current_hp += repair_data_object.repair_value;
							}
							i++;
						});
						userObj.possessionInfo.inventory.ships.forEach(ship_object => {
							ship_object.guns.forEach(equip_gun => {
								if (equip_gun.uniq_id == repair_data_object.uniq_object.uniq_id) {
									userObj.possessionInfo.inventory.ships[j].guns[k].current_hp += repair_data_object.repair_value;
								}
								k++;
							});
							j++;
						});
					}
					else if (repair_data_object.uniq_object.type == "misc") {
						let i,j,k = 0;
						userObj.possessionInfo.inventory.miscs.forEach(misc_object => {
							if (misc_object.uniq_id == repair_data_object.uniq_object.uniq_id) {
								userObj.possessionInfo.inventory.misc[i].current_hp += repair_data_object.repair_value;
							}
							i++;
						});
						userObj.possessionInfo.inventory.ships.forEach(ship_object => {
							ship_object.miscs.forEach(equip_misc => {
								if (equip_misc.uniq_id == repair_data_object.uniq_object.uniq_id) {
									userObj.possessionInfo.inventory.ships[j].miscs[k].current_hp += repair_data_object.repair_value;
								}
								k++;
							});
							j++;
						});
					}	
				});
				Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Repair Success",ret_request));
			}
			else {
				Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,0,"Repair failed",ret_request));
			}
			
		} catch (e) {
			return Promise.reject(e);			
		}

	}
	Hangar.remoteMethod('repairPossesion', {
		accepts: [
			
			{arg: 'access_token', type: 'string', required: true},
			{arg: 'repair_data', type: 'array', required: true},
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
	Hangar.equipShip = async(access_token,is_reverse,uniq_id) => {
		var ret_request = {
			"is_reverse": is_reverse,
			"uniq_id": uniq_id,
			"request_name": "Equip Ship"
		};
		const Accounts = Hangar.app.models.Accounts;
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			if(is_reverse) {
				userObj.possessionInfo.inventory.equiped_ship = "";
				Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Unequip Ship Success",ret_request));
			}
			else {
				userObj.possessionInfo.inventory.ships.forEach(ship_object => {
					if (ship_object.uniq_id == uniq_id) {
						if(userObj.player_state.position_state == 0) {
							userObj.possessionInfo.inventory.equiped_ship = uniq_id;
							Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Equip Ship Success",ret_request));
						}
					}
				});			
			}		
		} catch (e) {
			Promise.reject(e);			
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
	Hangar.equipMiscAndGuns = async(access_token,is_reverse,miscs_uniq_id,guns_uniq_id,ship_uniq_id) => {
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
			if(!is_reverse) {
				let have_gun,have_misc = true;
				//Check client have all object
				guns_uniq_id.forEach(gun_uniq_id => {
					have_gun = false;
					userObj.possessionInfo.inventory.guns.forEach(gun_object => {
						if (gun_object.uniq_id == gun_uniq_id) {
							have_gun = true;
						}
					});
					userObj.possessionInfo.inventory.ships.forEach(ship_object => {
						ship_object.guns.forEach(gun_object => {
							if (gun_object.uniq_id == gun_uniq_id) {
								have_gun =true;
							}
						});
					});
				});
				miscs_uniq_id.forEach(misc_uniq_id => {
					have_misc = false;
					userObj.possessionInfo.inventory.miscs.forEach(misc_object => {
						if (misc_object.uniq_id == misc_uniq_id) {
							have_misc = true;
						}
					});
					userObj.possessionInfo.inventory.ships.forEach(ship_object => {
						ship_object.miscs.forEach(misc_object => {
							if (misc_object.uniq_id == misc_uniq_id) {
								have_misc = true;
							}
						});
					});
				})	
				if (have_misc == true && have_gun == true) {
					//Equip Object
					miscs_uniq_id.forEach(misc_uniq_id => {
						let i,j = 0;
						userObj.possessionInfo.inventory.miscs.forEach(misc_object => {
							if(misc_object.uniq_id == misc_uniq_id) {
								delete userObj.possessionInfo.inventory.miscs[i];
								userObj.possessionInfo.inventory.ships.forEach(ship_object => {
									if (ship_object.uniq_id == ship_uniq_id) {
										userObj.possessionInfo.inventory.ships[j].miscs.push(misc_uniq_id);
									}
									j++;
								});
							}
							i++;
						});
						let h,k,l = 0;
						userObj.possessionInfo.inventory.ships.forEach(ship_object => {
							ship_object.miscs.forEach(equip_misc => {
								if(equip_misc.uniq_id == misc_uniq_id) {
									delete userObj.possessionInfo.inventory.ships[h].misc[k];
									userObj.possessionInfo.inventory.ships.forEach(ship_object => {
										if (ship_object.uniq_id == ship_uniq_id) {
											userObj.possessionInfo.inventory.ships[l].miscs.push(misc_uniq_id);
										}
										l++;
									});
								}
								k++
							});
							h++;
						});
					});
					guns_uniq_id.forEach(gun_uniq_id => {
						let i,j = 0;
						userObj.possessionInfo.inventory.guns.forEach(gun_object => {
							if(gun_object.uniq_id == gun_uniq_id) {
								delete userObj.possessionInfo.inventory.guns[i];
								userObj.possessionInfo.inventory.ships.forEach(ship_object => {
									if (ship_object.uniq_id == ship_uniq_id) {
										userObj.possessionInfo.inventory.ships[j].guns.push(guns_uniq_id);
									}
									j++;
								});
								current_ship.guns.push(gunobject);
							}
							i++;
						});
						let h,k,l = 0;
						userObj.possessionInfo.inventory.ships.forEach(ship_object => {
							ship_object.guns.forEach(gun_object => {
								if(gun_object.uniq_id == gun_uniq_id) {
									delete userObj.possessionInfo.inventory.ships[h].guns[k];
									userObj.possessionInfo.inventory.ships.forEach(ship_object => {
										if (ship_object.uniq_id == ship_uniq_id) {
											userObj.possessionInfo.inventory.ships[l].guns.push(guns_uniq_id);
										}
										l++;
									});
								}
								k++;
							});
							h++;
						});
					});
				}
				
				Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Equip Success",ret_request));
			} 
			else {
				guns_uniq_id.forEach(gun_uniq_id => {
					let i,j = 0;
					userObj.possessionInfo.inventory.ships.forEach(ship_object => {
						if (ship_object.uniq_id == ship_uniq_id) {
							ship_object.guns.forEach(gun_object => {
								if (gun_object.uniq_id == gun_uniq_id) {
									delete userObj.possessionInfo.inventory.ships[i].guns[j];
									userObj.possessionInfo.inventory.guns.push(gun_object);
								}
								j++
							});
						}
						i++;				
					});
				});
				miscs_uniq_id.forEach(misc_uniq_id => {
					let i,j = 0;
					userObj.possessionInfo.inventory.ships.forEach(ship_object => {
						ship_object.miscs.forEach(equip_misc => {
							if(equip_misc.uniq_id == misc_uniq_id) {
								delete userObj.possessionInfo.inventory.ships[i].misc[j];
								userObj.possessionInfo.inventory.miscs.push(equip_misc);
							}
							j++
						});
						i++;
					});
				});
				return Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Unequip Success",ret_request));
			}
		} catch (e) {
			Promise.reject(e);	
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
	Hangar.equipSkinToUniqObject = async(access_token,is_reverse,uniq_object_type,skin_table_id,object_uniq_id) => {
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
				Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Success",ret_request));
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
				Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Success",ret_request));
			}
		} catch(e) {
			Promise.reject(e);	
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
	Hangar.equipSkinToSingleton = async(access_token,is_reverse,singleton_type,skin_table_id) => {
		const Accounts = Hangar.app.models.Accounts;
		var ret_request = {
			"is_reverse": is_reverse,
			"singleton_type":singleton_type,
			"skin_table_id":skin_table_id,
		};
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			if (!is_reverse) {
				if (singleton_type == "cockpit") {
					let i = 0;
					userObj.possessionInfo.inventory.cockpit_skins.forEach(cockpit_skin => {
						if (cockpit_skin == skin_table_id) {
							if (userObj.possessionInfo.inventory.equiped_cockpit_skin == -1) {
								userObj.possessionInfo.inventory.equiped_cockpit_skin = skin_table_id;
								delete userObj.possessionInfo.inventory.cockpit_skins[i];
							}
							else {
								delete userObj.possessionInfo.inventory.cockpit_skins[i];
								userObj.possessionInfo.inventory.cockpit_skins.push(userObj.possessionInfo.inventory.equiped_cockpit_skin);
								userObj.possessionInfo.inventory.equiped_cockpit_skin = skin_table_id;
							}
						}
						i++;
					});
				}
				else {
					let i = 0;
					userObj.possessionInfo.inventory.map_skins.forEach(map_skin => {
						if (map_skin == skin_table_id) {
							if (userObj.possessionInfo.inventory.equiped_map_skin == -1) {
								userObj.possessionInfo.inventory.equiped_map_skin = skin_table_id;
								delete userObj.possessionInfo.inventory.map_skins[i];
							}
							else {
								delete userObj.possessionInfo.inventory.map_skins[i];
								userObj.possessionInfo.inventory.map_skins.push(userObj.possessionInfo.inventory.equiped_map_skin);
								userObj.possessionInfo.inventory.equiped_map_skin = skin_table_id;
							}
						}
						i++;
					});
				}
				Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Equip Skin to Singleton Success",ret_request));
			}
			else {
				if (singleton_type == "cockpit") {
					userObj.possessionInfo.inventory.cockpit_skins.push(skin_table_id);
					userObj.possessionInfo.equiped_cockpit_skin = -1;
				}
				else if (singleton_type == "map") {
					userObj.possessionInfo.inventory.map_skins.push(skin_table_id);
					userObj.possessionInfo.equiped_map_skin = -1;
				}
				Promise.resolve(Hangar.hangarCB(userObj.possessionInfo,userObj.player_state,1,"Unequip Skin to Singleton Success",ret_request));
			}
		} catch(e) {
			Promise.reject(e);
		}
	}
	Hangar.remoteMethod('equipSkinToSingleton', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true},
			{arg: 'is_reverse', type: 'bool', required: true},
			{arg: 'singleton_type', type: 'string', required: true},
			{arg: 'skin_table_id', type: 'int', required: true},
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
		http: {path: '/equip-skin-singleton', verb: 'post'}
	});

	//ReparkShip
	Hangar.reparkShip = async(access_token,ship_uniq_id,deck_index) => {
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
};
