/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports = {

	upload: function(req, res) {
		if (req.method === 'GET')
			return res.json({
				'status': 'GET not allowed'
			});
		//	Call to /upload via GET is error

		var uploadFile = req.file('uploadFile');
		console.log(uploadFile);

		uploadFile.upload(function onUploadComplete(err, files) {
			//	Files will be uploaded to .tmp/uploads

			if (err) return res.serverError(err);
			//	IF ERROR Return and send 500 error with error

			console.log(files);
			res.json({
				status: 200,
				file: files
			});
		});

		uploadFile.upload({
			dirname: '../../assets/images'
		}, function onUploadComplete(err, files) {
			// Earlier it was ./assets/images .. Changed to ../../assets/images
			//	Files will be uploaded to ./assets/images
			// Access it via localhost:1337/images/file-name


			if (err){
				console.log(err);
				return res.serverError(err);
			}
			//	IF ERROR Return and send 500 error

			console.log(files);
			res.json({
				status: 200,
				file: files
			});
		});

	},

	//supprimer un document de la liste des document telechargé
	// destroy: function(req, res, next) {
	// 	File.findOne({
	// 			id: req.params['id']
	// 		})
	// 		.exec(function foundfile(err, file) {
	// 			if (err) return next(err);
	// 			if (!user) return next('File doesn\'t exist.');

	// 			File.destroy(req.param('id'), function fileDestroyed(err) {
	// 				if (err) return next(err);
	// 			});

	// 			res.redirect('/lahome');
	// 		});
	// },
};


// req.file('avatar').upload(function (err, uploadedFiles){
//   if (err) return res.send(500, err);
//   return res.send(200, uploadedFiles);
// });

