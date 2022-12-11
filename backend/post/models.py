import uuid
from django.db import models
from user.models import User
# Create your models here.

def image_filename(instance, filename):
    ext = filename.split('.')[-1]
    filename = "%s.%s" % (uuid.uuid4(), ext)
    return filename

class Post(models.Model):
  image = models.ImageField(upload_to=image_filename, null=False)
  caption = models.TextField(max_length=200, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  creator = models.ForeignKey(User, on_delete=models.CASCADE, null=False)
  liked_by = models.ManyToManyField(User, blank=True, null=True, related_name="liked_by")