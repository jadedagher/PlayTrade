
document.getElementById("time").innerHTML = Date();


	//button to reload page
	function reloadPage() {
    	location.reload();
	}

	//button to put/call
	// $(document).ready(function(){
	//     $("#call").click(function(){
	//         alert("You are trying to buy " + $("#exampleInputAmount1").val() +" actions at " +$("#LastTradePriceOnly").html() +" so " +$("#exampleInputAmount2").val()*$("#LastTradePriceOnly" ).html() +" USD ");
	//     	});
	//     $("#put").click(function(){
	//         alert("You are trying to buy " + $("#exampleInputAmount2").val() +" actions at " +$("#LastTradePriceOnly" ).html() +" so " +$("#exampleInputAmount2").val()*$("#LastTradePriceOnly" ).html() +" USD ");
	//     	});
	// });

	//button to get value of LastTradePriceOnly
	$(document).ready(function(){
    $("#LastTradePriceOnlybtn").click(function(){
        alert($("#LastTradePriceOnly").html());
    	});
	})
