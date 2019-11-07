# Generated by Django 2.2.6 on 2019-10-22 17:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('familytree', '0015_auto_20191016_1849'),
    ]

    operations = [
        migrations.AlterField(
            model_name='familytreeperson',
            name='sex_choices',
            field=models.CharField(choices=[('male', 'male'), ('female', 'female'), ('other', 'other')], default='other', max_length=35),
        ),
        migrations.AlterField(
            model_name='familytreerelationship',
            name='relationships',
            field=models.CharField(choices=[('father', 'father'), ('mother', 'mother'), ('brother/sister', 'brother/sister')], default='father', max_length=35),
        ),
    ]