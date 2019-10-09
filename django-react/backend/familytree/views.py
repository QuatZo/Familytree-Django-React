from django.shortcuts import render

from rest_framework import viewsets
from .serializers import FamilytreeSerializer, FamilytreePersonSerializer
from .models import Familytree, FamilytreePerson


class FamilytreeView(viewsets.ModelViewSet):
    serializer_class = FamilytreeSerializer
    queryset = Familytree.objects.all()


class FamilytreePersonView(viewsets.ModelViewSet):
    serializer_class = FamilytreePersonSerializer
    queryset = FamilytreePerson.objects.all()
