# Generated by Django 2.2.6 on 2019-10-09 18:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('familytree', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FamilytreePerson',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('birth_date', models.DateField(auto_now=True)),
            ],
        ),
    ]
