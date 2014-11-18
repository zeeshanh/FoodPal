from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
import os.path

class DocumentForm(forms.Form):
    title = forms.CharField(max_length=100, required=True)
    docfile = forms.ImageField(
        label=''
    )

	
class MyRegistrationForm (UserCreationForm):

	def __init__(self, *args, **kwargs): 
		super(MyRegistrationForm, self).__init__(*args, **kwargs) 
		self.fields['first_name'].required = True 
		self.fields['last_name'].required = True 
		email = forms.EmailField(required=True)
	class Meta:
		model = User
		fields = ('username', 'email', 'password1', 'password2')		
	def save(self, commit=True):
		user = super(MyRegistrationForm, self).save(commit=False)
		user.email = self.cleaned_data['email']	
		if commit:
			user.save()
		return user