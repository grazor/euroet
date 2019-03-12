# Generated by Django 2.1.7 on 2019-03-10 10:39

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('pm', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='report',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='report',
            name='product',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='pm.Product'),
        ),
        migrations.AddField(
            model_name='report',
            name='project',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='pm.Project'),
        ),
        migrations.AddField(
            model_name='projectaccess',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='granted', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='projectaccess',
            name='project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='access', to='pm.Project'),
        ),
        migrations.AddField(
            model_name='projectaccess',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='project',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_projects', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='project',
            name='users',
            field=models.ManyToManyField(through='pm.ProjectAccess', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='productcomponent',
            name='component',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='pm.Component'),
        ),
        migrations.AddField(
            model_name='productcomponent',
            name='product',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='elements', to='pm.Product'),
        ),
        migrations.AddField(
            model_name='productcomponent',
            name='updated_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='product',
            name='components',
            field=models.ManyToManyField(through='pm.ProductComponent', to='pm.Component'),
        ),
        migrations.AddField(
            model_name='product',
            name='created_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='product',
            name='project',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='products', to='pm.Project'),
        ),
        migrations.AddField(
            model_name='product',
            name='updated_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='updated', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='component',
            name='collection',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='pm.Collection'),
        ),
        migrations.AddField(
            model_name='component',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='component',
            name='merged_to',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='pm.Component'),
        ),
        migrations.AlterUniqueTogether(
            name='projectaccess',
            unique_together={('user', 'project')},
        ),
        migrations.AlterUniqueTogether(
            name='productcomponent',
            unique_together={('product', 'component')},
        ),
        migrations.AlterUniqueTogether(
            name='product',
            unique_together={('project', 'slug')},
        ),
    ]