# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Food', '0003_auto_20141106_1621'),
    ]

    operations = [
        migrations.AlterField(
            model_name='restaurant',
            name='webpage',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
