"""
Django settings for foodpal project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '3u@^cmzqp+k*!v&%@@86gwb7ljm8wh5!95+sjtw)c&t^j_no_d'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
ONHEROKU = True

TEMPLATE_DEBUG = True

if 'ONHEROKU' in os.environ:
    DEBUG = True
    TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'Food',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'foodpal.urls'

WSGI_APPLICATION = 'foodpal.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
    # import dj_database_url
# DATABASES['default'] =  dj_database_url.config(default='postgres://ocpskwprokiwbr:UJUx7I2DmFZ5n-UK-vtM05AI8X@ec2-54-243-245-159.compute-1.amazonaws.com:5432/d7neegr45k0nk5')

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/
 
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True
 
USE_TZ = True  

# Parse database configuration from $DATABASE_URL
# Parse database configuration from $DATABASE_URL
if 'ONHEROKU' in os.environ:
    import dj_database_url
    DATABASES['default'] =   dj_database_url.config(default='postgres://ocpskwprokiwbr:UJUx7I2DmFZ5n-UK-vtM05AI8X@ec2-54-243-245-159.compute-1.amazonaws.com:5432/d7neegr45k0nk5')

SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

ALLOWED_HOSTS = ['*']
	
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_ROOT = 'staticfiles'
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)

LOGIN_REDIRECT_URL = '/Food/'