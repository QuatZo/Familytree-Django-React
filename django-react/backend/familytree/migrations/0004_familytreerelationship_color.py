# Generated by Django 2.2.7 on 2019-12-09 18:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('familytree', '0003_familytreemilestone'),
    ]

    operations = [
        migrations.AddField(
            model_name='familytreerelationship',
            name='color',
            field=models.CharField(default='#ffffff', max_length=7),
        ),
    ]
