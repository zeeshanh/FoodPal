from django.conf.urls import patterns, include, url
from django.conf import settings
from Food import views

urlpatterns = patterns('',
	url(r'^$', views.index, name = 'index'),
	url(r'^logoutv/$', views.logoutv, name='logoutv'),
	url(r'^signup/$', views.register_user, name='signup'),
	url(r'^neworder/$', views.neworder, name='neworder'),
)

# Authentication views
urlpatterns += patterns('',
    url(r'^login/$', 'django.contrib.auth.views.login', { 'template_name': 'Food/login.html'}, name='login'),
	#url(r'^logout/$', views.logout, name='logout'),
)