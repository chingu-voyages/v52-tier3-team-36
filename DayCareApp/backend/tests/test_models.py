from django.test import TestCase
from django.contrib.auth.models import Group, User
from django.core.exceptions import ObjectDoesNotExist
from app_auth.views import register
from app_auth.models import Permission
from child_reg.models import Child, Checkin

def create_users():
        # Create groups
        admins = Group.objects.create(
             name = "Administrators"
        )
        staff = Group.objects.create(
             name = "Staff"
        )
        parents = Group.objects.create(
             name = "Parents"
        )
        # Create Permissions
        admin_permissions = Permission.objects.create(
            group = admins,
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
        staff_permissions = Permission.objects.create(
            group = staff,
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
        parent_permissions = Permission.objects.create(
            group = parents,
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
        test_user3 = User.objects.create_user(username='testuser3', 
                                              password= '2HJ1vRV0ZfH&y', 
                                              email='testuser3@daycareapp.com',
                                              first_name='test3',
                                              last_name='test3last')
        test_user1.groups.set([admins])
        test_user2.groups.set([staff])
        test_user3.groups.set([parents])
        test_user1.save()
        test_user2.save()
        test_user3.save()
        return admins, staff, parents, admin_permissions, staff_permissions, parent_permissions, test_user1, test_user2, test_user3

def create_child(parent):
    child = Child.objects.create(
	first_name= "child1",
	last_name= "child1last",
	dob= "2020-05-01",
	gender= "MALE",
	address= "12 Eagle Dr, Miami, FL",
	notes= "peanut allergy",
	em_contact_name= "John Doe",
	em_contact_number= "555-666-7777",
	parent= parent
    )
    return child

class UserRegTestCase(TestCase):
    def setUp(self):
        # Create two users
        self.admins, self.staff, self.parents, self.admin_permissions, self.staff_permissions, self.parent_permissions, self.test_user1, self.test_user2, self.test_user3 = create_users()

    def test_user_created(self):
        '''Tests if a user has been successfully saved'''
        user1 = User.objects.get(username='testuser1')
        self.assertEqual(user1.first_name, 'test1')
    
    def test_user_not_found(self):
        '''Tests if a non-existing user raises NotFound error'''
        with self.assertRaises(ObjectDoesNotExist):
            user1 = User.objects.get(username='testuse')

    def test_group_created(self):
        '''Tests if a group has been successfully saved'''
        group1 = Group.objects.get(name='Administrators')
        self.assertEqual(group1.name, 'Administrators')

    def test_group_not_found(self):
        '''Tests if a non-existing group raises NotFound error'''
        with self.assertRaises(ObjectDoesNotExist):
            group1 = Group.objects.get(name='External Users')

    def test_permission_created(self):
        '''Tests if a group permission has been successfully saved'''
        permission_count = Permission.objects.count()
        self.assertEqual(permission_count, 3)

    def test_group_not_found(self):
        '''Tests if a non-existing group permission raises NotFound error'''
        with self.assertRaises(ObjectDoesNotExist):
            permission_group1 = Permission.objects.get(group=1500)

    def tearDown(self):
        User.objects.all().delete()
        Permission.objects.all().delete()
        Group.objects.all().delete()

class ChildRegTestCase(TestCase):
    def setUp(self):
        # Create two users
        self.admins, self.staff, self.parents, self.admin_permissions, self.staff_permissions, self.parent_permissions, self.test_user1, self.test_user2, self.test_user3 = create_users()
        self.child = create_child(self.test_user3)

    def test_child_created(self):
        '''Tests if a child has been successfully saved'''
        child1 = Child.objects.get(first_name='child1')
        self.assertEqual(child1.parent, self.test_user3)
    
    def test_user_not_found(self):
        '''Tests if a non-existing child raises NotFound error'''
        with self.assertRaises(ObjectDoesNotExist):
            child1 = Child.objects.get(first_name='testuse')

    def test_checkin_child(self):
        '''Tests if a child can be checked in'''
        checkin1 = Checkin.objects.create(
            child= self.child,
            checkin= "2024-12-01T10:30:00Z",
            checkin_staff= self.test_user1
        )
        self.assertEqual(checkin1.child, self.child)
        self.assertEqual(checkin1.checkout, None)

    def test_checkout_child(self):
        '''Tests if a child can be checked out'''
        checkin1 = Checkin.objects.create(
            child= self.child,
            checkin= "2024-12-01T10:30:00Z",
            checkin_staff= self.test_user1
        )
        checkout = Checkin.objects.get(id=checkin1.id)
        checkout.checkout = "2024-12-01T17:30:00Z"
        checkout.checkout_staff = self.test_user2
        self.assertEqual(checkout.child, self.child)
        self.assertEqual(checkout.checkout, "2024-12-01T17:30:00Z")

    def test_checkout_child(self):
        '''Tests if a report card can be created'''
        checkin1 = Checkin.objects.create(
            child= self.child,
            checkin= "2024-12-01T10:30:00Z",
            checkin_staff= self.test_user1
        )
        checkout = Checkin.objects.get(id=checkin1.id)
        checkout.checkout = "2024-12-01T17:30:00Z"
        checkout.checkout_staff = self.test_user2
        checkout.report_card = 'This is a test card'
        checkout.report_staff = self.test_user2
        self.assertEqual(checkout.child, self.child)
        self.assertIn('This is a', checkout.report_card)

    def tearDown(self):
        User.objects.all().delete()
        Permission.objects.all().delete()
        Group.objects.all().delete()
        Child.objects.all().delete()
        Checkin.objects.all().delete()