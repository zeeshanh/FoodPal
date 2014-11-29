from django import template

register = template.Library()


@register.filter
def subtract(value, arg):
	if (value.encode('utf-8').strip().find("hour") > -1):
		a = int(value.split()[0])*60+int(value.split()[2])
		return ((a - arg)>0) 
	else:
		return ((int(value.split()[0]) - arg)>0)
		