from django.db import models


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
    birth_date = models.DateField(auto_now=True)
    
    living = 'living'
    deceased = 'deceased'
    unknown = 'unknown'
    
    status_choices = [(living, 'living'),(deceased,'deceased'),(unknown,'unknown')]
    
    status_choices = models.CharField(max_length = 2,choices = status_choices, default = living)

    def _str_(self):
        return self.first_name + " " + self.last_name
    
    def has_date_of_dead(self):
        return self.status_of_life in (self.status_choices)
