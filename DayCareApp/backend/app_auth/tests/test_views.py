from django.test import TestCase
from django.contrib.auth.models import Group, User
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from app_auth.views import register

class UserRegTestCase(TestCase):
    user1_pass = '1X<ISRUkw+tuK'
    user2_pass = '2HJ1vRV0Z&3iD'
    def setUp(self):
        # Create two users
        test_user1 = User.objects.create_user(username='testuser1', 
                                              password='1X<ISRUkw+tuK', 
                                              email='testuser1@daycareapp.com',
                                              first_name='test1',
                                              last_name='test1last')
        test_user2 = User.objects.create_user(username='testuser2', 
                                              password= '2HJ1vRV0Z&3iD', 
                                              email='testuser2@daycareapp.com',
                                              first_name='test2',
                                              last_name='test2last')

        test_user1.save()
        test_user2.save()

    def test_user_created(self):
        '''Tests if a user has been successfully saved'''
        user1 = User.objects.get(username='testuser1')
        self.assertEqual(user1.first_name, 'test1')
    
    def test_user_not_found(self):
        '''Tests if a non-existing user raises NotFound error'''
        with self.assertRaises(ObjectDoesNotExist):
            user1 = User.objects.get(username='testuse')

    def test_not_logged_in(self):
        '''Test to make sure a user must be logged in'''
        response = self.client.post('/api/authenticated/', {})
        self.assertEqual(response.status_code, 401)
    
    def test_user_can_log_in(self):
        '''Tests if a user can log in'''
        login = self.client.post('/api/token/', {'username': 'testuser2',
                                                'password': '2HJ1vRV0Z&3iD'})
        self.assertEqual(login.status_code, 200)
        self.assertIn('access_token', self.client.cookies)
        response = self.client.post('/api/authenticated/', {})
        self.assertEqual(response.status_code, 200)