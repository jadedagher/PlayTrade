/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	'new': function(req, res) {

		// var oldDateObj = new Date();
		// var newDateObj = new Date(oldDateObj.getTime()+60000);		//pour créer une session a revoir plutard
		// req.session.cookie.expires = newDateObj;						//voir UserController.js ligne 97-98 test
		// req.session.authenticated = true;
		// console.log(req.session);
		// // console.log(new Date());
		res.view('session/new')
	},


	//script d'authentification

	create: function(req, res, next) {

		if (!req.param('pseudo') || !req.param('password')) {

			var usernamePasswordRequiredError = [{
				name: 'usernamePasswordRequired',
				message: 'you must enter both pseudo and password.'
			}]
			req.session.flash = {
				err: usernamePasswordRequiredError
			}

			res.redirect('/session/new');
			return;


		}

		User.findOneByPseudo(req.param('pseudo'), function foundUser(err, user) {
			if (err) return next(err);
			if (!user) {
				var noAccountError = [{
					name: 'noAccount',
					message: 'The Pseudo' + req.param('email') + 'not found.'
				}]
				req.session.flash = {
					err: noAccountError
				}
				res.redirect('session/new');
				return;
			}

			// toujours mettre require('bcrypt'). au lieu de bcrypt.
			require('bcrypt').compare(req.param('password'), user.encryptedPassword, function(err, valid) {
				if (err) return next(err);
				if (!valid) {
					var usernamePasswordMismatchError = [{
						name: 'usernamePasswordMismatchError',
						message: 'Invalid Pseudo and Password combination'
					}]
					req.session.flash = {
						err: usernamePasswordMismatchError
					}
					res.redirect('session/new');
					return;
				}

				req.session.authenticated = true;
				req.session.User = user;

        req.session.User.wallet = user.wallet;

				//change to online
				user.online = true;
				user.save(function(err, user) {
					if (err) return (err);


					//if the user is an admin redirect to the user panel
					//this is used in conjunction whith config/policies.js file
					if (req.session.User.admin) {
						res.redirect('/user'); //user.id
						return;
					}

					res.redirect('/user/profil/'+req.session.User.id); //redirige sur la home //user.id

				});
			});
		});
	},


	destroy: function(req, res, next) {

		User.findOne(req.session.User.id, function foundUser(err, user) {

			var userId = req.session.User.id;

			User.update(userId, {
				online: false
			}, function(err) {

				if (err) return next(err);

				req.session.destroy();
				res.redirect('/session/new');

			});
		});
	}

};
