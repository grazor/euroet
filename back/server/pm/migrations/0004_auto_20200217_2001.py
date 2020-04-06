# Generated by Django 3.0.2 on 2020-02-17 20:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pm', '0003_componentimport'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='project',
            options={'permissions': [('can_create_projects', 'Can create projects'), ('can_manage_projects', 'Can manage projects'), ('can_view_all_projects', 'Can view all projects'), ('can_edit_all_projects', 'Can edit all projects'), ('can_remove_non_empty', 'Can remove non empty projects'), ('can_change_component', 'Can change components'), ('can_manage_project_reports', 'Can manage project level reports')]},
        ),
    ]