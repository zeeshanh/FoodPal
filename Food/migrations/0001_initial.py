# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('lat', models.FloatField(default=0)),
                ('lon', models.FloatField(default=0)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Meal',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('price', models.IntegerField(default=0)),
                ('count', models.IntegerField(default=0)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_created', models.DateTimeField(default=django.utils.timezone.now)),
                ('timeLimit', models.IntegerField()),
                ('peopleLimit', models.IntegerField(default=0)),
                ('dineIn', models.BooleanField(default=False)),
                ('status', models.IntegerField(default=-1)),
                ('creator', models.ForeignKey(related_name=b'ordercreator', to=settings.AUTH_USER_MODEL)),
                ('location', models.OneToOneField(to='Food.Location')),
                ('people_joined', models.ManyToManyField(to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=200)),
                ('webpage', models.CharField(max_length=200)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='order',
            name='restaurant',
            field=models.ForeignKey(to='Food.Restaurant'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='meal',
            name='order',
            field=models.ForeignKey(to='Food.Order', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='meal',
            name='restaurant',
            field=models.OneToOneField(to='Food.Restaurant'),
            preserve_default=True,
        ),
    ]
