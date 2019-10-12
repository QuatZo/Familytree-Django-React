from rest_framework import serializers
from .models import Familytree, FamilytreePerson


class FamilytreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Familytree
        fields = ('id', 'title', 'description', 'completed')


class FamilytreePersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilytreePerson
        fields = ('id', 'first_name', 'last_name', 'birth_date', 'status_choices')
