from rest_framework import serializers
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.models import User
from .models import Familytree, FamilytreePerson, FamilytreeRelationship


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
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

class FamilytreeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Familytree
        fields = ('id', 'user_id', 'person', 'description', 'relationship')


class FamilytreePersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilytreePerson
        fields = ('id', 'user_id', 'first_name', 'last_name', 'birth_date', 'status_choices', 'sex_choices', 'birth_place', 'x', 'y')

class FamilytreeRelationshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilytreeRelationship
        fields = ('id', 'user_id', 'id_1', 'id_2', 'relationships')
