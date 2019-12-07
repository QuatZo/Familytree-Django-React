# Generated by Django 2.2.7 on 2019-12-07 13:02

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('familytree', '0002_familytreeperson_avatar'),
    ]

    operations = [
        migrations.CreateModel(
            name='FamilytreeMilestone',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('text', models.CharField(max_length=512)),
                ('title', models.CharField(max_length=32)),
                ('image', models.CharField(default='/media/milestones/default.jpg', max_length=200)),
                ('person_id', models.ManyToManyField(to='familytree.FamilytreePerson')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
