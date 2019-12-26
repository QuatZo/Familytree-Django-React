from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from .models import FamilytreePerson, FamilytreeRelationship, FamilytreeMilestone


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'date_joined')

class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj): # use token
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('token', 'username', 'password')

class FamilytreePersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilytreePerson
        fields = '__all__' # all fields for Person model

class FamilytreeRelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilytreeRelationship
        fields = '__all__' # all fields for Relationship model

class FamilytreeMilestoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilytreeMilestone
        fields = '__all__' # all fields for Milestone model