function logoutuser() {
    location.href = "logoutv/"
}

function orderArrived(){
    url = 
    $.ajax({
        type: "GET",
        url: url,
        data: data,
        success: function(data) {
            if (data == 1)
                // location.href = location.href
                window.location.reload();
        }
    });
}

function neworderrollout() {
    if ($("#openAllOrders").html() == "Close Orders »") {
		// alert('ads');
        $("#openAllOrders").html("Open Orders »")
        $("#myorders").hide()
        $("#neworderbutton").html("Cancel Order »")
        $("#neworderform").fadeIn("fast")
		return;
	}

    if ($("#neworderbutton").html() == "Cancel Order »") {
        $("#neworderbutton").html("New Order »")
        $("#neworderform").fadeOut("fast")
    } else {
        $("#neworderbutton").html("Cancel Order »")
        $("#neworderform").fadeIn("fast")
    }

}


function viewAllOrders() {
    if ($("#neworderbutton").html() == "Cancel Order »") {
        $("#neworderbutton").html("New Order »")
        $("#neworderform").hide()
		$("#myorders").fadeIn("fast")
	}
    if ($("#openAllOrders").html() == "Close Orders »") {
        $("#openAllOrders").html("Open Orders »")
        $("#myorders").fadeOut("fast")
    } else {
        $("#openAllOrders").html("Close Orders »")
        $("#myorders").fadeIn("fast")
    }
}


function addorder() {
    timelimit = $("#timelimitfield").val();
    mylocation = $("#locationselector").find(":selected").text();
    restaurant = $("#restaurantselector").find(":selected").text();
    data = "restaurant=" + restaurant + "&location=" + mylocation + "&timelimit=" + timelimit;
	var url = location.href.replace( '/#', '') + '/neworder/'
	
    $.ajax({
        type: "GET",
        url: url,
        data: data,
        success: function(data) {
			if (data == 1)
				// location.href = location.href
				window.location.reload();


            // alert(data);
			// $("#neworderbutton").html("New Order »")
			// $("#neworderform").hide()
			// $("#openAllOrders").html("Open Orders »")
			// $("#myorders").fadeIn("fast")
        }
    });
	
	
}


$(document).ready(function() {

    document.getElementById("neworderform").style.display = "none";
    document.getElementById("ordertable").style.display = "none";
	if (document.getElementById("orderArrivedD") != null)
		document.getElementById("orderArrivedD").style.display = "none";
		document.getElementById("myorders").style.display = "none";
	if (document.getElementById("createMealForm") != null)
		document.getElementById("createMealForm").style.display = "none";
    document.getElementById("addRestaurantDiv").style.display = "none";
    document.getElementById("addLocationDiv").style.display = "none";
    var elems = document.getElementsByClassName('singleAdd');
    var addBoxes = document.getElementsByClassName('addBox');
    var countBoxes = document.getElementsByClassName('countBox');
    var removeSignDivs = document.getElementsByClassName('removeSignDiv');
	// if (document.getElementById("SRO").innerHTML.length > 5) 
		// viewyourorder()
    for (var i = 0; i < elems.length; i++) {
        elems[i].style.display = "none";
        addBoxes[i].style.display = "none";
        countBoxes[i].style.display = "none";
    }
	
    for (i = 0; i < removeSignDivs.length; i++) {

        removeSignDivs[i].style.display = "none";
    }

    function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie != '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = jQuery.trim(cookies[i]);
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) == (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
    }
    // Ajax setup to forward the CSRF token
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            // generate CSRF token using jQuery
            var csrftoken = getCookie('csrftoken');
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                // Only send the token to relative URLs i.e. locally.
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
	
	
    var allTimerDivs = document.getElementsByClassName('timerDivs');
	for (i = 0; i < allTimerDivs.length; i++)
	{	
		setTimer(i)
	}
})

// function viewopenorders() {
    // if ($("#neworderbutton").html() == "Cancel Order »") {
	
        // $("#neworderbutton").html("New Order »")
        // $("#neworderform").fadeOut("fast", function() {
			// $("#ordertable").fadeIn("fast")
		
		
		
		// })	
	

    // }
    // if ($("#openorderbutton").html() == "Close Orders »") {
        // $("#openorderbutton").html("Open Orders »")
        // $("#ordertable").fadeOut("fast")
    // } else {
        // $("#openorderbutton").html("Close Orders »")
        // $("#ordertable").fadeIn("fast")
    // }
// }


function newMeal(v) {
    jQuery(v).children().eq(0).fadeOut("fast", function() {
            jQuery(v).children().eq(1).fadeIn("fast");
            jQuery(v).prev().prev().children().eq(0).hide()
            jQuery(v).prev().prev().children().eq(1).show()
            jQuery(v).prev().prev().children().eq(1).children().eq(0).show()
            jQuery(v).prev().children().eq(0).show()

	})
}


function addMeal(v, pj, oid) {
	var user = pj;
    // alert('ads')
    mealName = ($("#mealselecter").find(":selected").text()).split(',')[0];
    count = $("#mealcountselecter").find(":selected").text();
    price = (($("#mealselecter").find(":selected").text()).split(',')[1]).split(' ')[1];

    var current = jQuery(v).parent().parent().parent().parent().parent().parent().next().children().last().html().split('>').pop()
    var newTotal = parseInt(current) + (price * count)

    var url = location.href.replace( '/#', '')
    $.ajax({
        type: "GET",
        url: url + '/addmeal/',
        data: "mealName=" + mealName + "&count=" + count + "&userM=" + user + "&oid=" + oid,
        success: function(data) {
            var aHtml = '<tr><td onmouseover="addRemove(this, 0)" onmouseout="addRemove(this, 1)"> <div class="mealDiv">'
            aHtml += mealName + '</div><div class="removeSignDiv" style="display: none;">'
            aHtml += '<img onclick= "removeMeal(this, ' + data + ')" class="removeSign" src="/static/Food/images/remove.png" alt=""  > '
            aHtml += '</div></td><td align="center">' + count + '</td><td align="center">' + (price * count) + '</td></tr>'
            $("#newMealRow").before(aHtml)
            jQuery(v).parent().parent().parent().parent().parent().parent().next().children().last().html(newTotal)

            $("#newMealRow").children().eq(0).children().eq(1).hide()
            $("#newMealRow").children().eq(0).children().eq(0).show()

            $("#newMealRow").children().eq(1).children().eq(0).hide()

            $("#newMealRow").children().eq(2).children().eq(1).hide()
            $("#newMealRow").children().eq(2).children().eq(0).show()

        }
    });
}

function addRemove(t, a) {
    if (a == 0)
        jQuery(t).children().eq(1).show();
    else
        jQuery(t).children().eq(1).hide();
}

function removeMeal(t, mid) {
	var url = location.href.replace( '/#', '')
    $.ajax({
        type: "GET",
        url: url + '/removeMeal/',
        data: "mealID=" + mid,
        success: function(data) {}
    });
    var current = jQuery(t).parent().parent().next().next().html().split('>').pop()
    var oldTotal = jQuery(t).parent().parent().parent().parent().parent().parent().next().children().last().html().split('>').pop()
    var newTotal = parseInt(oldTotal) - parseInt(current)
    jQuery(t).parent().parent().parent().parent().parent().parent().next().children().last().html(newTotal)
    jQuery(t).parent().parent().parent().remove();
}

function createMeal(t) {
    if ($("#mealselecter").find(":selected").text() == "Create Meal") {
        $("#newMealRow").fadeOut("fast", function() {
            $("#createMealForm").show();
        })
    }
}

function createMealButtonF(t, restaurant) {
    mealName = $("#createMealName").val();
    mealPrice = $("#createMealPrice").val();

    var url = location.href.replace( '/#', '')
    $.ajax({
        type: "GET",
        url: url + '/createNewMeal/',
        data: "mealName=" + mealName + "&mealPrice=" + mealPrice + "&restaurant=" + restaurant,
        success: function(data) {


            var aHtml = '<option value="">' + mealName + ', ' + mealPrice + ' QAR</option>'
            $("#lastOption").before(aHtml)

            $("#createMealForm").fadeOut("fast", function() {
                $("#newMealRow").show();
                $('#mealselecter option:selected').prev().attr('selected', 'selected');

            })

        }
    });
}

function cancelNewMealF() {
    $("#createMealForm").fadeOut("fast", function() {
        $("#newMealRow").show();
        $('#mealselecter option:selected').prev().attr('selected', 'selected');

    })
}


function setTimer(i) {

    var elems = document.getElementsByClassName('timerDivs');
	
	orderTime = parseInt(elems[i].innerHTML.split(', ')[elems[i].innerHTML.split(', ').length-1])
	timeElapsed = parseInt(elems[i].innerHTML.split('&')[0])
	// alert(orderTime)
	// alert(timeElapsed)
	// alert(ff)

	var count=(orderTime-timeElapsed)*60;
	var counter=setInterval(timer, 1000); //1000 will  run it every 1 second
	function timer()
	{
	  count=count-1;
	  if (count <= 0)
	  {
		clearInterval(counter);
		elems[i].innerHTML = "On the way"
		$("#orderArrivedD").show(); 
		 return;
	  }
		var rmin = (Math.ceil(count/60)-1)
		var rsec = count % 60
		var ts = "Open for " + rmin + ":" + rsec
		if (ts.length != 13) {
			var ts = "Open for " + rmin + ":0" + rsec
		}
		elems[i].innerHTML = ts // watch for spelling
	}
	timer();
	
}


function addNewRestaurant() {
    if ($("#restaurantselector").find(":selected").text() == "Add Restaurant") {
        $("#neworderform").fadeOut("fast", function() {
            $("#addRestaurantDiv").show();
        })
    }
}

function createRestaurant() {

    restaurant = $("#createRestaurantBox").val();
    restaurantWebsite = $("#createRestaurantSiteBox").val();
	var data;
	if (restaurantWebsite=="") {
		data = "restaurant=" + restaurant + "&restaurantWebsite=0"
	} else {
		data = "restaurant=" + restaurant + "&restaurantWebsite=" + restaurantWebsite
	}
    var url = location.href.replace( '/#', '')
    $.ajax({
        type: "GET",
        url: url + '/addNewRestaurant/',
        data: data,
        success: function(data) {
            var aHtml = '<option value="">' + restaurant + '</option>'
            $("#restLastOption").before(aHtml)
			$('#restaurantselector option:selected').prev().attr('selected', 'selected');
			
			$("#addRestaurantDiv").fadeOut("fast", function() {
            $("#neworderform").show(); 
        })			
        }
    });	
}

function addNewLocation() {
    if ($("#locationselector").find(":selected").text() == "Add Location") {
        $("#neworderform").fadeOut("fast", function() {
            $("#addLocationDiv").show();
        })
    }
}

function addLocation() {

    newLocation = $("#addLocationBox").val();

	data = "newLocation=" + newLocation;
	var url = location.href.replace( '/#', '') + '/addNewLocation/'
   $.ajax({
        type: "GET",
        url: url,
        data: data,
        success: function(data) {
            var aHtml = '<option value="">' + newLocation + '</option>'
            $("#locationLastOption").before(aHtml)
			$('#locationselector option:selected').prev().attr('selected', 'selected');
			
			$("#addLocationDiv").fadeOut("fast", function() {
            $("#neworderform").show(); 
        })			
        }
    });	
	alert
}
 

function joinOrder(oid) {
	// obj = eval('{' + meals.substring(1,meals.length-1) + '}'); 
	// alert(meals.substring(1,meals.length-1));
	// myArray = (meals.substring(1,meals.length-1)).split(",");
	// alert('asd')
    // for (var i = 0; i < myArray.length; i++) {
		// if (i==0) {
			// myArray[i] = myArray[i].substring(7,myArray[i].length-1);
		// } else {
			// myArray[i] = myArray[i].substring(8,myArray[i].length-1);
		// }
		// alert("+"+myArray[i]+"+");
    // }
	location.href = location.href.replace( '/#', '') + "/?oid=" + oid
	// viewyourorder();
}	
	



	
function orderArrived(oid) {

}
	
	
	
	
	
	
