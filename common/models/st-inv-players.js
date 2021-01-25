'use strict';

module.exports = function(STInvplayers) {

	STInvplayers.getDefaultVal = () => {
		const defGun1 = {
			table_id: 109,
			uniq_id: '5eefda49a4fd67eb5bdbcaa6',
			current_hp: 100,
			equiped_skin: -1
		};
		const defGun2 = {
			table_id: 115,
			uniq_id: '5eefda49a4fd67eb5bdbcaa7',
			current_hp: 100,
			equiped_skin: -1
		};
		const defShip = {
			table_id: 101,
			uniq_id: '5eefda49a4fd67eb5bdbcaa8',
			current_hp: 100,
			equiped_skin: -1,
			guns: [defGun1, defGun2],
			miscs: [],
			minerals: [],
		};
		return {
			guns: [],
			miscs: [],
			ships: [defShip],
			ship_skins: [],
			gun_skins: [],
			cockpit_skins: [],
			map_skins: [],
			equiped_ship: '5eefda49a4fd67eb5bdbcaa8',
			equiped_map_skin: -1,
			equiped_cockpit_skin: -1,
		}
	}
};
