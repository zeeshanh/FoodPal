from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.
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
	restaurant = models.ForeignKey(Restaurant)
	creator = models.ForeignKey(User,  related_name = "ordercreator") 
	peopleLimit = models.IntegerField(default = 0)
	dineIn = models.BooleanField(default = False)
	status = models.IntegerField(default = -1)
	location = models.OneToOneField(Location) 
	people_joined = models.ManyToManyField(User, null=True) 
	def __unicode__(self):
		return unicode(self.creator) + " from " + unicode(self.restaurant)

		 	 

class Meal(models.Model):
	name = models.CharField(max_length = 100)
	price = models.IntegerField(default = 0)
	count = models.IntegerField(default = 0)
	restaurant = models.ForeignKey(Restaurant)
	order = models.ForeignKey(Order, null=True)
	owner = models.ForeignKey(User, null=True)
	def __unicode__(self):
		return self.name
