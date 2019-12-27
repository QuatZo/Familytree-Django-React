import mock
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.core.files import File
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings
from django.conf.urls.static import static

#region CONST
FILE_MOCK = mock.MagicMock(spec=File, name='FileMock')
USERNAME = 'QuatZo'
PASSWORD = 'unittest'

PERFECT_PERSON_DATA={
    'first_name': 'Quat',
    'last_name': 'Zo',
    'birth_date': '2019-09-07',
    'birth_place': 'Poland',
    'status_choices': 'living',
    'sex_choices': 'male',
    'x': 0.33,
    'y': 0.66,
}

MINIMUM_PERSON_DATA={
    'first_name': 'Quat',
    'last_name': 'Zo',
    'birth_date': '',
    'birth_place': '',
    'status_choices': '',
    'sex_choices': '',
    'x': '',
    'y': '',
}
#endregion

# Create your tests here.
# GET requests
class GetTest(APITestCase):
    # set up User data
    def setUp(self):
        self.data={
            'username': USERNAME,
            'password': PASSWORD,
        }

    # function that is used to pass the JWT Authorization, used in every other test
    # it tests registering of new account as well
    def pass_authorization(self):
        url = reverse('token-auth')
        user = User.objects.create_user(username=USERNAME, password=PASSWORD)
        self.assertEqual(user.is_active, 1, 'Active User')

        response = self.client.post(url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
        token = response.data['token']

        return user, token

    # test authorization (login)
    def test_current_user(self):
        url = reverse('token-auth')
        user, token = self.pass_authorization()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.get(reverse('current_user'), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)

    # test GET for person list
    def test_get_person_list(self):
        url = reverse('token-auth')
        user, token = self.pass_authorization()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.get(reverse('api:familytreeperson-list'), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)

    # test GET for relationship list
    def test_get_relationship_list(self):
        url = reverse('token-auth')
        user, token = self.pass_authorization()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.get(reverse('api:familytreerelationship-list'), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)

    # test GET for milestone list
    def test_get_milestone_list(self):
        url = reverse('token-auth')
        user, token = self.pass_authorization()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.get(reverse('api:familytreemilestone-list'), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)

    # test unauthorized GET for person list
    def test_get_unauthorized_person_list(self):
        response = self.client.get(reverse('api:familytreeperson-list'), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED, response.content)

    # test unauthorized GET for relationship list    
    def test_get_unauthorized_relationship_list(self):
        response = self.client.get(reverse('api:familytreerelationship-list'), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED, response.content)

    # test unauthorized GET for milestone list   
    def test_get_unauthorized_milestone_list(self):
        response = self.client.get(reverse('api:familytreemilestone-list'), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED, response.content)


# POST requests
class PostTest(APITestCase):
    # set up User data
    def setUp(self):
        self.data={
            'username': USERNAME,
            'password': PASSWORD,
        }
    # function that is used to pass the JWT Authorization, used in every other test
    def pass_authorization(self):
        url = reverse('token-auth')
        user = User.objects.create_user(username=USERNAME, password=PASSWORD)
        self.assertEqual(user.is_active, 1, 'Active User')

        response = self.client.post(url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
        token = response.data['token']

        return user, token

    # test POST person with full data(adding person)
    def test_post_person_full(self):
        avatar = SimpleUploadedFile(name='test_image.png', content=open(settings.MEDIA_ROOT + '\\test_image.png', 'rb').read(), content_type='image/jpeg')
        user, token = self.pass_authorization()

        data = PERFECT_PERSON_DATA
        data['user_id'] = user.id
        data['avatar'] = avatar

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.post(reverse('api:familytreeperson-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.content)

    # test POST person with minimum data (adding person)
    def test_post_person_minimum(self):
        avatar = SimpleUploadedFile(name='test_image.png', content=open(settings.MEDIA_ROOT + '\\test_image.png', 'rb').read(), content_type='image/jpeg')
        user, token = self.pass_authorization()

        data = MINIMUM_PERSON_DATA
        data['user_id'] = user.id
        data['avatar'] = avatar

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.post(reverse('api:familytreeperson-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.content)

    # test POST person without image (adding person)
    def test_post_person_no_image(self):
        user, token = self.pass_authorization()

        data = MINIMUM_PERSON_DATA
        data['user_id'] = user.id

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.post(reverse('api:familytreeperson-list'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.content)

    # test POST person with no data, empty JSON (adding person)
    def test_post_person_no_data(self):
        user, token = self.pass_authorization()

        data = {}

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.post(reverse('api:familytreeperson-list'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.content)