import graphene
import base64
from graphene_django import DjangoObjectType
from django.core.files.base import ContentFile
from .models import Post
from user.graphql import UserType
from graphene.types.generic import GenericScalar



class PostType(DjangoObjectType):
  class Meta:
    model = Post
    fields = '__all__'
  
  liked = graphene.Boolean()
  
  def resolve_image(root, info, **kwargs):
    return root.image.url

  def resolve_liked(root, info, **kwargs):
    user = info.context.user
    if not user or user.is_anonymous:
      print("User is not authenticate.")
      return False
    return root.liked_by.contains(user)


class CreatePost(graphene.Mutation):
  class Arguments:
    base64_image = graphene.String(required=True)
    caption = graphene.String()

  ok = graphene.Boolean()

  @classmethod
  def mutate(cls, root, info, base64_image, caption):
    creator = info.context.user
    if not creator or not creator.is_authenticated:
      print("User is not authenticate.")
      return cls(ok=False)
    format, imgstr = base64_image.split(';base64,') 
    ext = format.split('/')[-1]
    data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
    post = Post(image=data, caption=caption, creator=creator)
    post.save()
    return cls(ok=True)

class LikePost(graphene.Mutation):
  class Arguments:
    post_id = graphene.ID()
  
  ok = graphene.Boolean()
  user = graphene.Field(UserType)

  @classmethod
  def mutate(cls, root, info, post_id):
    liked_by = info.context.user
    if not liked_by or not liked_by.is_authenticated:
      print("User is not authenticate.")
      return cls(ok=False, user=None)
    post = Post.objects.get(pk=post_id)
    if not post.liked_by.contains(liked_by):
      post.liked_by.add(liked_by)
    else:
      post.liked_by.remove(liked_by)
    post.save()
    return cls(ok=True, user=liked_by)

class PostMutation(graphene.ObjectType):
  create_post = CreatePost.Field()
  like_post = LikePost.Field()

class PostQuery(graphene.ObjectType):
  list_post = graphene.List(PostType)
  
  def resolve_list_post(root, info, **kwargs):
    return Post.objects.all().order_by('created_at')