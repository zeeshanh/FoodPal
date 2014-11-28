from django.conf.urls import patterns, include, url
from django.conf import settings
from Food import views

urlpatterns = patterns('',
	url(r'^$', views.index, name = 'index'),
	url(r'^logoutv/$', views.logoutv, name='logoutv'),
	url(r'^signup/$', views.register_user, name='signup'),
	url(r'^neworder/$', views.neworder, name='neworder'),
	url(r'^addmeal/$', views.addmeal, name='addmeal'),
	url(r'^removeMeal/$', views.removeMeal, name='removeMeal'),
	url(r'^createNewMeal/$', views.createNewMeal, name='createNewMeal'),
	url(r'^addNewRestaurant/$', views.addNewRestaurant, name='addNewRestaurant'),
	url(r'^addNewLocation/$', views.addNewLocation, name='addNewLocation'),
	url(r'^joinOrder/$', views.joinOrder, name='joinOrder'),
	url(r'^hasOrderArrived/$', views.hasOrderArrived, name='hasOrderArrived'),
	url(r'^orderArrived/$', views.orderArrived, name='orderArrived'),
	url(r'^leaveOrder/$', views.leaveOrder, name='leaveOrder'),
	url(r'^deleteOrder/$', views.deleteOrder, name='deleteOrder'),
)

# Authentication views
urlpatterns += patterns('',
    url(r'^login/$', 'django.contrib.auth.views.login', { 'template_name': 'Food/login.html'}, name='login'),
	#url(r'^logout/$', views.logout, name='logout'),
)