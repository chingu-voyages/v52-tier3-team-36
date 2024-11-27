from django.db import models
from django.contrib.auth.models import User

class Child(models.Model):
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
    upload = models.FileField(upload_to="uploads/", blank=True)

class Checkin(models.Model):
    child = models.ForeignKey(Child, on_delete=models.CASCADE)
    checkin = models.DateTimeField()
    checkout = models.DateTimeField(blank=True)
    checkin_staff = models.ForeignKey(User, on_delete=models.CASCADE, related_name="checkin_staff")
    checkout_staff = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, related_name="checkout_staff")
    report_card = models.TextField(blank=True)
    report_staff = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, related_name="report_staff")
    upload = models.FileField(upload_to="uploads/", blank=True)