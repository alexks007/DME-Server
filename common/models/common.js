'use strict';


//var Course = require('./course.js');

module.exports = {
	makeID: function(str) {
		str = str.replace(/\s/g, '-');
		return str.toLowerCase();
	},
	makeResult: function(bSuccess, content, result) {
		if (bSuccess) {
			return {
				success: bSuccess,
				content: content,
				result: result
			}
		} else {
			return {
				success: bSuccess,
				content: content,
				result: result
			}
		}
	},
	makeReturnValue: function(bSuccess, url, msg, result) {
		const res = {
			success: bSuccess ? 1 : 0,
			url: url,
			error_message: msg,
		};
		return Object.assign({}, res, result);
	},

	RETURN_TYPE: {
		Success: "success",
		Warning: "warning",
		ERROR_PARAMETER: "err_parameter",
		ERROR_ACCOUNT: "err_account",
		ERROR_Server: "err_server",
		ERROR_Access: "err_access",
		ERROR_Token: "wrong_token",
	},
	RETURN_EXCEPTION: {
		Error_NoPro: function() { Common.makeResult(false, Common.RETURN_TYPE.ERROR_ACCOUNT, 'account has no professional info'); }
	},

	isValidParamString: function(param, paramComment, cb) {
		if (!paramComment) {
			paramComment = '';
		}
		if (!param) {
			if (cb) cb(null, this.makeResult(false, paramComment + ' is Null'));
			return true;
		}
		if (param.length == 0) {
			if (cb) cb(null, this.makeResult(false, paramComment + 'is empty string'));
			return true;
		}
		return false;
	},

	groupBy: function(list, keyGetter) {
		const map = new Map();
		list.forEach((item) => {
			const key = keyGetter(item);
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [item]);
			} else {
				collection.push(item);
			}
		});
		return map;
	},

	makeRandomString: function(length) {
		var text = "";
		var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
	
		for (var i = 0; i < possible.length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	
		return text.slice(0, length);
	},
	
	makeRandomNumber: function(length) {
		const now = new Date();
		var text = ""; // = now.getTime() - (new Date('2018/10/1')).getTime();
		var possible = "0123456789";
		for (var i = 0; i < length; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));    
		return text;
	},

	EE_PlayerPossition: {
		MainMenu: 0,
		Hangar: 1,
		StarMap: 2,
		Cockpit: 3,
	},
	EE_ModuleType: {
		Cargo: 0, // increase cargo space of th ship that equiped this type of the misc 
		Speed: 1, // increse jump speed of the ship that equiped this type of the misc
		Hull: 2,// increase hull of the ship that equiped this type of the misc;
		Shield: 3,// increase shield of the ship that equiped this type of the misc;
	},

	CargoItemType: {
		Ship: 0,
		Gun: 1,
		Missiles: 2,
		Misc: 3,
		Skins: 4,
		Cockpit: 5
	},

	MAX_ASTEROID_NUM: 3,
	MAX_AVARTAR_AI_NUM: 2,

	PLAY_STATUS: {
		kPlayStatus_Stopped: 0,
		// kPlayStatus_PlayWaitting: 1,
		kPlayStatus_Lobby: 2,
		kPlayStatus_Playing: 3,
		kPlayStatus_TimeOut: 4,
		// kPlayStatus_ExtendWaitting: 5,
		kPlayStatus_Count: 6,
	},

	makeRateValue: function(value, v1, v2, limit1, limit2) {
		if (!value) return 0;
		let result = limit1 + (value - v1) * (limit2 - limit1) / (v2 - v1);
		result = result > limit1 ? result : limit1;
		result = result < limit2 ? result : limit2;
		return result;
	},

	getIntRandomInRange(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	addMinerals(srcAry, dstAry, isSubstract) {
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
					if (dstAry[k].current_value < 0) {
						dstAry[k].current_value = 0;
						console.error('cargo substract dstAry > src');
						// throw('cargo substract dstAry > src');
					}
					isFind = true;
					break;
				}
			}
			if (!isFind) {
				const pair = {
					table_id: srcAry[i].table_id,
					current_value: isSubstract ? -srcAry[i].current_value : srcAry[i].current_value
				};
				if (pair.current_value < 0) {
					pair.current_value = 0;
					console.error('cargo substract dstAry > src');
				}
				dstAry.push(pair);
			}
		}
		return dstAry;
	}
	
};
