# Generated by Django 2.2.6 on 2019-10-15 12:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('familytree', '0010_auto_20191014_1628'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='familytreeperson',
            name='birthplace',
        ),
        migrations.AddField(
            model_name='familytreeperson',
            name='birth_place',
            field=models.CharField(default='', max_length=50),
            preserve_default=False,
        ),
    ]
