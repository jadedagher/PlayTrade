module.exports = function(req,res,next){
	
	//create blank object 
	res.locals.flash = {};

	//if req.session.flash do not exit return next 
	if (!req.session.flash) return next();

	//if req.session.flash exit on creer une copie de req.session.flash et on l'assigne à res.locals.flash
	res.locals.flash = _.clone(req.session.flash);
	
	//et ensuite on le clear
	req.session.flash = {};

	next();
};



// a revoir pour le formulaire intelligent 
// voir aussi le fichier customValidate.js 