# Generated by Django 2.1.7 on 2019-03-23 11:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pm', '0003_trigram_index'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='modified_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]