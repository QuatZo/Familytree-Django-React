from django.contrib import admin
from .models import Familytree

class FamilytreeAdmin(admin.ModelAdmin):
	list_display = ('title', 'description', 'completed')

# Register your models here.
admin.site.register(Familytree, FamilytreeAdmin)