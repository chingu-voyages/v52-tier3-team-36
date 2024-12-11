from django.test import TestCase
from django.contrib.auth.models import Group, User
from app_auth.models import Permission
from rest_framework.exceptions import ErrorDetail

class UserRegTestCase(TestCase):
    def setUp(self):
        self.admins = Group.objects.create(
             name = "Administrators"
        )
        # Create Permissions
        self.admin_permissions = Permission.objects.create(
            group = self.admins,
            list_users = True,
            edit_users = True,
            list_parents = True,
            edit_parents = True,
            list_children = True,
            list_own_children = False,
            edit_children = True,
            check_in = True,
            edit_report_cards = True,
            view_stats = True
        )
        # Create two users
        self.admin_user = User.objects.create_user(username='adminuser', 
                                              password='adminuser', 
                                              email='adminuser@daycareapp.com',
                                              first_name='admin1',
                                              last_name='admin1last')
        self.admin_user.groups.set([self.admins])
        self.admin_user.save()

    def test_not_logged_in(self):
        '''Test to make sure a user must be logged in'''
        response = self.client.post('/api/authenticated/', {})
        self.assertEqual(response.status_code, 401)
    
    def test_user_can_log_in(self):
        '''Tests if a user can log in'''
        login = self.client.post('/api/token/', {'username': 'adminuser',
                                                'password': 'adminuser'})
        self.assertEqual(login.status_code, 200)
        self.assertIn('access_token', self.client.cookies)
        response = self.client.post('/api/authenticated/', {})
        self.assertEqual(response.status_code, 200)

    def test_can_create_group(self):
        login = self.client.post('/api/token/', {'username': 'adminuser',
                                                'password': 'adminuser'})
        response = self.client.post('/groups/', {
            'name': 'Staff'
        })
        self.assertEqual(response.status_code, 201)


    def test_can_register_user(self):
        login = self.client.post('/api/token/', {'username': 'adminuser',
                                                'password': 'adminuser'})
        group = self.client.post('/groups/', {
            'name': 'Staff'
        })
        response = self.client.post('/api/register/', 
                    {
                        "username": "teststaff",
                        "password": "teststaff",
                        "email": "teststaff@kinderly.com",
                        "first_name": "Staff",
                        "last_name": "Test",
                        "groups": [group.data['id']]
                    } )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], "teststaff")

    def test_cannot_register_duplicate_username(self):
        login = self.client.post('/api/token/', {'username': 'adminuser',
                                                'password': 'adminuser'})
        group = self.client.post('/groups/', {
            'name': 'Staff'
        })
        response = self.client.post('/api/register/', 
                    {
                        "username": "teststaff",
                        "password": "teststaff",
                        "email": "teststaff@kinderly.com",
                        "first_name": "Staff",
                        "last_name": "Test",
                        "groups": [group.data['id']]
                    } )
        response_duplicate = self.client.post('/api/register/', 
                    {
                        "username": "teststaff",
                        "password": "teststaff",
                        "email": "teststaff@kinderly.com",
                        "first_name": "Staff",
                        "last_name": "Test",
                        "groups": [group.data['id']]
                    } )
        err = ErrorDetail(string='A user with that username already exists.', code='unique')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['username'], "teststaff")
        self.assertEqual(response_duplicate.data['username'][0], err)

class ChildRegTestCase(TestCase):
    def setUp(self):
        # Create groups
        self.admins = Group.objects.create(
             name = "Administrators"
        )
        self.staff = Group.objects.create(
             name = "Staff"
        )
        self.parents = Group.objects.create(
             name = "Parents"
        )
        # Create Permissions
        self.admin_permissions = Permission.objects.create(
            group = self.admins,
            list_users = True,
            edit_users = True,
            list_parents = True,
            edit_parents = True,
            list_children = True,
            list_own_children = False,
            edit_children = True,
            check_in = True,
            edit_report_cards = True,
            view_stats = True
        )
        self.staff_permissions = Permission.objects.create(
            group = self.staff,
            list_users = True,
            edit_users = False,
            list_parents = True,
            edit_parents = False,
            list_children = True,
            list_own_children = False,
            edit_children = True,
            check_in = True,
            edit_report_cards = True,
            view_stats = True
        )
        self.parent_permissions = Permission.objects.create(
            group = self.parents,
            list_users = False,
            edit_users = False,
            list_parents = False,
            edit_parents = False,
            list_children = False,
            list_own_children = True,
            edit_children = False,
            check_in = False,
            edit_report_cards = False,
            view_stats = False
        )
    # Create two users
        self.admin_user = User.objects.create_user(username='adminuser', 
                                              password='adminuser', 
                                              email='testuser1@daycareapp.com',
                                              first_name='test1',
                                              last_name='test1last')
        self.staff_user = User.objects.create_user(username='staffuser', 
                                              password= 'staffuser', 
                                              email='testuser2@daycareapp.com',
                                              first_name='test2',
                                              last_name='test2last')
        self.parent_user = User.objects.create_user(username='parentuser', 
                                              password= 'parentuser', 
                                              email='testuser3@daycareapp.com',
                                              first_name='test3',
                                              last_name='test3last')
        self.admin_user.groups.set([self.admins])
        self.staff_user.groups.set([self.staff])
        self.parent_user.groups.set([self.parents])
        self.admin_user.save()
        self.staff_user.save()
        self.parent_user.save()
        return self.admins, self.staff, self.parents, self.admin_permissions, self.staff_permissions, self.parent_permissions, self.admin_user, self.staff_user, self.parent_user
    
    def test_can_register_child(self):
        login = self.client.post('/api/token/', {'username': 'adminuser',
                                                'password': 'adminuser'})

        response = self.client.post('/children/', 
                {
                "first_name": "child1",
                "last_name": "child1last",
                "dob": "2020-05-01",
                "gender": "MALE",
                "address": "12 Eagle Dr, Miami, FL",
                "notes": "peanut allergy",
                "em_contact_name": "John Doe",
                "em_contact_number": "555-666-7777",
                "parent": self.parent_user.id
                })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['first_name'], "child1")

    def test_cannot_register_child_not_loggedin(self):
        response = self.client.post('/children/', 
                {
                "first_name": "child1",
                "last_name": "child1last",
                "dob": "2020-05-01",
                "gender": "MALE",
                "address": "12 Eagle Dr, Miami, FL",
                "notes": "peanut allergy",
                "em_contact_name": "John Doe",
                "em_contact_number": "555-666-7777",
                "parent": self.parent_user.id
                })
        self.assertEqual(response.status_code, 401)

    def test_cannot_register_child_not_staff(self):
        login = self.client.post('/api/token/', {'username': 'parentuser',
                                                'password': 'parentuser'})
        response = self.client.post('/children/', 
                {
                "first_name": "child1",
                "last_name": "child1last",
                "dob": "2020-05-01",
                "gender": "MALE",
                "address": "12 Eagle Dr, Miami, FL",
                "notes": "peanut allergy",
                "em_contact_name": "John Doe",
                "em_contact_number": "555-666-7777",
                "parent": self.parent_user.id
                })
        self.assertEqual(response.status_code, 403)
    
    def test_cannot_register_child_without_parent(self):
        login = self.client.post('/api/token/', {'username': 'adminuser',
                                                'password': 'adminuser'})

        response = self.client.post('/children/', 
                {
                "first_name": "child1",
                "last_name": "child1last",
                "dob": "2020-05-01",
                "gender": "MALE",
                "address": "12 Eagle Dr, Miami, FL",
                "notes": "peanut allergy",
                "em_contact_name": "John Doe",
                "em_contact_number": "555-666-7777"
                })
        self.assertEqual(response.status_code, 400)

    def test_can_checkin_child(self):
        login = self.client.post('/api/token/', {'username': 'staffuser',
                                                'password': 'staffuser'})

        response = self.client.post('/children/', 
                {
                "first_name": "child1",
                "last_name": "child1last",
                "dob": "2020-05-01",
                "gender": "MALE",
                "address": "12 Eagle Dr, Miami, FL",
                "notes": "peanut allergy",
                "em_contact_name": "John Doe",
                "em_contact_number": "555-666-7777",
                "parent": self.parent_user.id
                })
        self.assertEqual(response.status_code, 201)

        checkin = self.client.post('/checkin/', {
            "child": response.data['id'],
            "checkin": "2024-12-01T10:30:00Z",
            "checkin_staff": self.staff_user.id
        })
        self.assertEqual(checkin.status_code, 201)
        self.assertEqual(checkin.data['child'], response.data['id'])

    def test_can_checkout_child(self):
        login = self.client.post('/api/token/', {'username': 'staffuser',
                                                'password': 'staffuser'})

        response = self.client.post('/children/', 
                {
                "first_name": "child1",
                "last_name": "child1last",
                "dob": "2020-05-01",
                "gender": "MALE",
                "address": "12 Eagle Dr, Miami, FL",
                "notes": "peanut allergy",
                "em_contact_name": "John Doe",
                "em_contact_number": "555-666-7777",
                "parent": self.parent_user.id
                })
        self.assertEqual(response.status_code, 201)

        checkin = self.client.post('/checkin/', {
            "child": response.data['id'],
            "checkin": "2024-12-01T10:30:00Z",
            "checkin_staff": self.staff_user.id
        })
        self.assertEqual(checkin.status_code, 201)
        self.assertEqual(checkin.data['checkin'], "2024-12-01T10:30:00Z")
        
        checkout = self.client.patch(f'/checkin/{checkin.data['id']}/', {
            "checkout": "2024-12-01T17:30:00Z",
            "checkout_staff": self.staff_user.id
        }, content_type='application/json')
        
        self.assertEqual(checkout.status_code, 200)
        self.assertEqual(checkout.data['checkout'], "2024-12-01T17:30:00Z")

    def test_can_create_report(self):
        login = self.client.post('/api/token/', {'username': 'staffuser',
                                                'password': 'staffuser'})

        response = self.client.post('/children/', 
                {
                "first_name": "child1",
                "last_name": "child1last",
                "dob": "2020-05-01",
                "gender": "MALE",
                "address": "12 Eagle Dr, Miami, FL",
                "notes": "peanut allergy",
                "em_contact_name": "John Doe",
                "em_contact_number": "555-666-7777",
                "parent": self.parent_user.id
                })
        self.assertEqual(response.status_code, 201)
    
        checkin = self.client.post('/checkin/', {
            "child": response.data['id'],
            "checkin": "2024-12-01T10:30:00Z",
            "checkin_staff": self.staff_user.id
        })
        self.assertEqual(checkin.status_code, 201)
        self.assertEqual(checkin.data['checkin'], "2024-12-01T10:30:00Z")

        report = self.client.patch(f'/checkin/{checkin.data['id']}/', {
            "report_card": "This is a test",
            "report_staff": self.staff_user.id
        }, content_type='application/json')

        self.assertEqual(report.status_code, 200)
        self.assertEqual(report.data['report_card'], "This is a test")
    
