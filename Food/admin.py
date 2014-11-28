from django.contrib import admin
from Food.models import Restaurant
from Food.models import Location
from Food.models import Order
from Food.models import Meal
from Food.models import Notification

# Register your models here.
admin.site.register(Restaurant)
admin.site.register(Location)
admin.site.register(Order)
admin.site.register(Meal)
admin.site.register(Notification)
