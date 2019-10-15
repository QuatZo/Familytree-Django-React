from django.shortcuts import render

from rest_framework import viewsets
from .serializers import FamilytreeSerializer, FamilytreePersonSerializer, FamilytreeRelationshipSerializer
from .models import Familytree, FamilytreePerson, FamilytreeRelationship


class FamilytreeView(viewsets.ModelViewSet):
    serializer_class = FamilytreeSerializer
    queryset = Familytree.objects.all()


class FamilytreePersonView(viewsets.ModelViewSet):
    serializer_class = FamilytreePersonSerializer
    queryset = FamilytreePerson.objects.all()

class FamilytreeRelationshipView(viewsets.ModelViewSet):
    serializer_class = FamilytreeRelationshipSerializer
    queryset = FamilytreeRelationship.objects.all()