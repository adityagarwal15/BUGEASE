# Generated by Django 5.2 on 2025-04-13 20:58

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0003_user_phone_number"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="phone_number",
            field=models.CharField(max_length=10, unique=True),
        ),
    ]
