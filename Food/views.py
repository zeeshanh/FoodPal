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
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from django.template import RequestContext
from django.core.exceptions import PermissionDenied
from django.shortcuts import render_to_response
from django.contrib import messages
from forms import MyRegistrationForm
from django.contrib.auth.forms import UserCreationForm
from django.core.context_processors import csrf
import json
from django.utils import timezone


from Food.models import Restaurant
from Food.models import Location
from Food.models import Order
from Food.models import Meal
from Food.models import Notification


# Create your views here.
@login_required(login_url='/Food/login/')
def index(request):
	restaurants = Restaurant.objects.all()
	locations = Location.objects.all() 
	orders = Order.objects.all() 
	meals = Meal.objects.filter(order = None)
	return render(request,'Food/index.html',{'restaurants': restaurants, 'locations' : locations, 'orders' : orders, 'meals' : meals, 'openo': 0, 't': timezone.now},
					context_instance=RequestContext(request))
			
			
@login_required(login_url='/Food/login/')
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
	restaurant= request.GET['restaurant']
	location= request.GET['location']
	timelimit= request.GET['timelimit']
	sRestaurant = Restaurant.objects.filter(name = restaurant)[0]
	sUser = User.objects.filter(username = request.user.username)[0]
	sLocation = Location.objects.filter(name = location)[0]
	if (Order.objects.filter(creator = sUser).count() > 0):
		print "sads"
		return HttpResponse(-1) 
	elif (Order.objects.filter(restaurant = sRestaurant, location = sLocation).count() > 0):
		userOpened = Order.objects.filter(restaurant = sRestaurant, location = sLocation)[0].creator.username
		return HttpResponse(userOpened) 
	elif (Order.objects.filter(people_joined__username__contains = sUser.username).count() > 0):
		userOpened = Order.objects.filter(people_joined__username__contains = sUser.username)[0].creator.username
		return HttpResponse("9" + userOpened) 
	print sRestaurant
	print request.user.username
	newO = Order(timeLimit = int(timelimit),\
				 creator = sUser,\
				 location = sLocation,\
				 restaurant = sRestaurant)
	print 'here1'
	print newO
	newO.save()
	newO.people_joined.add(sUser)
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
	if ((Meal.objects.filter(name = mealName, count__gte = 1, owner = sUser).count()) > 0):
		print "ALREADY HERE\n"
		meal = Meal.objects.filter(name = mealName, count__gte = 1)[0]
		meal.count = meal.count + int(count);
		print "NEW COUNT" 
		print meal.count
		meal.save()
		return HttpResponse(Meal.objects.filter(name = mealName, count__gte = 1)[0].id) 
	mealPrice = Meal.objects.filter(name = mealName)[0].price
	print "MEAL PRICE"
	print mealPrice
	newM = Meal(name = mealName, count = int(count), price = mealPrice, restaurant = order.restaurant, order = order, owner = sUser) 
	newM.save()
	print newM.id
	return HttpResponse(newM.id) 

	
  		
def removeMeal(request):
	mID = request.GET['mealID']
	Meal.objects.filter(id = mID)[0].delete()
	return HttpResponse(1)

def createNewMeal(request):
	mealName = request.GET['mealName']
	restaurant = request.GET['restaurant']
	mealPrice = request.GET['mealPrice']
	sRestaurant = Restaurant.objects.filter(name = restaurant)[0]
	if (Meal.objects.filter(name = mealName, restaurant = sRestaurant).count() > 0):
		return HttpResponse(-1)
	newM = Meal(name = mealName, price = int(mealPrice), restaurant = sRestaurant) 
	newM.save()	
	return HttpResponse(3) 
	
def addNewRestaurant(request):
	restaurant = request.GET['restaurant']
	restaurantWebsite = request.GET['restaurantWebsite']
	if (Restaurant.objects.filter(name = restaurant).count() > 0):
		return HttpResponse(-1)

	if (restaurantWebsite == "0"):
		newR = Restaurant(name = restaurant, webpage = None)
	else:
		newR = Restaurant(name = restaurant, webpage = restaurantWebsite)
	newR.save()
	return HttpResponse(4)
	
def addNewLocation(request):
	newLocation = request.GET['newLocation']
	if (Location.objects.filter(name = newLocation).count() > 0):
		return HttpResponse(-1)
	
	newL = Location(name = newLocation)
	newL.save()
	return HttpResponse(5)

def joinOrder(request):
	oid = request.GET['oid']
	sUser = User.objects.filter(username = request.user.username)[0]
	# for (i = 0; i < Order.objects.all().count())
	
		# if (Order.objects.all()[i].people_joined.filter
	if (Order.objects.filter(people_joined__username__contains = sUser.username).count() > 0):
		return HttpResponse(-1)
	order = Order.objects.filter(pk = oid)[0]
	
	order.people_joined.add(sUser)
	return redirect('index')

def hasOrderArrived(request):
    sUser = User.objects.filter(username = request.user.username)[0]
    print sUser
    notifications = Notification.objects.filter(user = sUser)
    if len(notifications) == 0:
    	return HttpResponse(-1);
    else:
    	status = notifications[0].status
    	notifications[0].delete()
    	return HttpResponse(status)
		
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
	return redirect('index')
	
# recurse and delete all associated meals and people_joined
def deleteOrder(request):
	oid = request.GET['oid']
	order = Order.objects.filter(pk = oid)[0]
	order.status = -2
	order.save()
	people = order.people_joined.all()
	for person in people:
		n = Notification(user = person, status = order.status)
		n.save()
	allMealsCount = Meal.objects.filter(order = order).count()
	print "COunt " + str(allMealsCount)
	people = order.people_joined.count()
	for i in range(0, allMealsCount):
		print i
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
		n = Notification(user = person, status = order.status)
		n.save()
	return HttpResponse(1)