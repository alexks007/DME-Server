'use strict';

var Common = require('./common.js');
module.exports = function(STMaingunData) {

	STMaingunData.updateGunData = async() => {
		try {
			var gunJson = require('../../storage/GunsStaticData.json');
			gunJson.forEach(gun => {
				gun.table_id = gun.ID;
				delete gun.ID;
				if (gun.UploadDate.length == 0)
					gun.UploadDate = new Date();
				else
					gun.UploadDate = new Date(gun.UploadDate);
			})
			const guns = await STMaingunData.create(gunJson);
			return Promise.resolve(Common.makeResult(true, 'success', guns));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	STMaingunData.remoteMethod('updateGunData', {
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
