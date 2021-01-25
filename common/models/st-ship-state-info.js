'use strict';

var Common = require('./common.js');
module.exports = function(STShipStateInfo) {

	STShipStateInfo.generateRandom = () => {
		const STPair = STShipStateInfo.app.models.STPair;
		const mineral = STPair.generateRandom();
		
		const shipId = Common.getIntRandomInRange(101, 103);
		const randomCount = Common.getIntRandomInRange(10, 30);
		const gun = {
			itemId: 101,
			value: 10.0,
			shipId: 101
		}
		return {
			shipId: shipId,
			hull: 100,
			equiped_skin: -1,
			guns: [gun],
			miscs: [],
			minerals: [mineral]
		}
	}
};
