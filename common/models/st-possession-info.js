'use strict';

module.exports = function(STPossessionInfo) {

	STPossessionInfo.getDefaultVal = () => {
        const STInvplayers = STPossessionInfo.app.models.STInvPlayers;
		const defInv = STInvplayers.getDefaultVal();
		return {
			decks: [],
			inventory: defInv,
		}
	}

};
