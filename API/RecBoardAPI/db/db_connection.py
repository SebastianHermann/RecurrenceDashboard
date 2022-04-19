import pymongo
import os
from dotenv import load_dotenv

load_dotenv()

# Contains the configurations for the db-connection; e.g. database path
DB_CONNECTION = os.getenv('DB_CONNECTION')


class DBConnection():
    __instance = None
    __db = None
    _path = DB_CONNECTION

    @staticmethod
    def get_DB():   # Returns the database object
        if DBConnection.__db == None:
            DBConnection()
        return DBConnection.__db

    def __init__(self):
        if DBConnection.__db != None:   # If a database object allready exists...
            raise Exception("This class is a singleton.")  # throw an exception
        else:
            DBConnection.__instance = pymongo.MongoClient(
                DBConnection._path)   # Building up a connection to the database
            # Instantiation of the database object
            DBConnection.__db = DBConnection.__instance["recboard"]
