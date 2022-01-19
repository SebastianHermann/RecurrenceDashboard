from db.db_meta_connection import DBMeta
from bson.json_util import loads, dumps


class MetaStats():
    collection = None

    def __init__(self):
        if MetaStats.collection != None:
            raise Exception("This class is a singleton.")
        else:
            MetaStats.collection = DBMeta.get_DB()["stats"]

    @staticmethod
    def stats():
        if MetaStats.collection == None:
            MetaStats()
        return MetaStats.collection

    @staticmethod
    def get_stats(game_id):
        stats_collection = MetaStats.stats()

        try:
            if game_id:

                result = stats_collection.find({"game_id": int(game_id)})
                json_str = dumps(result)
            else:
                print("in else")
                result = stats_collection.find({})
                json_str = dumps(result)
            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}
