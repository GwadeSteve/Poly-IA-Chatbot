# Generated by Django 4.2 on 2023-05-10 05:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("SystIA", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="message",
            name="reponse",
            field=models.CharField(default="aucune", max_length=30000),
        ),
    ]
