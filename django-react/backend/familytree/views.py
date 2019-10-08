from django.shortcuts import render

from rest_framework import viewsets        
from .serializers import FamilytreeSerializer 
from .models import Familytree    

class FamilytreeView(viewsets.ModelViewSet):
	serializer_class = FamilytreeSerializer
	queryset = Familytree.objects.all()