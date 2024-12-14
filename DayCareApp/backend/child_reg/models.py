from django.db import models
from django.contrib.auth.models import User

def image_upload_path(instance, filename):
    extension = filename.split('.')[-1]
    new_filename = f"{instance.pk}_{instance.last_name}.{extension}" 
    return f"profile_pics/{new_filename}"

class Child(models.Model):
    '''Model for child'''
    GENDER = {
    "MALE": "Male", 
    "FEMALE": "Female", 
    "OTHER": "Other", 
    "NOT": "Prefer not to say"
    }
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    notes = models.TextField(blank=True)
    dob = models.DateField()
    gender = models.CharField(choices=GENDER)
    address = models.CharField(max_length=200)
    em_contact_name = models.CharField(max_length=200)
    em_contact_number = models.CharField(max_length=12)
    parent = models.ForeignKey(User, on_delete=models.CASCADE, related_name='parent')
    upload = models.FileField(upload_to=image_upload_path, blank=True)

class Checkin(models.Model):
    '''Model for check in/out, report card records
    Requires the current user to be passed and recorded, along with the date and time when the action has occured.'''
    child = models.ForeignKey(Child, on_delete=models.CASCADE)
    checkin = models.DateTimeField()
    checkout = models.DateTimeField(blank=True, null=True)
    checkin_staff = models.ForeignKey(User, on_delete=models.CASCADE, related_name="checkin_staff")
    checkout_staff = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name="checkout_staff")
    report_card = models.TextField(blank=True, null=True)
    report_staff = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name="report_staff")
    upload = models.FileField(upload_to="uploads/", blank=True, null=True)