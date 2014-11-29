
/*Background image taken from
http://img2.wikia.nocookie.net/__cb20131204233125/whatever-you-want/images/e/e0/Hd-food-wallpaperswallpapers-foods-pizza-food-hd-1920x1200-s8uotxhd.jpg
*/

function logoutuser() {
    location.href = "logoutv/"
}

function hasOrderArrived(){

    $.ajax({
        type: "GET",
        url: "hasOrderArrived/",
        success: function(data) {
            data = data.split(",")
            status = data[0]
            from_user = data[1]

            oid = 0
            if(data.length > 2){
                oid = parseInt(data[2])
            }
            

            /*status 
            #1: orderArrived
            #2: joinedOrder
            #3: mealAdded
            #4: new order created
            #-3:left order
            #-2: order cancelled
            #-4: removed meal*/
            var tone = document.getElementById("tone"); 
			
            if(status == "1"){
                $(".alerts").html("<div class='alert-message success'><a class='close' onclick = 'removeNotification()' >×</a><p><strong>Your order has arived!</strong></p></div>");
               
				if (document.getElementById("leaveOrderButton") != null)
					document.getElementById("leaveOrderButton").style.display = "none";				
                if (window.navigator && window.navigator.vibrate) {
                    navigator.vibrate([1000, 500, 1000, 500, 2000]);
                } else {
                    console.log("Cant vibrate");
                }
            }
            else if (status == "-2"){
                $(".alerts").html("<div class='alert-message error'><a class='close' onclick = 'removeNotification()' >×</a><p><strong><a href = ''>Your order has been cancelled by its creator!</a></strong></p></div>");
                if (window.navigator && window.navigator.vibrate) {
                    navigator.vibrate(1000);
                }
                tone.play();
            }

            else if (status == "4"){
                 $(".alerts").html("<div class='alert-message info'><a class='close' onclick = 'removeNotification()' >×</a><p><strong><a href = ''>A new order has been created by " + from_user + ".Click to update orders!</a></strong></p></div>");
                 if (window.navigator && window.navigator.vibrate) {
                    navigator.vibrate(1000);
                }
                tone.play();
            }

            else if (status == "2"){
                 $(".alerts").html("<div class='alert-message info'><a class='close' onclick = 'removeNotification()' >×</a><p><strong><a href = ''>" + from_user + " just joined your order. Click to refresh!</a></strong></p></div>");
                 if (window.navigator && window.navigator.vibrate) {
                    navigator.vibrate(1000);
                }
                tone.play();
            }

            else if (status == "3"){
                 $(".alerts").html("<div class='alert-message info'><a class='close' onclick = 'removeNotification()' >×</a><p><strong><a href = ''>A new meal has been added by " + from_user + " to your order. Click to refresh!"+ "</a></strong></p></div>");
                 if (window.navigator && window.navigator.vibrate) {
                    navigator.vibrate(1000);
                }
                tone.play();
            }

            else if (status == "-3"){
                 $(".alerts").html("<div class='alert-message info'><a class='close' onclick = 'removeNotification()' >×</a><p><strong><a href = ''>" + from_user + " just left your order."+ "Click to refresh!</a></strong></p></div>");
                 if (window.navigator && window.navigator.vibrate) {
                    navigator.vibrate(1000);
                }
                tone.play();
            }

            else if (status == "-4"){
                 $(".alerts").html("<div class='alert-message info'><a class='close' onclick = 'removeNotification()' >×</a><p><strong><a href = ''>A meal has been removed from your order. Click to refresh!</a></strong></p></div>");
                 if (window.navigator && window.navigator.vibrate) {
                    navigator.vibrate(1000);
                }
                tone.play();
            }

            if (oid >1){
                constructID =oid+",-1"
                var x=document.getElementById(constructID);
                x.innerHTML = "Arrived";
            }   
        }
    });
}

function orderArrived(v, orderId){
    console.log("pressed arrived " + orderId);
    $.ajax({
        type: "GET",
        url: "orderArrived/",
        data: "data="+orderId,
        success: function(data) {
		// (data);
            if (data == 1){
                $(".alerts").html("<div class='alert-message info'><a class='close' onclick = 'removeNotification()' href='#'>×</a><p><strong>Your friends will be notified that their food has arrived!</strong></p></div>");
                console.log("Done");
				jQuery(v).closest("tbody").parent().parent().parent().find(".timerDivs").parent().html("Arrived");
				jQuery(v).hide();
            }
        }
    });
}

function removeNotification(){
    $(".alerts").html("")
}

function viewmyorders(){
     if ($("#openAllOrders").html() == "Close Orders") {
        // alert('ads');
        $("#openAllOrders").html("Open Orders")
        $("#ordertable").hide()
        $("#neworderbutton").html("Cancel Order")
        $("#neworderform").fadeIn("fast")
        return;
    }
    $("#ordertable").fadeIn("fast")
}

function neworderrollout() {
    if ($("#openAllOrders").html() == "Close Orders") {
		// alert('ads');
        $("#openAllOrders").html("Open Orders")
        $("#myorders").hide()
        $("#neworderbutton").html("Cancel Order")
        $("#neworderform").fadeIn("fast")
		return;
	}

    if ($("#neworderbutton").html() == "Cancel Order") {
        $("#neworderbutton").html("New Order")
        $("#neworderform").fadeOut("fast")
    } else {
        $("#neworderbutton").html("Cancel Order")
        $("#neworderform").fadeIn("fast")
    }
	$("#addLocationDiv").hide();
	$("#addRestaurantDiv").hide();
}

function viewAllOrders() {
	$("#addLocationDiv").hide();
	$("#addRestaurantDiv").hide();
    if ($("#neworderbutton").html() == "Cancel Order") {
        $("#neworderbutton").html("New Order")
        $("#neworderform").hide()
		$("#myorders").fadeIn("fast")
	}
    if ($("#openAllOrders").html() == "Close Orders") {
        $("#openAllOrders").html("Open Orders")
        $("#myorders").fadeOut("fast")
    } else {
        $("#openAllOrders").html("Close Orders")
        $("#myorders").fadeIn("fast")
    }
	
}

function showPeopleLimit(v) {
	if (v == 0)
		$("#PeopleLimit").fadeOut("fast")
	else 
		$("#PeopleLimit").fadeIn("fast")	

}
function addorder() {
    timelimit = $("#timelimitfield").val();
    mylocation = $("#locationselector").find(":selected").text();
    restaurant = $("#restaurantselector").find(":selected").text();
	var data;
	if (isNaN(timelimit) || timelimit <= 0) {
		alert("Enter an appropriate time limit.");
		return
	}	
    
	// Delivery
	if ($("input[name='orderType']:checked").val() == 1) {
		data = "restaurant=" + restaurant + "&location=" + mylocation + "&timelimit=" + timelimit + "&peopleLimit=0";
	}		
	
	// Dine Out
	else {
		peopleLimit = $("#peopleLimitField").val();
		if (isNaN(peopleLimit) || peopleLimit <= 0) {
			alert("Enter an appropriate people limit.");
			return
		}		
		data = "restaurant=" + restaurant + "&location=" + mylocation + "&timelimit=" + timelimit + "&peopleLimit=" + peopleLimit;
	}
    $.ajax({
        type: "GET",
		url:  'neworder/',
        data: data,
        success: function(data) {
			if (data == 1) 
				window.location.reload();
			else if (data == -1)
				alert("You already have an open order.")
			else if (data.indexOf("9") == 0) 
				alert("You're already in " + data.substring(1,data.length) + "'s order.")
			else
				alert(data + " has the same order details! Join that order.")
		}
    });
}

function leaveOrder(v, oid) {
    $.ajax({ 
        type: "GET",
        url: "leaveOrder/",
        data: "oid=" + oid, 
        success: function(data) {
			jQuery(v).parent().parent().parent().parent().prev().remove();
			jQuery(v).remove();
		}  
    });
}

function deleteOrder(v, oid) {
    $.ajax({
        type: "GET",
        url: "deleteOrder/",
        data: "oid=" + oid,
        success: function(data) {
			document.getElementById(oid).style.display = "none";
		}  
    });
}

$(document).ready(function() {

    document.getElementById("neworderform").style.display = "none";
    document.getElementById("ordertable").style.display = "none";
		document.getElementById("myorders").style.display = "none";
	if (document.getElementById("createMealForm") != null)
		document.getElementById("createMealForm").style.display = "none";
    document.getElementById("addRestaurantDiv").style.display = "none";
    document.getElementById("addLocationDiv").style.display = "none";
    var elems = document.getElementsByClassName('singleAdd');
    var addBoxes = document.getElementsByClassName('addBox');
    var countBoxes = document.getElementsByClassName('countBox');
    var removeSignDivs = document.getElementsByClassName('removeSignDiv');
    for (var i = 0; i < elems.length; i++) {
        elems[i].style.display = "none";
        addBoxes[i].style.display = "none";
        countBoxes[i].style.display = "none";
    }
    for (i = 0; i < removeSignDivs.length; i++)
        removeSignDivs[i].style.display = "none";
    
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
		setTimer(i)

    setInterval(hasOrderArrived, 3000);
	
	 $('.myorders1 th:nth-child(' + 5 + '), #myorders1 td:nth-child(' + 5 + ')').hide();
})

function showDetails(v) {
	if 	(jQuery(v).html() == "Show Details") {
		jQuery(v).parent().parent().prev().hide()
		jQuery(v).html("Hide Details")
		jQuery(v).parent().parent().prev().prev().fadeIn("fast");
	} else {
		jQuery(v).parent().parent().prev().fadeIn("fast");
		jQuery(v).html("Show Details")
		jQuery(v).parent().parent().prev().prev().hide();
	}
}

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

    // var url = location.href.replace( '/#', '')
    $.ajax({
        type: "GET",
        url:  'addmeal/',
        data: "mealName=" + mealName + "&count=" + count + "&userM=" + user + "&oid=" + oid,
        success: function(data) {
			available = true;
			// For each row
			jQuery(v).parent().parent().parent().parent().children().each(function () { 
				if (this.id != "newMealRow") {
					if (jQuery(this).children().first().children().first().html().indexOf(mealName) > -1)  {
						available = false;
						var newCount = parseInt(jQuery(this).children().first().next().html()) + parseInt(count)
						jQuery(this).children().first().next().html(newCount)
						if (jQuery(this).children().first().next().next().html().indexOf('>') > -1)
							oldPrice = parseInt(jQuery(this).children().first().next().next().html().split('>')[2])
						else 
							oldPrice = parseInt(jQuery(this).children().first().next().next().html())
						var newPrice = oldPrice + (parseInt(price) * parseInt(count))
						jQuery(this).children().first().next().next().html(newPrice)
						jQuery(v).parent().parent().parent().parent().parent().parent().next().children().last().html(newTotal)
						$("#newMealRow").children().eq(0).children().eq(1).hide()
						$("#newMealRow").children().eq(0).children().eq(0).show()
						$("#newMealRow").children().eq(1).children().eq(0).hide()
						$("#newMealRow").children().eq(2).children().eq(1).hide()
						$("#newMealRow").children().eq(2).children().eq(0).show()
					}
				}
			});
			
			if (available) {
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
	// var url = location.href.replace( '/#', '')
    $.ajax({
        type: "GET",
        url:  'removeMeal/',
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
	if (mealName == "") {
		alert("Enter a meal name.");
		return
	}	
    mealPrice = $("#createMealPrice").val();
	if (isNaN(mealPrice) || mealPrice <= 0) {
		alert("Enter an appropriate price.");
		return
	}
    // var url = location.href.replace( '/#', '')
    $.ajax({
        type: "GET",
        url:  'createNewMeal/',
        data: "mealName=" + mealName + "&mealPrice=" + mealPrice + "&restaurant=" + restaurant,
        success: function(data) {
			if (data == 3) {
				var aHtml = '<option value="">' + mealName + ', ' + mealPrice + ' QAR</option>'
				$("#lastOption").before(aHtml)
				$("#createMealForm").fadeOut("fast", function() {
					$("#newMealRow").show();
					$('#mealselecter option:selected').prev().attr('selected', 'selected');
				})
			} else {
				alert("Meal already available.");
			}
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
    // alert($(".timerDivs").eq(i).next().html())
    // alert($(".timerDivs").eq(i).next().html().indexOf("On the way"))
    var elems = document.getElementsByClassName('timerDivs');
	oidAndStatus = elems[i].id.split(",")
	// If order is not open 
	if (oidAndStatus[1] == "1" || oidAndStatus[1] == "0") {
		$(".timerDivs").eq(i).html("")
		return;
	};
	var aaa = parseInt(oidAndStatus[2])
	secondsElapsed = parseInt(elems[i].innerHTML.split(', ')[0])
	secondsLimit = parseInt(elems[i].innerHTML.split(', ')[1])*60

	orderTime = parseInt(elems[i].innerHTML.split(', ')[elems[i].innerHTML.split(', ').length-1])
	var count=secondsLimit-secondsElapsed
	var counter=setInterval(timer, 1000); //1000 will  run it every 1 second
	function timer()
	{
	  count=count-1;

	  if (count <= 0)
	  {
		clearInterval(counter);
        if(aaa >0){
            $.ajax({ 
            type: "GET",
            url: "isPartOfOrder/",
            data: "oid=" + oidAndStatus[0] + "&username=" + oidAndStatus[3],
            success: function(data) {
                if(data == "1"){
                    $(".alerts").html("<div class='alert-message success'><a class='close' onclick = 'removeNotification()' >×</a><p><strong><a href = ''>Reminder! You are supposed to got to the meet up location to dine out now. Click to update and see who else is coming!</a></strong></p></div>");
                    if (window.navigator && window.navigator.vibrate) {
                    navigator.vibrate(1000);
                    }
                    tone.play();
                }   
            }
            }); 

        elems[i].innerHTML = "Completed"
        }	
		else 
			elems[i].innerHTML = "On the way"
		$("#orderArrivedD").show(); 	
		
		if (document.getElementById("deleteOrderDiv") != null)
			document.getElementById("deleteOrderDiv").style.display = "none";

		var a = $('#newMealRow').parent().parent().parent().parent().parent().parent().parent().prev().first().children().first().html()
		var b = elems[i].innerHTML
		if (document.getElementById("newMealRow") != null && a == b)
			document.getElementById("newMealRow").style.display = "none";		
		if (document.getElementById("leaveOrderButton") != null)
			document.getElementById("leaveOrderButton").style.display = "none";				
			
			
		// AJAX CALL UPDATES STATUS	
	   $.ajax({ 
			type: "GET",
			url: "orderTimeUp/",
			data: "oid=" + oidAndStatus[0],
			success: function(data) {
				// alert('status updated');
			}
		});	
		 return;
	  }
		var rmin = (Math.ceil(count/60)-1)
		var rsec = count % 60
		// alert((rsec+"").length) 
		if ((rsec+"").length == 1)
			rsec = "0"+rsec
		if (rsec == 0) rmin += 1;
		// alert(rmin)
		// alert(oidAndStatus)
		// alert(oidAndStatus[2])
		if (aaa > 0)
			var ts = "Leaving in " + rmin + ":" + rsec
		else 
			var ts = "Open for " + rmin + ":" + rsec

		if (elems[i] != null)
			elems[i].innerHTML = ts
	}
	timer();
	
}

// $("#myorders1 > thead th:nth-child(0)").hide();

function addNewRestaurant() {
    if ($("#restaurantselector").find(":selected").text() == "Add Restaurant") {
        $("#neworderform").fadeOut("fast", function() {
            $("#addRestaurantDiv").show();
        })
    }
}

function createRestaurant() {

    restaurant = $("#createRestaurantBox").val();
	if (restaurant == "") {
		alert("Enter a restaurant name.");
		return
	}	
    restaurantWebsite = $("#createRestaurantSiteBox").val();
	var data;
	if (restaurantWebsite=="") {
		data = "restaurant=" + restaurant + "&restaurantWebsite=0"
	} else {
		data = "restaurant=" + restaurant + "&restaurantWebsite=" + restaurantWebsite
	}
    $.ajax({
        type: "GET",
        url:  'addNewRestaurant/',
        data: data,
        success: function(data) {
			if (data == 4) {
				var aHtml = '<option value="">' + restaurant + '</option>'
				$("#restLastOption").before(aHtml)
				$('#restaurantselector option:selected').prev().attr('selected', 'selected');
				$("#addRestaurantDiv").fadeOut("fast", function() {
				$("#neworderform").show(); 
				})
			} else if (data == -1) {
				alert("Restaurant already available.");
			} else {
				alert("Bad URL given.");
			}			
        }
    });	
}

function cancelCreateRestaurant() {
	$('#restaurantselector option:selected').prev().attr('selected', 'selected');
	$("#addRestaurantDiv").fadeOut("fast", function() {
	$("#neworderform").show(); 
	})
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
	if (newLocation == "") {
		alert("Enter a location name.");
		return
	}	
	data = "newLocation=" + newLocation;
   $.ajax({
        type: "GET",
        url:  'addNewLocation/',
        data: data,
        success: function(data) {
			if (data == 5) {
				var aHtml = '<option value="">' + newLocation + '</option>'
				$("#locationLastOption").before(aHtml)
				$('#locationselector option:selected').prev().attr('selected', 'selected');
				
				$("#addLocationDiv").fadeOut("fast", function() {
				$("#neworderform").show(); 
				})	
			} else {
				alert("Location already available.");
			}
        }
    });	
}

function cancelAddNewLocation() {
	$('#locationselector option:selected').prev().attr('selected', 'selected');
	$("#addLocationDiv").fadeOut("fast", function() {
	$("#neworderform").show(); 
	})		
} 

function joinOrder(oid) {
   $.ajax({
        type: "GET",
        url: "joinOrder/",
        data: "oid=" + oid,
        success: function(data) {
            if (data == -1)
                window.location.reload();
            else if (data == 1)
                alert("To join this order, please cancel yours first.");
			else if (data == -3)
				alert("Sorry! The maximum number of people for this order has been met.");
            else 
                alert("To join this order, please leave " + data + "'s order first.");
        }
    });     
}
