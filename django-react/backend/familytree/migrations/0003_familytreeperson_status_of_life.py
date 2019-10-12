# Generated by Django 2.2.6 on 2019-10-11 15:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('familytree', '0002_familytreeperson'),
    ]

    operations = [
        migrations.AddField(
            model_name='familytreeperson',
            name='status_of_life',
            field=models.CharField(choices=[('LIV', 'Living'), ('DEAD', 'Deceased'), ('UN', 'Unknown')], default='LIV', max_length=2),
        ),
    ]