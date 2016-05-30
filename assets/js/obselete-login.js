//script obselete 




// function LoginIdPass(form) {

// 	if (form.id.value == "jade" && form.pass.value == "dagher") {

// 		document.location.href = 'home.html';

// 	} else {
// 		alert("Invalid Username & Invalid Password");
// 	}
// }


// var attempt = 3; // Variable to count number of attempts.
// // Below function Executes on click of login button.
// function validatelogin() {

// 	var username = document.getElementById("username").value;
// 	var password = document.getElementById("password").value;


// 	if (username == "jade" && password == "dagher") {
// 		alert("Login successfully");
// 		window.location = "/home"; // Redirecting to other page.
// 		return false;

// 	} 


// 	else {
		
// 		attempt--; // Decrementing by one.
// 		alert("You have left " + attempt + " attempt");
// 		// Disabling fields after 3 attempts.
// 		if (attempt == 0) {
// 			document.getElementById("username").disabled = true;
// 			document.getElementById("password").disabled = true;
// 			document.getElementById("submit").disabled = true;
// 			return false;
// 		}
// 	}
// }