import json
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.core.files import File
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.conf import settings
from django.conf.urls.static import static
from django.db.utils import IntegrityError
from django.db import transaction

#region CONST
USERNAME = 'QuatZo'
PASSWORD = 'unittest'

PERFECT_PERSON_DATA = {
    'first_name': 'Quat',
    'last_name': 'Zo',
    'birth_date': '2019-09-07',
    'birth_place': 'Poland',
    'status_choices': 'living',
    'sex_choices': 'male',
    'x': 0.33,
    'y': 0.66,
}
PERFECT_RELATIONSHIP_DATA = {
    'color': '#ffffff',
    'title': 'Test Relationship',
    'description': 'This is a test description for a test relationship.',
    'begin_date': '2019-09-07',
    'end_date': '2019-09-08',
    'descendant': True,
    'relationships': 'child'
}
PERFECT_MILESTONE_DATA = {
    'date': '2019-09-07',
    'text': 'This is a test description for a test milestone.',
    'title': 'Test Milestone',
}

MINIMUM_PERSON_DATA = {
    'first_name': 'Quat',
    'last_name': 'Zo',
    'birth_date': '',
    'birth_place': '',
    'status_choices': '',
    'sex_choices': '',
    'x': '',
    'y': '',
}
MINIMUM_RELATIONSHIP_DATA = {
    'id_1': 1,
    'id_2': 2,
    'title': 'Test Relationship',
    'begin_date': '2019-09-07',
    'relationships': 'child'
}
MINIMUM_MILESTONE_DATA = {
    'date': '2019-09-07',
    'title': 'Test Milestone',
}
#endregion

# Create your tests here.
class APITest(APITestCase):
    # set up User data
    def setUp(self):
        self.data={
            'username': USERNAME,
            'password': PASSWORD,
        }

    # function that is used to pass the JWT Authorization, used in every other test
    # it tests registering of new account as well
    def pass_authorization(self):
        try:
            with transaction.atomic():
                url = reverse('token-auth')
                user = User.objects.create_user(username=USERNAME, password=PASSWORD)
                self.assertEqual(user.is_active, 1, 'Active User')
        except IntegrityError:
            user = User.objects.get(username=USERNAME)

        response = self.client.post(url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
        token = response.data['token']

        return user, token

    # test authorization (login)
    def test_current_user(self):
        user, token = self.pass_authorization()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.get(reverse('current_user'), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)

    #region GET
    # test GET for person list
    def test_get_person_list(self):
        user, token = self.pass_authorization()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.get(reverse('api:familytreeperson-list'), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)

    # test GET for relationship list
    def test_get_relationship_list(self):
        user, token = self.pass_authorization()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.get(reverse('api:familytreerelationship-list'), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)

    # test GET for milestone list
    def test_get_milestone_list(self):
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

    # test GET for specific person
    def test_get_person_detail(self):
        url = reverse('token-auth')
        user, token = self.pass_authorization()
        person_id = self.test_post_person_full()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.get(reverse('api:familytreeperson-detail', args=[person_id]), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)

        return json.loads(response.content.decode('utf-8'))

    # test GET for specific relationship
    def test_get_relationship_detail(self):
        url = reverse('token-auth')
        user, token = self.pass_authorization()
        relationship_id = self.test_post_relationship_full()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.get(reverse('api:familytreerelationship-detail', args=[relationship_id]), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)

        return json.loads(response.content.decode('utf-8'))

    # test GET for specific milestone
    def test_get_milestone_detail(self):
        url = reverse('token-auth')
        user, token = self.pass_authorization()
        milestone_id = self.test_post_milestone_full()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.get(reverse('api:familytreemilestone-detail', args=[milestone_id]), data={'format': 'json'})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)

        return json.loads(response.content.decode('utf-8'))
    #endregion

    #region POST
    # test POST person with full data (adding person)
    def test_post_person_full(self):
        avatar = SimpleUploadedFile(name='test_image.png', content=open(settings.MEDIA_ROOT + '\\test_image.png', 'rb').read(), content_type='image/jpeg')
        user, token = self.pass_authorization()

        data = PERFECT_PERSON_DATA
        data['user_id'] = user.id
        data['avatar'] = avatar

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.post(reverse('api:familytreeperson-list'), data)
        response_content = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.content)

        return response_content['id']

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

    # test POST relationship with full data (adding relation)
    def test_post_relationship_full(self):
        user, token = self.pass_authorization()

        data = PERFECT_RELATIONSHIP_DATA
        data['user_id'] = user.id
        data['id_1'] = self.test_post_person_full()
        data['id_2'] = self.test_post_person_full()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.post(reverse('api:familytreerelationship-list'), data)
        response_content = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.content)

        return response_content['id']

    # test POST relationship with minimum data (adding relation)
    def test_post_relationship_minimum(self):
        user, token = self.pass_authorization()

        data = MINIMUM_RELATIONSHIP_DATA
        data['user_id'] = user.id
        data['id_1'] = self.test_post_person_full()
        data['id_2'] = self.test_post_person_full()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.post(reverse('api:familytreerelationship-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.content)

    # test POST relationship with no data, empty JSON (adding relation)
    def test_post_relationship_no_data(self):
        user, token = self.pass_authorization()

        data = {}

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.post(reverse('api:familytreerelationship-list'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.content)

    # test POST milestone with full data (adding milestone)
    def test_post_milestone_full(self):
        media = SimpleUploadedFile(name='test_media.mp4', content=open(settings.MEDIA_ROOT + '\\test_media.mp4', 'rb').read())
        user, token = self.pass_authorization()

        person_list = list()
        for i in range(10):
            person_list.append(self.test_post_person_full())

        data = PERFECT_MILESTONE_DATA
        data['user_id'] = user.id
        data['person_id'] = person_list
        data['image'] = media

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.post(reverse('api:familytreemilestone-list'), data)
        response_content = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.content)

        return response_content['id']

    # test POST milestone with minimum data (adding milestone)
    def test_post_milestone_minimum(self):
        media = SimpleUploadedFile(name='test_media.mp4', content=open(settings.MEDIA_ROOT + '\\test_media.mp4', 'rb').read())
        user, token = self.pass_authorization()

        person_list = list()
        for i in range(10):
            person_list.append(self.test_post_person_full())

        data = MINIMUM_MILESTONE_DATA
        data['user_id'] = user.id
        data['person_id'] = person_list
        data['image'] = media

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.post(reverse('api:familytreemilestone-list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.content)

    # test POST milestone without file (adding milestone)
    def test_post_milestone_no_file(self):
        user, token = self.pass_authorization()

        person_list = list()
        for i in range(10):
            person_list.append(self.test_post_person_full())

        data = MINIMUM_MILESTONE_DATA
        data['user_id'] = user.id
        data['person_id'] = person_list

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.post(reverse('api:familytreemilestone-list'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.content)

    # test POST milestone with no data, empty JSON (adding milestone)
    def test_post_milestone_no_data(self):
        user, token = self.pass_authorization()

        data = {}

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.post(reverse('api:familytreemilestone-list'), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.content)
    #endregion

    #region PATCH
    # test PATCH specific person (NO image change)
    def test_patch_person_detail(self):
        # function test_get_person_detail() creates new person (calls test_post_person_full() function), in order to check if get person detail works, so no need to call it twice
        person_content = self.test_get_person_detail()
        user, token = self.pass_authorization()

        new_data = {
            'first_name': 'Dawid'
        }

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.patch(reverse('api:familytreeperson-detail', args=[person_content['id']]), new_data)
        response_content = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
        self.assertNotEqual(response_content, person_content, response.content)

    # test PATCH specific person (image change)
    def test_patch_person_detail_image(self):
        # function test_get_person_detail() creates new person (calls test_post_person_full() function), in order to check if get person detail works, so no need to call it twice
        person_content = self.test_get_person_detail()
        user, token = self.pass_authorization()
        avatar = SimpleUploadedFile(name='test_image_patch.png', content=open(settings.MEDIA_ROOT + '\\test_image_patch.png', 'rb').read(), content_type='image/jpeg')

        new_data = {
            'first_name': 'Dawid',
            'avatar': avatar,
        }

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.patch(reverse('api:familytreeperson-detail', args=[person_content['id']]), new_data)
        response_content = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
        self.assertNotEqual(response_content, person_content, response.content)

    # test PATCH specific person (EMPTY image change)
    def test_patch_person_detail_image_empty(self):
        # function test_get_person_detail() creates new person (calls test_post_person_full() function), in order to check if get person detail works, so no need to call it twice
        person_content = self.test_get_person_detail()
        user, token = self.pass_authorization()

        new_data = {
            'first_name': 'Dawid',
            'avatar': '',
        }

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.patch(reverse('api:familytreeperson-detail', args=[person_content['id']]), new_data)
        response_content = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.content)

    # test PATCH specific relationship (NO relationship change)
    def test_patch_relationship_detail(self):
        # function test_get_relationship_detail() creates new relation (calls test_post_relationship_full() function), in order to check if get relationship detail works, so no need to call it twice
        relationship_content = self.test_get_relationship_detail()
        user, token = self.pass_authorization()

        new_data = {
            'title': '[PATCH] Test Relationship',
        }

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.patch(reverse('api:familytreerelationship-detail', args=[relationship_content['id']]), new_data)
        response_content = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
        self.assertNotEqual(response_content, relationship_content, response.content)

    # test PATCH specific relationship (relationship change)
    def test_patch_relationship_detail_type_existing(self):
        # function test_get_relationship_detail() creates new relation (calls test_post_relationship_full() function), in order to check if get relationship detail works, so no need to call it twice
        relationship_content = self.test_get_relationship_detail()
        user, token = self.pass_authorization()

        new_data = {
            'relationships': 'adopted-child',
        }

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.patch(reverse('api:familytreerelationship-detail', args=[relationship_content['id']]), new_data)
        response_content = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
        self.assertNotEqual(response_content, relationship_content, response.content)

    # test PATCH specific relationship (EMPTY relationship change)
    def test_patch_relationship_detail_type_empty(self):
        # function test_get_relationship_detail() creates new relation (calls test_post_relationship_full() function), in order to check if get relationship detail works, so no need to call it twice
        relationship_content = self.test_get_relationship_detail()
        user, token = self.pass_authorization()

        new_data = {
            'relationships': '',
        }

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.patch(reverse('api:familytreerelationship-detail', args=[relationship_content['id']]), new_data)
        response_content = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response_content, relationship_content, response.content)

    # test PATCH specific milestone (NO media change)
    def test_patch_milestone_detail(self):
        # function test_get_milestone_detail() creates new milestone (calls test_post_milestone_full() function), in order to check if get milestone detail works, so no need to call it twice
        milestone_content = self.test_get_milestone_detail()
        user, token = self.pass_authorization()

        new_data = {
            'title': '[PATCH] Test Milestone'
        }

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.patch(reverse('api:familytreemilestone-detail', args=[milestone_content['id']]), new_data)
        response_content = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
        self.assertNotEqual(response_content, milestone_content, response.content)

    # test PATCH specific milestone (media change)
    def test_patch_milestone_detail_media(self):
        # function test_get_milestone_detail() creates new milestone (calls test_post_milestone_full() function), in order to check if get milestone detail works, so no need to call it twice
        milestone_content = self.test_get_milestone_detail()
        user, token = self.pass_authorization()
        media = SimpleUploadedFile(name='test_media_patch.mp4', content=open(settings.MEDIA_ROOT + '\\test_media_patch.mp4', 'rb').read())

        new_data = {
            'title': '[PATCH] Test Milestone',
            'image': media,
        }

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.patch(reverse('api:familytreemilestone-detail', args=[milestone_content['id']]), new_data)
        response_content = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.content)
        self.assertNotEqual(response_content, milestone_content, response.content)

    # test PATCH specific milestone (EMPTY media change)
    def test_patch_milestone_detail_image_empty(self):
        # function test_get_milestone_detail() creates new milestone (calls test_post_milestone_full() function), in order to check if get milestone detail works, so no need to call it twice
        milestone_content = self.test_get_milestone_detail()
        user, token = self.pass_authorization()

        new_data = {
            'title': '[PATCH] Test Milestone',
            'image': '',
        }

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.patch(reverse('api:familytreemilestone-detail', args=[milestone_content['id']]), new_data)
        response_content = json.loads(response.content.decode('utf-8'))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.content)
    #endregion

    #region DELETE
    # test DELETE specific person
    def test_delete_person_detail(self):
        # function test_get_person_detail() creates new person (calls test_post_person_full() function), in order to check if get person detail works, so no need to call it twice
        person_content = self.test_get_person_detail()
        user, token = self.pass_authorization()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.delete(reverse('api:familytreeperson-detail', args=[person_content['id']]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT, response.content)

    # test DELETE specific relationship
    def test_delete_relationship_detail(self):
        # function test_get_relationship_detail() creates new relationship (calls test_post_relationship_full() function), in order to check if get relationship detail works, so no need to call it twice
        relationship_content = self.test_get_relationship_detail()
        user, token = self.pass_authorization()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.delete(reverse('api:familytreerelationship-detail', args=[relationship_content['id']]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT, response.content)

    # test DELETE specific milestone
    def test_delete_milestone_detail(self):
        # function test_get_milestone_detail() creates new milestone (calls test_post_milestone_full() function), in order to check if get milestone detail works, so no need to call it twice
        milestone_content = self.test_get_milestone_detail()
        user, token = self.pass_authorization()

        self.client.credentials(HTTP_AUTHORIZATION='JWT {0}'.format(token))
        response = self.client.delete(reverse('api:familytreemilestone-detail', args=[milestone_content['id']]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT, response.content)
    #endregion