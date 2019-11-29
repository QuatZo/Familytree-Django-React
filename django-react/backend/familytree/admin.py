from django.contrib import admin
from .models import FamilytreePerson, FamilytreeRelationship
	
class FamilytreePersonAdmin(admin.ModelAdmin):
	list_display = ('first_name', 'last_name', 'birth_date', 'status_choices', 'sex_choices', 'birth_place')
	
class FamilytreeRelationshipAdmin(admin.ModelAdmin):
	list_display: ('id_1', 'id_2', 'relationships')

# Register your models here.
admin.site.register(FamilytreePerson, FamilytreePersonAdmin)
admin.site.register(FamilytreeRelationship, FamilytreeRelationshipAdmin)