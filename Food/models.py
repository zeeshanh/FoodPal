from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Restaurant(models.Model):
	name = models.CharField(max_length=200)
	webpage = models.CharField(max_length=200,null=True)
	def __unicode__(self):
		return self.name
		
		
class Location(models.Model):
	name = models.CharField(max_length =200)
	lat = models.FloatField(default = 0)
	lon = models.FloatField(default = 0)
	def __unicode__(self):
		return self.name

	
class Order(models.Model):
	date_created = models.DateTimeField(default=timezone.now)
	timeLimit = models.IntegerField()
	restaurant = models.ForeignKey(Restaurant, unique = False)
	creator = models.ForeignKey(User,  related_name = "ordercreator") 
	peopleLimit = models.IntegerField(default = 0)
	dineIn = models.BooleanField(default = False)
	status = models.IntegerField(default = -1)
	location = models.ForeignKey(Location, unique = False) 
	people_joined = models.ManyToManyField(User, null=True) 
	def __unicode__(self):
		return unicode(self.creator) + " from " + unicode(self.restaurant)

class Meal(models.Model):
	name = models.CharField(max_length = 150)
	price = models.IntegerField(default = 0)
	count = models.IntegerField(default = 0)
	restaurant = models.ForeignKey(Restaurant, unique=False)
	order = models.ForeignKey(Order, null=True,unique = False)
	owner = models.ForeignKey(User, null=True, unique = False)
	def __unicode__(self):
		return self.name
 
 #status 
 #1: orderArrived
 #2: joinedOrder
 #3: mealAdded
 #4: new order created
 #-3:left order
 #-2: order cancelled
 #-4: removed meal
class Notification(models.Model):
	user = models.ForeignKey(User, unique = False)
	status = models.IntegerField(default =0)
	from_user = models.CharField(max_length = 200)

