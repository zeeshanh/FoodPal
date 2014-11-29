import datetime

from django import template
from django.utils.translation import ugettext, ungettext

register = template.Library()


@register.filter
def subtract(value, arg):
	if (value.encode('utf-8').strip().find("hour") > -1):
		a = int(value.split()[0])*60+int(value.split()[2])
		return ((a - arg)>0) 
	else:
		return ((int(value.split()[0]) - arg)>0)
	

@register.filter(name='timesince_human')
def humanize_timesince(date):
    naive = date.replace(tzinfo=None)
    delta = datetime.datetime.utcnow() - naive  
   
    return ungettext(u"%d", u"%d",  delta.total_seconds()) %  delta.total_seconds()
	
@register.filter
def canJoin(value, arg):
	if value < arg:
		return 0
	else:
		return 1
	
 