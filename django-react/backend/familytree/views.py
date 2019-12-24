from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView

from .serializers import FamilytreePersonSerializer, FamilytreeRelationshipSerializer, UserSerializer, UserSerializerWithToken, FamilytreeMilestoneSerializer
from .models import FamilytreePerson, FamilytreeRelationship, FamilytreeMilestone


# Get current user
@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# User login/register
class UserList(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# View for Person
class FamilytreePersonView(viewsets.ModelViewSet):
    serializer_class = FamilytreePersonSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        persons = FamilytreePerson.objects.all()
        serializer = FamilytreePersonSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        persons_serializer = FamilytreePersonSerializer(data=request.data)
        if persons_serializer.is_valid():
            persons_serializer.save()
            return Response(persons_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', persons_serializer.errors)
            return Response(persons_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        user = self.request.user
        return FamilytreePerson.objects.filter(user_id=user) # return only people created by (and for) certain user

class FamilytreeRelationshipView(viewsets.ModelViewSet):
    serializer_class = FamilytreeRelationshipSerializer

    def get_queryset(self):
        user = self.request.user
        id_1 = self.request.query_params.get('id_1', None)
        id_2 = self.request.query_params.get('id_2', None)

        if id_1 is not None:
            if id_2 is not None:
                return FamilytreeRelationship.objects.filter(user_id=user, id_1=id_1, id_2=id_2) # return relationship for certain user & pair of people
            return FamilytreeRelationship.objects.filter(user_id=user, id_1=id_1) # return relationship for certain user & certain 1st person
        if id_2 is not None:
            return FamilytreeRelationship.objects.filter(user_id=user, id_2=id_2) # return relationship for certain user & certain 2nd person
        return FamilytreeRelationship.objects.filter(user_id=user) # return relationship for certain user

class FamilytreeMilestoneView(viewsets.ModelViewSet):
    serializer_class = FamilytreeMilestoneSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        milestones = FamilytreeMilestone.objects.all()
        serializer = FamilytreeMilestoneSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        milestones_serializer = FamilytreeMilestoneSerializer(data=request.data)
        if milestones_serializer.is_valid():
            milestones_serializer.save()
            return Response(milestones_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', milestones_serializer.errors)
            return Response(milestones_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    def get_queryset(self):
        person = self.request.query_params.get('person_id', None)
        user = self.request.user
        if person is not None:
            return FamilytreeMilestone.objects.filter(user_id=user, person_id=person) # return milestones only for certain user & person
        return FamilytreeMilestone.objects.filter(user_id=user) # return milestones only for certain user