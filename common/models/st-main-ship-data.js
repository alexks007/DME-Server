'use strict';

var Common = require('./common.js');

module.exports = function(STMainShipData) {
	// register
	STMainShipData.updateShipData = async() => {
		try {
			var shipJson = require('../../storage/ShipsStaticData.json');
			shipJson.forEach(ship => {
				ship.table_id = ship.ID;
				delete ship.ID;
				if (ship.UploadDate.length == 0)
					ship.UploadDate = new Date();
				else
					ship.UploadDate = new Date(ship.UploadDate);
			})
			const ships = await STMainShipData.create(shipJson);
			return Promise.resolve(Common.makeResult(true, 'success', ships));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	STMainShipData.remoteMethod('updateShipData', {
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


};
