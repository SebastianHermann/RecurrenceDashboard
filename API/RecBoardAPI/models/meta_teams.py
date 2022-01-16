from db.db_meta_connection import DBMeta
from bson.json_util import loads, dumps


class MetaTeams():
    collection = None

    def __init__(self):
        if MetaTeams.collection != None:
            raise Exception("This class is a singleton.")
        else:
            MetaTeams.collection = DBMeta.get_DB()["teams"]

    @staticmethod
    def teams():
        if MetaTeams.collection == None:
            MetaTeams()
        return MetaTeams.collection

    @staticmethod
    def get_teams(game_id):
        team_collection = MetaTeams.teams()

        try:
            if game_id:

                result = team_collection.find({"game_id": int(game_id)})
                json_str = dumps(result)
            else:
                result = team_collection.find({})
                json_str = dumps(result)
            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}
