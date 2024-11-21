# Generated by Django 5.1.3 on 2024-11-20 21:47

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Child',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('notes', models.TextField()),
                ('dob', models.DateField()),
                ('gender', models.CharField(choices=[('MALE', 'Male'), ('FEMALE', 'Female'), ('OTHER', 'Other'), ('NOT', 'Prefer not to say')])),
                ('address', models.CharField(max_length=200)),
                ('em_contact_name', models.CharField(max_length=200)),
                ('em_contact_number', models.CharField(max_length=12)),
                ('upload', models.FileField(blank=True, upload_to='uploads/')),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parent', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Checkin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('checkin', models.DateTimeField()),
                ('checkout', models.DateTimeField(blank=True)),
                ('report_card', models.TextField(blank=True)),
                ('upload', models.FileField(blank=True, upload_to='uploads/')),
                ('checkin_staff', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='checkin_staff', to=settings.AUTH_USER_MODEL)),
                ('checkout_staff', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='checkout_staff', to=settings.AUTH_USER_MODEL)),
                ('report_staff', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='report_staff', to=settings.AUTH_USER_MODEL)),
                ('child', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='child_reg.child')),
            ],
        ),
    ]