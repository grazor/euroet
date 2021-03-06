# Generated by Django 3.0 on 2020-01-02 19:08

from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('pm', '0002_trigram_index'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collection',
            name='name',
            field=models.CharField(blank=True, db_index=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='manufacturer',
            name='name',
            field=models.CharField(blank=True, db_index=True, max_length=128, null=True),
        ),
        migrations.CreateModel(
            name='ComponentImport',
            fields=[
                ('uuid', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('original_name', models.CharField(blank=True, max_length=255, null=True)),
                ('import_file', models.FilePathField(blank=True, max_length=255, null=True, path='/home/serega/Personal/euroet/back/media/imports')),
                ('status', models.CharField(choices=[('CREATED', 'created'), ('QUEUED', 'queued'), ('PROCESSING', 'processing'), ('COMPLETE', 'complete'), ('FAILED', 'failed')], default='created', max_length=127)),
                ('complete', models.BooleanField(default=False)),
                ('rows', models.IntegerField(blank=True, null=True)),
                ('processed', models.IntegerField(blank=True, null=True)),
                ('errors', django.contrib.postgres.fields.jsonb.JSONField(default=list)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('-created_at',),
            },
        ),
    ]
