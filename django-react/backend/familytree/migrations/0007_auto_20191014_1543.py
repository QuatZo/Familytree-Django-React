# Generated by Django 2.2.6 on 2019-10-14 13:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('familytree', '0006_auto_20191012_1405'),
    ]

    operations = [
        migrations.AlterField(
            model_name='familytreeperson',
            name='status_choices',
            field=models.CharField(choices=[('living', 'living'), ('deceased', 'deceased'), ('unknown', 'unknown')], default='living', max_length=2),
        ),
    ]