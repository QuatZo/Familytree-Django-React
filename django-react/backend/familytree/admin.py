from django.contrib import admin
from .models import Familytree, FamilytreePerson, FamilytreeRelationship

class FamilytreeAdmin(admin.ModelAdmin):
	list_display = ('get_persons', 'description', 'get_relationships')
	
class FamilytreePersonAdmin(admin.ModelAdmin):
	list_display = ('first_name', 'last_name', 'birth_date', 'status_choices', 'sex_choices', 'birth_place')
	
class FamilytreeRelationshipAdmin(admin.ModelAdmin):
	list_display: ('id_1', 'id_2', 'relationships')

# Register your models here.
admin.site.register(Familytree, FamilytreeAdmin)
admin.site.register(FamilytreePerson, FamilytreePersonAdmin)
admin.site.register(FamilytreeRelationship, FamilytreeRelationshipAdmin)