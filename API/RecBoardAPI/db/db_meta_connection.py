import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONNECTION_META = os.getenv('DB_CONNECTION_META')


class DBMeta():
    __instance = None
    __db = None
    _path = DB_CONNECTION_META

    @staticmethod
    def get_DB():
        if DBMeta.__db == None:
            DBMeta()
        return DBMeta.__db

    def __init__(self):
        if DBMeta.__db != None:
            raise Exception("This class is a singleton.")
        else:
            DBMeta.__instance = pymongo.MongoClient(DBMeta._path)
            DBMeta.__db = DBMeta.__instance["meta"]
