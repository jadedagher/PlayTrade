  /**
  * UserController
  *
  * @description :: Server-side logic for managing users
  * @help        :: See http://links.sailsjs.org/docs/controllers
  */


 module.exports = {


 	//this loads the sign-up page --> registration.ejs
 	"registration": function(req, res) {
 		// res.locals.flash = _.clone(req.session.flash);
 		res.view();
 		// req.session.flash = {};
 	},

 	//Create a user with the params sent from
 	//the sign-up form --> registration.ejs
 	create: function(req, res, next) {

 		var userObj = { //on passe les parametres en objet pour la securité
 			firstname: req.param('firstname'),
 			lastname: req.param('lastname'),
 			pseudo: req.param('pseudo'),
 			email: req.param('email'),
 			password: req.param('password'),
 			confirmation: req.param('confirmation')

 		}

 		User.create(userObj, function userCreated(err, user) {

 			//if there is an error
 			if (err) {
 				// console.log(err);
 				req.session.flash = {
 					err: err
 				}

 				//if error redirect back to sign-up page
 				return res.redirect('/user/registration');

 			}



 			//to log the user in
 			req.session.authenticated = true;
 			req.session.User = user;



 			//after successfully creating the user
 			//redirect to the action page form
 			// res.json(user);
 			// req.session.flash = {};


 			//change the status to online
 			user.online = true;

 			user.save(function(err, user) {
 				if (err) return (err);

 				res.redirect('/user/profil/'+req.session.User.id); ////user.id
 			});



 			// si l'utilisateur existe deja ERROR
 			// if (req.userObj == req.userObj) {

 			// 	var UserAlreadyExist = [{
 			// 		name: 'UserAlreadyExist',
 			// 		message: 'this user already exist'
 			// 	}]
 			// 	req.session.flash = {
 			// 		err: UserAlreadyExist
 			// 	}

 			// 	res.redirect('/user/registration');
 			// 	return;


 			// }

 		});
 	},



 	//passing parameters to the profil page (url: user/profil/345678987678)
 	profil: function(req, res, next) {

 		User.findOne({
 				id: req.params['id']
 			})
 			.exec(function foundUser(err, user) {
 				if (err) return next(err);
 				if (!user) return next();
 				res.view({
 					user: user
 				});
 			});
 	},

	 award: function(req, res, next) {

		 User.findOne({
				 id: req.params['id']
			 })
			 .exec(function foundUser(err, user) {
				 if (err) return next(err);
				 if (!user) return next();
				 res.view({
					 user: user
				 });
			 });
	 },



 	//passing parameters to the home page (url: user/lahome/345678987678)
 	lahome: function(req, res, next) {
 		User.findOne({
 				id: req.params['id']
 			})
 			.exec(function foundUser(err, user) {
 				if (err) return next(err);
 				if (!user) return next();
 				res.view({
 					user: user
 				});
 			});
 	},
   

   transaction_panel: function(req, res, next) {

     Transaction.find().sort({'volume':-1}).exec(function foundTransactionBUY(err, transactionsBUY) {
       if (err) return next(err);
       res.view({
         transactionsBUY: transactionsBUY
       });
     });
		 
   },
   

   // New ranking function with decreasing order : just adding the 'sort' function on the wallet field !!
   UserRank: function(req, res, next) {
     User.find().sort({'wallet':-1}).exec(function foundUserRanking(err, UserRanking){
       if (err) return next(err);
       res.view({
         UserRanking: UserRanking

       });
     });

   },

	 GroupRank: function(req, res, next) {
		 Group.find().sort({'GroupWallet':-1}).exec(function foundGroupRanking(err, GroupRanking){
			 if (err) return next(err);
			 res.view({
				 GroupRanking: GroupRanking

			 });
		 });

	 },

	 Uteam: function(req, res, next) {
		 User.find({ team: req.session.User.team }).sort({'wallet':-1}).exec(function foundUserTeam(err, Teammate){
			 if (err) return next(err);
			 res.view({
				 Teammate: Teammate

			 });
		 });

	 },



	 group: function(req, res, next) {
		 Group.find().sort({'GroupWallet':-1}).exec(function foundGroup(err, UserGroup){
			 if (err) return next(err);
			 res.view({
				 UserGroup: UserGroup

			 });
		 });

	 },



   /*
    * Initial function without ranking
    */

   //rank: function(req, res, next) {
   //  User.find(function foundUserRanking(err, UserRanking){
   //    if (err) return next(err);
   //    res.view({
   //      UserRanking: UserRanking,

   //    });
   //  });
   //},


 	//passing parameters to the index page (url: locahost:1234/user)	ADMINISTRATION PAGE
 	index: function(req, res, next) {

 		/////test
 		// console.log(new Date()); //mi ici au hasard
 		// console.log(req.session.authenticated);			//pour voir la session sur la console// voir SessionController.ejs
 		/////test

 		User.find(function foundUser(err, users) {
 			if (err) return next(err);
 			res.view({
 				users: users
 			});
 		});
 	},

 	//to edit the information
 	edit: function(req, res, next) {
 		User.findOne({
 				id: req.params['id']
 			})
 			.exec(function foundUser(err, user) {
 				if (err) return next(err);
 				if (!user) return next('User doesn\'t exist.');
 				res.view({
 					user: user
 				});
 			});
 	},



 	////to updated the information
 	update: function(req, res, next) {

    
 		// Data transfer object
 		if (req.session.User.admin) {
 			var userObj = { //on passe les parametres en objet pour la securité
 				firstname: req.param('firstname'),
 				lastname: req.param('lastname'),
 				pseudo: req.param('pseudo'),
 				email: req.param('email'),
 				admin: req.param('admin')
 			}
 		} else {
 			var userObj = {
 				firstname: req.param('firstname'),
 				lastname: req.param('lastname'),
 				pseudo: req.param('pseudo'),
 				email: req.param('email'),
 			}
 		}

 		if (userObj.admin === 'on') { //pour que l'administrateur puisse designer un autre user comme
 			userObj.admin = true; //administrateur ATTENTION (methode peut etre pas fiable)
 		}

 		User.update(req.param('id'), userObj, function userUptated(err) {
      

 			if (err) {
 				return res.redirect('/user/edit/' + req.params('id'))
 			}
 			res.redirect('/user/profil/' + req.param('id'));
 		});
 	},


 	// destroy user in index
 	destroy: function(req, res, next) {
 		User.findOne({
 				id: req.params['id']
 			})
 			.exec(function foundUser(err, user) {
 				if (err) return next(err);
 				if (!user) return next('User doesn\'t exist.');

 				User.destroy(req.param('id'), function userDestroyed(err) {
 					if (err) return next(err);
 				});

 				res.redirect('/user');
 			});
 	}



 };

