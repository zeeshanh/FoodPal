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


# Create your views here.
@login_required(login_url='/Food/login/')
def index(request):
	restaurants = Restaurant.objects.all()
	locations = Location.objects.all() 
	orders = Order.objects.all() 
	meals = Meal.objects.all() 
	return render(request,'Food/index.html',{'restaurants': restaurants, 'locations' : locations, 'orders' : orders, 'meals' : meals},
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
	print(restaurant)
	print(location)
	print(timelimit)
	sRestaurant = Restaurant.objects.filter(name = restaurant)[0]
	sLocation = Location.objects.filter(name = location)[0]
	print sRestaurant
	print request.user.username
	newO = Order(timeLimit = int(timelimit),\
				 creator = request.user.username,\
				 location = sLocation,\
				 restaurant = sRestaurant)
	print 'here1'
	print newO
	newO.save()
	print 'here2'
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
		
  		
  