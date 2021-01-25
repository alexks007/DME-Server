'use strict';
var Common = require('./common.js');

var fs = require('fs');
//const moveFile = require('move-file');
const multiparty = require('multiparty');
const { readFileSync } = require('fs');
const path = require('path'); 

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
	params: {
	  Bucket: 'beglam'
	},
	accessKeyId: "AKIAILTIZ4L4FFC4F3ZQ",
	secretAccessKey: "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",
	region: 'eu-west-3',
	// sessionToken: req.body.sessionToken
});

module.exports = function(Gallery) {
    Gallery.disableRemoteMethodByName("upsert");
    Gallery.disableRemoteMethodByName("find");
    Gallery.disableRemoteMethodByName("replaceOrCreate");
    Gallery.disableRemoteMethodByName("create");
    Gallery.disableRemoteMethodByName("prototype.updateAttributes");
    Gallery.disableRemoteMethodByName("findById");
    Gallery.disableRemoteMethodByName("exists");
    Gallery.disableRemoteMethodByName("replaceById");
    Gallery.disableRemoteMethodByName("deleteById");
    Gallery.disableRemoteMethodByName("createChangeStream");
    Gallery.disableRemoteMethodByName("count");
    Gallery.disableRemoteMethodByName("findOne");
    Gallery.disableRemoteMethodByName("update");
	Gallery.disableRemoteMethodByName("upsertWithWhere");
	
	Gallery.disableRemoteMethodByName('prototype.__get__client');

	Gallery.disableRemoteMethodByName('prototype.__get__userPhotos');
	Gallery.disableRemoteMethodByName('prototype.__create__userPhotos');
	Gallery.disableRemoteMethodByName('prototype.__delete__userPhotos');
	Gallery.disableRemoteMethodByName('prototype.__findById__userPhotos');
	Gallery.disableRemoteMethodByName('prototype.__updateById__userPhotos');
	Gallery.disableRemoteMethodByName('prototype.__destroyById__userPhotos');
	Gallery.disableRemoteMethodByName('prototype.__count__userPhotos');
	
	// Gallery.getImages = async(access_token) => {
	// 	const Accounts = Gallery.app.models.Accounts;
	// 	const Jobs = Gallery.app.models.Jobs;
	// 	try {
	// 		const pro = await Accounts.getUserFromToken(access_token);
	// 		const jobs = await Jobs.find({
	// 			where: {
	// 				proUserId: pro.proUserId
	// 			},
	// 			include: {
	// 				relation: "gallery",
	// 				scope: {
	// 					fields: ['id', 'jobId', 'sectionId', 'filepath'],
	// 				}
	// 			},
	// 		})
	// 		const results = [];
	// 		jobs.forEach(job => {
	// 			results.concat(job.gallery);
	// 		});
	// 		return Promise.resolve(Common.makeResult(true, 'success', jobs));
	// 	} catch(e) {
	// 		return Promise.reject(e);
	// 	}
	// }
	// Gallery.remoteMethod('getImages', {
	// 	accepts: [
	// 		{arg: 'access_token', type: 'string', required: true, description: 'professional token id'},
	// 	],
	// 	description: [
	// 		'(professional) return all images of professional.',
	// 	],
	// 	returns: {
	// 		arg: 'res',
	// 		type: 'string',
	// 		description: 'array of service infos'
	// 	},
	// 	http: {path:'/get-image', verb: 'get'}
	// });

	const getFileFromRequest = (req) => {
		try {
			return new Promise((resolve, reject) => {
				const form = new multiparty.Form();
				form.parse(req, (err, fields, files) => {
					if (err) return reject(err);
					if (!files) return reject('Files empty.');
					const file = files['file'][0]; // get the file from the returned files object
					if (!file) return reject('File was not found in form data.');
					else return resolve(file);
				});
			})
		} catch(e) {
			return Promise.reject(e);
		}
	};

	const uploadFileToS3 = (filepath, options = {}) => {
		try {
			// AWS.config.update({
			// 	params: {
			// 	  Bucket: 'beglam'
			// 	},
			// 	accessKeyId: "AKIAILTIZ4L4FFC4F3ZQ",
			// 	secretAccessKey: "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",
			// 	region: 'eu-west-3',
			// 	// sessionToken: req.body.sessionToken
			// });


			// s3.createBucket({Bucket: 'beglam', ACL: 'public-read'}, function(err, data) {
			// 	if (err) {
			// 	  console.log("Error", err);
			// 	} else {
			// 	  console.log("Success", data.Location);
			// 	}
			// });

			// turn the file into a buffer for uploading
			const buffer = readFileSync(filepath);
			// generate a new random file name
			const fileName = options.name || String(Date.now());
			// the extension of your file
			const extension = path.extname(filepath);
			let contentType = 'image/jpeg';
			switch (extension) {
				case ".gif": contentType = "image/gif"; break;
				case ".png": contentType = "image/png"; break;
				case ".jpeg":
				case ".jpg": contentType = "image/jpeg"; break;
				case ".svg": contentType = "image/svg+xml"; break;
				default:
			}
			// return a promise
			return new Promise((resolve, reject) => {
				return s3.upload({
					Bucket: 'beglam/files',
					ACL: 'public-read',
					// Key: '/files/test.jpg',
					Key: path.join('', `${fileName}${extension}`),
					Body: buffer,
					ContentType: contentType
				}, (err, result) => {
					if (err) reject(err);
					else resolve(result); // return the values of the successful AWS S3 request
				});
			});
		} catch(e) {
			return Promise.reject(e);
		}
	};

	Gallery.uploadImage = async(req) => {	
        try {
			const file = await getFileFromRequest(req);
			const filePath = file.path;
			const dirname = path.dirname(filePath);
			const filename = path.basename(filePath);
			const aws_file = await uploadFileToS3(filePath);
			
			const thmb_path = dirname + '/thmb_' + filename;
			const thumbfile = await sharp(filePath)
				.jpeg({
					quality: 100,
					chromaSubsampling: '4:4:4'
				})
				.resize({width: 256})
				.withMetadata()
				.toFile(thmb_path);

			let aws_thumb;
			if (thumbfile) {
				aws_thumb = await uploadFileToS3(thmb_path);
			}
			
			// save the data to the frog how ever you want
			return {
				file: aws_file,
				thumb: aws_thumb
			}
		} catch(e) {
			return Promise.reject(e);
		}
	};
	
	Gallery.uploadPhoto = async(access_token, req) => {
		const Accounts = Gallery.app.models.Accounts;
		// const Container = Gallery.app.models.Container;
		try {
			const clientUser = await Accounts.getUserFromToken(access_token);
			const clientObj = await clientUser.client.get();
			if (!clientObj) return Promise.resolve(Common.makeResult(true, Common.RETURN_TYPE.ERROR_ACCOUNT, 'this user has no client object'));
			const file = await Gallery.uploadImage(req);
			const gallery = await clientObj.gallery.create({
				etag: file.file.ETag,
				file: file.file.Key,
				link: file.file.Location,
				thumb_file: file.thumb.Key,
				thumb_tag: file.thumb.ETag,
				thumb_link: file.thumb.Location,
			});
			return Promise.resolve(Common.makeResult(true, 'success', gallery));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Gallery.remoteMethod('uploadPhoto', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'client token id'},
            { arg: 'req', type: 'object', http: { source:'req' }, description: 'attach parameter: "file"' },
		],
		description: [
			'(client) upload file.	',
			'https://zpl.io/a878v1E'
		],
		returns: {
			arg: 'res',
			type: 'Gallery',
			description: 'uploaded gallery'
		},
		http: {path:'/upload-photo', verb: 'post'}
	});

	
	Gallery.uploadUserPicture = async(access_token, req) => {
		const Accounts = Gallery.app.models.Accounts;
		try {
			const userObj = await Accounts.getUserFromToken(access_token);
			const file = await Gallery.uploadImage(req);
			const gallery = await userObj.userPicture.create({
				etag: file.file.ETag,
				file: file.file.Key,
				link: file.file.Location,
				thumb_file: file.thumb.Key,
				thumb_tag: file.thumb.ETag,
				thumb_link: file.thumb.Location,
			});
			userObj.picture = gallery.thumb_link ? gallery.thumb_link : gallery.link;
			return Promise.resolve(Common.makeResult(true, 'success', gallery));
		} catch(e) {
			return Promise.reject(e);
		}
	}
	Gallery.remoteMethod('uploadUserPicture', {
		accepts: [
			{arg: 'access_token', type: 'string', required: true, description: 'user token id'},
            { arg: 'req', type: 'object', http: { source:'req' }, description: 'attach parameter: "file"' },
		],
		description: [
			'(client, pro) upload user picture.',
		],
		returns: {
			arg: 'res',
			type: 'Gallery',
			description: 'uploaded gallery'
		},
		http: {path:'/upload-user-picture', verb: 'post'}
	});
};
