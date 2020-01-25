from familytree.serializers import UserSerializer

# token-auth page, response after POST, JWT handler
def my_jwt_response_handler(token, user=None, request=None):
    return {
        'token': token, # session token
        'user': UserSerializer(user, context={'request': request}).data # user
    }