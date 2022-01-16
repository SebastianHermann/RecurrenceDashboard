import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONNECTION = os.getenv('DB_CONNECTION')


class DBConnection():
    __instance = None
    __db = None
    _path = DB_CONNECTION

    @staticmethod
    def get_DB():
        if DBConnection.__db == None:
            DBConnection()
        return DBConnection.__db

    def __init__(self):
        if DBConnection.__db != None:
            raise Exception("This class is a singleton.")
        else:
            DBConnection.__instance = pymongo.MongoClient(DBConnection._path)
            DBConnection.__db = DBConnection.__instance["recboard"]
