

module.exports = function(req, res, ok) {

	var sessionUserMatchesId = req.session.User == req.session.User; // ===equal value and equal type
	var isAdmin = req.session.User.admin;

	// the req id does not match the user's id, and this is not an admin
	if (!(sessionUserMatchesId || isAdmin)) {
		var noRightsError = [{
			name: 'noRights',
			message: 'You must be an admin '
		}]
		req.session.flash = {
			err: noRightsError
		}
		res.redirect('/session/new');
		return;
	}

	ok();

};
