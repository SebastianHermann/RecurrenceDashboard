import pymongo
from pymongo import MongoClient

client = pymongo.MongoClient(
    "mongodb://sh318:Mongo2Recboard@cluster0.jjlbq.mongodb.net/recboard-db?retryWrites=true&w=majority", connect=False)
db = client["recboard-db"]


# def get_tactical_groups(game="*"):


#     return

# def post_tactical_groups():
#     return

# def get_tactical_group(id):
#     return

# def put_tactical_group(id):
#     return

# def delete_tactical_group(id):
#     return
