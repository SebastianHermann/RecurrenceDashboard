from db.db_connection import DBConnection
from bson.json_util import loads, dumps
from bson.objectid import ObjectId


class TacticalGroups():
    collection = None

    def __init__(self):
        if TacticalGroups.collection != None:
            raise Exception("This class is a singleton.")
        else:
            TacticalGroups.collection = DBConnection.get_DB()[
                "tactical-groups"]

    @staticmethod
    def singleton():
        if TacticalGroups.collection == None:
            TacticalGroups()
        return TacticalGroups.collection

    @staticmethod
    def create_t_group(project_id, request_data, user_name="test"):
        t_group_collection = TacticalGroups.singleton()

        try:
            if id == None:
                return dumps({"Error": "Please specify the id of the project group."})
            else:
                tactical_group = {}
                tactical_group["project_id"] = project_id
                tactical_group["user_name"] = user_name
                tactical_group["game_id"] = int(request_data["game_id"])
                tactical_group["title"] = request_data["title"]
                tactical_group["player_list_1"] = request_data["player_list_1"]
                tactical_group["player_list_2"] = request_data["player_list_2"]

                t_group_collection.insert_one(tactical_group)
                result = t_group_collection.find(
                    {"project_id": project_id, "user_name": user_name})
                json_str = dumps(result)

                return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def get_t_groups(id, project_id, user_name="test"):
        t_group_collection = TacticalGroups.singleton()
        try:
            if id == None:
                result = t_group_collection.find(
                    {"project_id": project_id, "user_name": user_name})
                json_str = dumps(result)

                return json_str
            else:
                result = t_group_collection.find(
                    {"_id": ObjectId(id)})
                json_str = dumps(result)

                return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def count_t_groups(id, user_name="test"):
        t_group_collection = TacticalGroups.singleton()
        try:
            result = t_group_collection.countDocuments(
                {"_id": ObjectId(id)})
            json_str = dumps(result)
            print(json_str)

            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def delete_t_groups(id, project_id, user_name="test"):
        t_group_collection = TacticalGroups.singleton()
        try:
            if id == None:
                t_group_collection.delete_many(
                    {"project_id": project_id, "user_name": user_name})
            else:
                t_group_collection.delete_one(
                    {"_id": ObjectId(id)})

            result = t_group_collection.find(
                {"project_id": project_id, "user_name": user_name})
            json_str = dumps(result)

            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def update_t_groups(id, request_data, user_name="test"):
        t_group_collection = TacticalGroups.singleton()

        tactical_group = {}
        tactical_group["project_id"] = request_data["project_id"]
        tactical_group["user_name"] = user_name
        tactical_group["game_id"] = request_data["game_id"]
        tactical_group["title"] = request_data["title"]
        tactical_group["player_list_1"] = request_data["player_list_1"]
        tactical_group["player_list_2"] = request_data["player_list_2"]

        query = {"_id": ObjectId(id)}
        newvalues = {"$set": tactical_group}

        try:
            if id == None:
                return dumps({"Error": "Please specify the id of the tactical group."})
            else:
                t_group_collection.update_one(query, newvalues)

            result = t_group_collection.find(
                {"project_id": request_data["project_id"], "user_name": user_name})
            json_str = dumps(result)

            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}
