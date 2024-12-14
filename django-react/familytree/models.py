from django.db import models
from django.contrib.auth.models import User
import datetime
from django.conf import settings
from django.core.validators import FileExtensionValidator

AUTH_USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User') # list of users

class FamilytreePerson(models.Model):
    user_id = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE) # user ID, foreign key
    first_name = models.CharField(max_length=50) # first name
    last_name = models.CharField(max_length=50) # last name
    birth_date = models.CharField(max_length=10, blank=True, default='') # date of birth
    birth_place = models.CharField(max_length=50, blank=True, default='') # place of birth
    death_date = models.CharField(max_length=10, blank=True, default='') # date of death
    avatar = models.ImageField(upload_to='avatars') # avatar (IMAGE)
    
    living = 'living'
    deceased = 'deceased'
    unknown = 'unknown'
    
    status_choices = [(living, 'living'),(deceased,'deceased'),(unknown,'unknown')]
    status_choices = models.CharField(max_length = 35,choices = status_choices, default = living)

    male = 'male'
    female = 'female'
    other = 'other'

    sex_choices = [(male, 'male'),(female, 'female'),(other, 'other')]
    sex_choices = models.CharField(max_length = 35,choices = sex_choices, default = other) # choice

    x = models.FloatField(default=0) # coords ratio: x
    y = models.FloatField(default=0) # coords ratio: y

    def __str__(self):
        return self.first_name + " " + self.last_name 

class FamilytreeRelationship(models.Model):
    user_id = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE) # user ID, foreign key
    id_1 = models.ForeignKey(FamilytreePerson, on_delete=models.CASCADE, related_name="id_1") # 1st person ID
    id_2 = models.ForeignKey(FamilytreePerson, on_delete=models.CASCADE, related_name="id_2") # 2nd person ID
    color = models.CharField(max_length = 7, default='#ffffff') # color of relationship
    title = models.CharField(max_length=64, blank=True, null=True) # title
    description = models.CharField(max_length=512, blank=True) # description, can be blank
    begin_date = models.DateField(default=None, blank=True, null=True) # begin date
    end_date = models.DateField(default=None, blank=True, null=True) # end date, can be blank & null, default = None(Null)
    descendant = models.BooleanField(default=False) # if it's a 2-level relationship

    # one-level relations
    married = 'married'
    divorced = 'divorced'
    fiance = 'fiance'
    sibling = 'sibling'
    step_sibling = 'stepsibling'
    sibling_in_law = 'sibling-in-law'
    cousin = 'cousin'
    
    # two-level relations
    niece_nephew = 'niece/nephew'
    child = 'child'
    adopted_child = 'adopted child'
    
    relationships = [(married, 'married'), (divorced, 'divorced'), (fiance, 'fiance'), (sibling, 'sibling'), (step_sibling, 'stepsibling'), (sibling_in_law, 'sibling-in-law'), (cousin, 'cousin'), (niece_nephew, 'niece/nephew'), (child, 'child'), (adopted_child, 'adopted child')]
    relationships = models.CharField(max_length = 35, choices = relationships, default = married) # choice 

    def __str__(self):
        return self.title + ": " + self.description

class FamilytreeMilestone(models.Model):
    extensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'raw', 'mp4', 'webm', 'wmv', 'avi', 'wav', 'mp3'] # supported media extensions
    user_id = models.ForeignKey(AUTH_USER_MODEL, on_delete=models.CASCADE) # user ID, foreign key
    person_id = models.ManyToManyField(FamilytreePerson) # person ID, n-m field
    date = models.DateField() # Date of milestone (post) field
    text = models.CharField(max_length=512, blank=True) # description, can be blank
    title = models.CharField(max_length=64) # title
    image = models.FileField(upload_to='milestones', validators=[FileExtensionValidator(extensions)]) # media (MUST BE W/ ABOVE EXTENSION)

    def __str__(self):
        return self.title + ": " + self.text