from db.db_meta_connection import DBMeta
from bson.json_util import loads, dumps


class MetaEvents():
    collection = None

    def __init__(self):
        if MetaEvents.collection != None:
            raise Exception("This class is a singleton.")
        else:
            MetaEvents.collection = DBMeta.get_DB()["events"]

    @staticmethod
    def singleton():
        if MetaEvents.collection == None:
            MetaEvents()
        return MetaEvents.collection

    @staticmethod
    def get_meta_events(game_id):
        event_collection = MetaEvents.singleton()

        try:
            result = event_collection.find({"game_id": game_id})
            json_str = dumps(result)
            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}
