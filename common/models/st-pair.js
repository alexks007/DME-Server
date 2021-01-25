'use strict';

var Common = require('./common.js');

module.exports = function(STPair) {
	STPair.generateRandom = () => {
		const randomIdx = Common.getIntRandomInRange(0, 9);
		const randomCount = Common.getIntRandomInRange(10, 30);
		return {
			table_id: randomIdx,
			current_value: randomCount
		}
	}
};
