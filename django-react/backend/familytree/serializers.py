from rest_framework import serializers
from .models import Familytree

class FamilytreeSerializer(serializers.ModelSerializer):
	class Meta:
		model = Familytree
		fields = ('id', 'title', 'description', 'completed')