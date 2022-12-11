import graphene
from graphene_django import DjangoObjectType

from django.contrib.auth.hashers import check_password
from user.models import User

class UserType(DjangoObjectType):
  class Meta:
    model = User
    fields = '__all__'

class UserRegister(graphene.Mutation):
  class Arguments:
    username = graphene.String(required=True)
    password = graphene.String(required=True)
  
  ok = graphene.Boolean()

  @classmethod
  def mutate(cls, root, info, username, password):
    qs = User.objects.filter(username=username)
    if qs.exists():
      print("Username already exist.")
      return cls(ok=False)
    user = User.objects.create(username=username)
    user.set_password(password)
    user.save()
    return cls(ok=True)


class UserMutation(graphene.ObjectType):
  user_register = UserRegister.Field()