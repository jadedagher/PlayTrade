
$(document).ready(function()){


	$('.myForm').validate({
		rules: {
			firstname: {
				required: true
			},

			lastname: {
				required: true
			},

			pseudo: {
				required: true
			},

			email: {
				required: true,
				email: true
			},

			password: {
				minlength: 6,
				required: true
			},

			confirmation: {
				minlength: 6,
				equalTo: '#password'
			},

		},

		sucess: function(element){
			element.text('OK').addClass('valid')
		}
	});

};

// a revoir pour le formulaire intelligent
// voir aussi le fichier flash.js  
