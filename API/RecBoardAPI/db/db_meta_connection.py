import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

# Contains the configurations for the db-connection; e.g. database path
DB_CONNECTION_META = os.getenv('DB_CONNECTION_META')


class DBMeta():
    __instance = None
    __db = None
    _path = DB_CONNECTION_META

    @staticmethod
    def get_DB():   # Returns the database object
        if DBMeta.__db == None:
            DBMeta()
        return DBMeta.__db

    def __init__(self):   # If a database object allready exists...
        if DBMeta.__db != None:
            raise Exception("This class is a singleton.")  # throw an exception
        else:
            # Building up a connection to the database
            DBMeta.__instance = pymongo.MongoClient(DBMeta._path)
            # Instantiation of the database object
            DBMeta.__db = DBMeta.__instance["meta"]
