function logoutuser() {
	location.href= "logoutv/"		
}

function neworderrollout(){ 


	if ($("#openorderbutton").html() == "Close Orders »") {
		viewopenorders();
	}
	
	if ($("#neworderbutton").html() == "Cancel Order »") {
		$("#neworderbutton").html("New Order »")
		$("#neworderform").fadeOut("fast")
	} 
	else {
		$("#neworderbutton").html("Cancel Order »")
		$("#neworderform").fadeIn("fast")	
	}

}


function addorder(){


	//if ($("#timelimit").val() == "") {alert("Please enter a time limit."); return;};
	timelimit = $("#timelimitfield").val();
	mylocation = $("#locationselector").find(":selected").text();
	restaurant = $("#restaurantselector").find(":selected").text();

	
	data = "restaurant="+restaurant + "&location=" + mylocation + "&timelimit=" + timelimit;
	
	var url = "http://localhost:8000/Food"
	$.ajax({
		type: "GET",
		url : url + '/neworder/',
		data : data,
		success: function(data) {
				alert(data);
				
		
		}
	});		 
	
	
}
$(document).ready(function(){

	document.getElementById("neworderform").style.display = "none";
	document.getElementById("ordertable").style.display = "none";
	document.getElementById("myorders").style.display = "none";
	document.getElementById("newMealBox").style.display = "none";


})


function viewopenorders() {

	if ($("#neworderbutton").html() == "Cancel Order »") {
		neworderrollout();
	}

	if ($("#openorderbutton").html() == "Close Orders »") {
		$("#openorderbutton").html("Open Orders »")
		$("#ordertable").fadeOut("fast")
	} 
	else {
		$("#openorderbutton").html("Close Orders »")
		$("#ordertable").fadeIn("fast")	
	}

}


function viewyourorder() {

	if ($("#neworderbutton").html() == "Cancel Order »") {
		neworderrollout();
	}

	if ($("#openyourorderbutton").html() == "Close Orders »") {
		$("#openyourorderbutton").html("Open Orders »")
		$("#myorders").fadeOut("fast")
	} 
	else {
		$("#openyourorderbutton").html("Close Orders »")
		$("#myorders").fadeIn("fast")	
	}

}


function newMeal() {
		$("#newMealBox").fadeIn("fast")	
}