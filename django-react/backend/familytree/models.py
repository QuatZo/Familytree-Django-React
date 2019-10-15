from django.db import models
import datetime


# Create your models here
class Familytree(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title


class FamilytreePerson(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    birth_date = models.CharField(max_length=10, blank=True, default='')
    birth_place = models.CharField(max_length=50, blank=True, default='')
    
    living = 'living'
    deceased = 'deceased'
    unknown = 'unknown'
    
    status_choices = [(living, 'living'),(deceased,'deceased'),(unknown,'unknown')]
    status_choices = models.CharField(max_length = 2,choices = status_choices, default = living)

    male = 'male'
    female = 'female'
    other = 'other'

    sex_choices = [(male, 'male'),(female, 'female'),(other, 'other')]
    sex_choices = models.CharField(max_length = 2,choices = sex_choices, default = other)

    def _str_(self):
        return self.first_name + " " + self.last_name 

class FamilytreeRelationship(models.Model):
    id_1 = models.CharField(max_length=50)
    id_2 = models.CharField(max_length=50)

    male = 'male'
    female = 'female'
    other = 'other'

    relationships = [(male, 'male'),(female, 'female'),(other, 'other')]
    relationships = models.CharField(max_length = 2,choices = relationships, default = other)
