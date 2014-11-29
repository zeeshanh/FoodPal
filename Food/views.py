from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from Food.forms import DocumentForm
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.contrib.auth.decorators import permission_required
from django.shortcuts import redirect
from django.utils.html import strip_tags
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.template import RequestContext
from django.core.exceptions import PermissionDenied
from django.shortcuts import render_to_response
from django.contrib import messages
from forms import MyRegistrationForm
from django.contrib.auth.forms import UserCreationForm
from django.core.context_processors import csrf
from django.utils import timezone
from django.core.validators import URLValidator
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.utils.html import strip_tags
import json

from Food.models import Restaurant
from Food.models import Location
from Food.models import Order
from Food.models import Meal
from Food.models import Notification


@login_required(login_url='login/')
def index(request):
	sUser = request.user
	expired_Notifications = Notification.objects.filter(user=sUser, status=4)
	for notification in expired_Notifications:
		notification.delete()
	restaurants = Restaurant.objects.all()
	locations = Location.objects.all() 
	orders = Order.objects.all().order_by('-date_created')
	meals = Meal.objects.filter(order = None)
	return render(request,'Food/index.html',{'restaurants': restaurants, 'locations' : locations, 'orders' : orders, 'meals' : meals, 'openo': 0, 't': timezone.now},
					context_instance=RequestContext(request))
			
			
@login_required(login_url='login/')
def logoutv(request):
	logout(request)
	return redirect('index')
	
def register_user(request):
	if request.method == 'POST':
		form = UserCreationForm(request.POST) 
		if form.is_valid():
			form.save()
			return HttpResponseRedirect(reverse('index'))
	args = {}
	args.update(csrf(request))
	args['form'] = UserCreationForm()
	return render_to_response('Food/signup.html', args)	

def neworder(request):
	peopleLimit= request.GET['peopleLimit']
	restaurant= request.GET['restaurant']
	location= request.GET['location']
	timelimit= request.GET['timelimit']
	sRestaurant = Restaurant.objects.filter(name = restaurant)[0]
	sUser = User.objects.filter(username = request.user.username)[0]
	sLocation = Location.objects.filter(name = location)[0]
	if int(peopleLimit) > 0:
		isDineOut = True
	else:
		isDineOut = False
	# print(Order.objects.filter(restaurant = sRestaurant, location = sLocation, status__lte = 0, dineIn = isDineOut).count())
	if (Order.objects.filter(creator = sUser, status__lte = 0).count() > 0):
		return HttpResponse(-1) 

	elif (Order.objects.filter(restaurant = sRestaurant, location = sLocation, status__lte = 0, dineIn = isDineOut).count() > 0):
		userOpened = Order.objects.filter(restaurant = sRestaurant, location = sLocation, status__lte = 0, dineIn = isDineOut)[0].creator.username
		return HttpResponse(userOpened) 
	
	elif (Order.objects.filter(people_joined__username__contains = sUser.username, status__lte = 0).count() > 0):
		userOpened = Order.objects.filter(people_joined__username__contains = sUser.username, status__lte = 0)[0].creator.username
		return HttpResponse("9" + userOpened) 
	
	if peopleLimit == "0":
		newO = Order(timeLimit = int(strip_tags(timelimit)),\
				 creator = sUser,\
				 location = sLocation,\
				 restaurant = sRestaurant)
	else:
		newO = Order(timeLimit = int(strip_tags(timelimit)),\
				 creator = sUser,\
				 dineIn = True,\
				 peopleLimit = peopleLimit,\
				 location = sLocation,\
				 restaurant = sRestaurant)
	newO.save()
	newO.people_joined.add(sUser)

	people = User.objects.all()
	for person in people:
		if person.username != sUser.username:
			n = Notification(user = person, status = 4, from_user = sUser.username)
			n.save()
	# print 'here2'
	return HttpResponse(1) 
	
def newdineout(request):
	restaurant= request.GET['restaurant']
	location= request.GET['location']
	timelimit= request.GET['timelimit']
	maxpeople = request.GET['people']

	sRestaurant = Restaurant.objects.filter(name = restaurant)[0]
	sLocation = Location.objects.filter(name = location)[0]
	print sRestaurant
	print request.user.username
	newO = Order(timeLimit = int(timelimit),\
				 creator = request.user.username,\
				 peopleLimit = int(maxpeople),\
				 dineIn = True,\
				 location = sLocation,\
				 restaurant = sRestaurant)
	print 'here1'
	print newO
	newO.save()
	print 'here2'
	return HttpResponse(1) 
	
def addmeal(request):
	mealName = request.GET['mealName']
	count = request.GET['count']
	userM = request.GET['userM']
	print "USER: " 
	sUser = User.objects.filter(username = userM)[0]
	oid = request.GET['oid']
	order = Order.objects.filter(pk = oid)[0]
	if ((Meal.objects.filter(name = mealName, count__gte = 1, owner = sUser, order = order).count()) > 0):
		print "ALREADY HERE\n"
		meal = Meal.objects.filter(name = mealName, count__gte = 1, owner = sUser, order = order)[0]
		meal.count = meal.count + int(count);
		print "NEW COUNT" 
		print meal.count
		meal.save()
		return HttpResponse(Meal.objects.filter(name = mealName, count__gte = 1, owner = sUser, order = order)[0].id) 
	mealPrice = Meal.objects.filter(name = mealName)[0].price
	print "MEAL PRICE"
	print mealPrice
	newM = Meal(name = mealName, count = int(count), price = mealPrice, restaurant = order.restaurant, order = order, owner = sUser) 
	newM.save()
	if order.creator.username!= sUser.username:
		n = Notification(user = order.creator, status=3, from_user=sUser.username)
		n.save()
	print newM.id
	return HttpResponse(newM.id) 	
  		
def removeMeal(request):
	mID = request.GET['mealID']
	m = Meal.objects.filter(id = mID)[0]
	order = m.order
	creator = order.creator
	if m.owner != request.user:
		return HttpResponse("Bad request!")
	elif m.order.status != -1:
		return HttpResponse("Bad request!")
	m.delete()
	if order.creator.username!= suSer.username:
		n = Notification(user = creator, status = -4, from_user = "")
		n.save()
	return HttpResponse(1)

def createNewMeal(request):
	mealName = request.GET['mealName']
	restaurant = request.GET['restaurant']
	mealPrice = request.GET['mealPrice']
	sRestaurant = Restaurant.objects.filter(name = restaurant)[0]
	if (Meal.objects.filter(name = strip_tags(mealName), restaurant = sRestaurant).count() > 0):
		return HttpResponse(-1)
	newM = Meal(name = mealName, price = int(strip_tags(mealPrice)), restaurant = sRestaurant) 
	newM.save()	
	return HttpResponse(3) 
	
def addNewRestaurant(request):
	validate = URLValidator()
	restaurant = request.GET['restaurant']
	restaurantWebsite = request.GET['restaurantWebsite']
	if (Restaurant.objects.filter(name = restaurant).count() > 0):
		return HttpResponse(-1)

	if (restaurantWebsite == "0"):
		newR = Restaurant(name = strip_tags(restaurant), webpage = None)
	else:
		try:
			validate(restaurantWebsite)
		except ValidationError, e:
			return HttpResponse(-2)
		newR = Restaurant(name = restaurant, webpage = restaurantWebsite)
	newR.save()
	return HttpResponse(4)
	
def addNewLocation(request):
	newLocation = request.GET['newLocation']
	if (Location.objects.filter(name = strip_tags(newLocation)).count() > 0):
		return HttpResponse(-1)
	
	newL = Location(name = newLocation)
	newL.save()
	return HttpResponse(5)

def joinOrder(request):
	oid = request.GET['oid']
	sUser = User.objects.filter(username = request.user.username)[0]

	# Already in another order or has created an order
	if (Order.objects.filter(people_joined__username__contains = sUser.username, status__lte = 0).count() > 0):
		order = Order.objects.filter(people_joined__username__contains = sUser.username, status__lte = 0)[0]
		if order.creator == request.user:
			return HttpResponse(1)
		else:
			return HttpResponse(order.creator)
	order = Order.objects.filter(pk = oid)[0]
	if order.people_joined.count() >= order.peopleLimit:
		return HttpResponse(-3)
	if (order.status >= 0):
		return HttpResponse("Bad request!")
	n = Notification(user = order.creator, status = 2, from_user = sUser.username)
	n.save()
	order.people_joined.add(sUser)
	return HttpResponse(-1)

def hasOrderArrived(request):
    sUser = User.objects.filter(username = request.user.username)[0]
    order = Order.objects.filter(people_joined__username__contains = sUser.username).order_by('-date_created')
    notifications = Notification.objects.filter(user = sUser)
    if len(notifications) == 0:
    	return HttpResponse(-1);
    else:
    	response = ""
    	status = notifications[0].status
    	from_user = notifications[0].from_user
    	notifications[0].delete()
    	response = response + str(status) 
    	response = response + "," + from_user 
    	if (order.count()>0):
            response = response + "," + str(order[0].id)
    	return HttpResponse(response)

#delete all meals
def leaveOrder(request):
	oid = request.GET['oid']
	order = Order.objects.filter(pk = oid)[0]
	allMealsCount = Meal.objects.filter(order = order, owner = request.user).count()
	for i in range(0, allMealsCount):
		meal = Meal.objects.filter(order = order, owner = request.user)[i]
		meal.delete()	
	sUser = User.objects.filter(username = request.user.username)[0]
	order.people_joined.remove(sUser)
	creator = order.creator
	n = Notification(user = creator, status = -3, from_user = sUser.username)
	n.save()
	return redirect('index')
	
# recurse and delete all associated meals
def deleteOrder(request):
	oid = request.GET['oid']
	if  Order.objects.filter(pk = oid).count() == 0:
		return HttpResponse("Bad request; order doesn't exist!")
	order = Order.objects.filter(pk = oid)[0]
	if order.creator != request.user:
		return HttpResponse("Bad request!")
	elif order.status == 1:
		return HttpResponse("Cannot delete an old order!")
	elif order.status == 0:
		return HttpResponse("Cannot delete an older that's on the way!")
	order.status = -2
	order.save()
	people = order.people_joined.all()
	for person in people:
		if person != order.creator:
			n = Notification(user = person, status = order.status, from_user = order.creator.username)
			n.save()
	allMealsCount = Meal.objects.filter(order = order).count()
	for i in range(0, allMealsCount):
		meal = Meal.objects.filter(order = order)[i]
		meal.delete()
	order.delete()
	return redirect('index')
	
		
def orderArrived(request):
	print "here"
	orderId = request.GET['data']
	order = Order.objects.filter(pk = orderId)
	order = order[0]
	order.status = 1
	order.save()
	people = order.people_joined.all()
	for person in people:
		if person.username != order.creator.username:
			n = Notification(user = person, status = order.status, from_user = order.creator.username)
			n.save()
	return HttpResponse(1)
	
def orderTimeUp(request):
	oid = request.GET['oid']
	order = Order.objects.filter(pk = oid)[0]
	if order.status == 1:
	    return HttpResponse(1)
	if order.dineIn:
		order.status = 1
	else:
		order.status = 0
	order.save()
	return HttpResponse(1)

def isPartOfOrder(request):
	oid = request.GET['oid']
	order = Order.objects.filter(pk = oid)[0]
	username = request.GET['username']
	people = order.people_joined.all()
	for person in people:
		if person.username == username:
			return HttpResponse(1)
	return HttpResponse(-1)
