from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import FamilytreeSerializer, FamilytreePersonSerializer, FamilytreeRelationshipSerializer, UserSerializer, UserSerializerWithToken
from .models import Familytree, FamilytreePerson, FamilytreeRelationship


@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserList(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class FamilytreeView(viewsets.ModelViewSet):
    serializer_class = FamilytreeSerializer
    queryset = Familytree.objects.all()

    def get_queryset(self):
        user = self.request.user
        return Familytree.objects.filter(user_id=user)


class FamilytreePersonView(viewsets.ModelViewSet):
    serializer_class = FamilytreePersonSerializer
    queryset = FamilytreePerson.objects.all()

    def get_queryset(self):
        user = self.request.user
        return FamilytreePerson.objects.filter(user_id=user)

class FamilytreeRelationshipView(viewsets.ModelViewSet):
    serializer_class = FamilytreeRelationshipSerializer
    queryset = FamilytreeRelationship.objects.all()

    def get_queryset(self):
        user = self.request.user
        return FamilytreeRelationship.objects.filter(user_id=user)