from django.db import models
from django.contrib.auth.models import User
import datetime
from django.conf import settings

AUTH_USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')

# Create your models here

class FamilytreePerson(models.Model):
    user_id = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    birth_date = models.CharField(max_length=10, blank=True, default='')
    birth_place = models.CharField(max_length=50, blank=True, default='')
    avatar = models.CharField(max_length=200, default='/media/avatars/0.png')
    
    living = 'living'
    deceased = 'deceased'
    unknown = 'unknown'
    
    status_choices = [(living, 'living'),(deceased,'deceased'),(unknown,'unknown')]
    status_choices = models.CharField(max_length = 35,choices = status_choices, default = living)

    male = 'male'
    female = 'female'
    other = 'other'

    sex_choices = [(male, 'male'),(female, 'female'),(other, 'other')]
    sex_choices = models.CharField(max_length = 35,choices = sex_choices, default = other)

    x = models.FloatField(default=0)
    y = models.FloatField(default=0)

    def _str_(self):
        return self.first_name + " " + self.last_name 

class FamilytreeRelationship(models.Model):
    user_id = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE)
    id_1 = models.ForeignKey(FamilytreePerson, on_delete=models.CASCADE, related_name="id_1")
    id_2 = models.ForeignKey(FamilytreePerson, on_delete=models.CASCADE, related_name="id_2")

    father = 'father'
    mother = 'mother'
    brother = 'brother'
    sister = 'sister'
    son = 'son'
    daughter = 'daughter'
    adoptive_son = 'adoptive son'
    adoptive_daughter = 'adoptive daughter'
    surrogate_father = 'surrogate father'
    surrogate_mother = 'surrogate mother'
    stepbrother = 'stepbrother'
    stepsister = 'stepsister'
    stepdaughter = 'stepdaughter'
    stepson = 'stepson'

    relationships = [(father, 'father'),(mother, 'mother'),(brother, 'brother'),(sister, 'sister'), (son, 'son'), (daughter, 'daughter'), (adoptive_son, 'adoptive son'), (adoptive_daughter, 'adoptive daughter'), (surrogate_father, 'surrogate father'), (surrogate_mother, 'surrogate mother'), (stepbrother, 'stepbrother'), (stepsister,'stepsister'), (stepdaughter, 'stepdaughter'), (stepson, 'stepson')]
    relationships = models.CharField(max_length = 35,choices = relationships, default = father)

    def _str_(self):
        return self.relationships