module.exports = function(req, res, ok) {

	//user alowed but control



	if (req.session.User && req.session.User.admin) {
		return ok();
	}

  else {
		//if user is not allowed
		var requireAdminError = [{
			name: 'requireAdminError',
			message: 'You must be an admin '
		}]
		req.session.flash = {
			err: requireAdminError
		}
		res.redirect('/session/new');
		return;
	}


};
