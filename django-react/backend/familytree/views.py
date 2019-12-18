from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.models import User

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import FamilytreePersonSerializer, FamilytreeRelationshipSerializer, UserSerializer, UserSerializerWithToken, FamilytreeMilestoneSerializer
from .models import FamilytreePerson, FamilytreeRelationship, FamilytreeMilestone


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

class FamilytreePersonView(viewsets.ModelViewSet):
    serializer_class = FamilytreePersonSerializer

    def get_queryset(self):
        user = self.request.user
        return FamilytreePerson.objects.filter(user_id=user)

class FamilytreeRelationshipView(viewsets.ModelViewSet):
    serializer_class = FamilytreeRelationshipSerializer

    def get_queryset(self):
        user = self.request.user
        id_1 = self.request.query_params.get('id_1', None)
        id_2 = self.request.query_params.get('id_2', None)

        if id_1 is not None:
            if id_2 is not None:
                return FamilytreeRelationship.objects.filter(user_id=user, id_1=id_1, id_2=id_2)
            return FamilytreeRelationship.objects.filter(user_id=user, id_1=id_1)
        if id_2 is not None:
            return FamilytreeRelationship.objects.filter(user_id=user, id_2=id_2)
        return FamilytreeRelationship.objects.filter(user_id=user)

class FamilytreeMilestoneView(viewsets.ModelViewSet):
    serializer_class = FamilytreeMilestoneSerializer

    def get_queryset(self):
        person = self.request.query_params.get('person_id', None)
        user = self.request.user
        if person is not None:
            return FamilytreeMilestone.objects.filter(user_id=user, person_id=person)
        return FamilytreeMilestone.objects.filter(user_id=user)