import graphene
from auth.graphql import AuthMutation
from user.graphql import UserMutation
from post.graphql import PostMutation, PostQuery

class Query(PostQuery, graphene.ObjectType):
    hello = graphene.String(default_value="Hi!")

class Mutation(AuthMutation, PostMutation, UserMutation, graphene.ObjectType):
  pass

schema = graphene.Schema(query=Query, mutation=Mutation)