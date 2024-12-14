from django.contrib import admin
from .models import FamilytreePerson, FamilytreeRelationship, FamilytreeMilestone
	
class FamilytreePersonAdmin(admin.ModelAdmin):
	list_display = ('id', 'first_name', 'last_name', 'birth_date', 'death_date', 'status_choices', 'sex_choices', 'birth_place') # fields in Admin Page
	
class FamilytreeRelationshipAdmin(admin.ModelAdmin):
	list_display = ('id', 'id_1', 'id_2', 'relationships', 'color', 'title', 'description', 'begin_date', 'end_date', 'descendant') # fields in Admin Page

class FamilytreeMilestoneAdmin(admin.ModelAdmin):
	list_display = ('id', 'user_id', 'date', 'title', 'text', 'image') # fields in Admin Page

# Register your models here.
admin.site.register(FamilytreePerson, FamilytreePersonAdmin) # Person Admin Page
admin.site.register(FamilytreeRelationship, FamilytreeRelationshipAdmin) # Relationship Admin Page
admin.site.register(FamilytreeMilestone, FamilytreeMilestoneAdmin) # Milestone Admin Page