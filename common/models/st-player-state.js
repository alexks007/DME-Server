'use strict';
var Common = require('./common.js');

module.exports = function(STPlayerState) {
	
	STPlayerState.getDefaultVal = () => {
		return {
			home_planet_id: 10566,
			current_location_id: 10566,
			experience: 0,
			affiliations: [],
			reputation: 0,
			money_dc: 10000,
			money_pdc: 10000,
			jump_ready_percentage: 0.0,
			poisiton_state: Common.EE_PlayerPossition.MainMenu,
			guild_id: -1,
			level: 0,
			ratio_shield_engine: 0,
		}
	}
};
