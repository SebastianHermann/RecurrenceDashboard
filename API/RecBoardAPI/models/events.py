from db.db_connection import DBConnection
from bson.json_util import loads, dumps
from bson.objectid import ObjectId


class Events():
    collection = None

    def __init__(self):
        if Events.collection != None:
            raise Exception("This class is a singleton.")
        else:
            Events.collection = DBConnection.get_DB()["events"]

    @staticmethod
    def singleton():
        if Events.collection == None:
            Events()
        return Events.collection

    @staticmethod
    def create_event(project_id, request_data, user_name="test"):
        event_collection = Events.singleton()

        try:
            event = {}
            event["project_id"] = project_id
            event["user_name"] = user_name
            event["game_id"] = request_data["game_id"]
            event["title"] = request_data["title"]
            event["description"] = request_data["description"]
            event["second"] = request_data["second"]
            event["source"] = request_data["source"]

            event_collection.insert_one(event)

            result = event_collection.find(
                {"project_id": request_data["project_id"], "user_name": user_name})
            json_str = dumps(result)
            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def get_events(id, project_id):
        event_collection = Events.singleton()

        try:
            if id == None:
                result = event_collection.find(
                    {"project_id": project_id})
                json_str = dumps(result)
                return json_str
            else:
                result = event_collection.find({"_id":  ObjectId(id)})
                json_str = dumps(result)
                return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def delete_events(id, project_id, user_name="test"):
        event_collection = Events.singleton()
        try:
            if id == None:
                event_collection.delete_many(
                    {"project_id": project_id, "user_name": user_name})
            else:
                event_collection.delete_one(
                    {"_id": ObjectId(id)})

            result = event_collection.find(
                {"project_id": project_id, "user_name": user_name})
            json_str = dumps(result)

            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def update_event(id, request_data, user_name="test"):
        event_collection = Events.singleton()

        event = {}
        event["project_id"] = request_data["project_id"]
        event["user_name"] = user_name
        event["game_id"] = request_data["game_id"]
        event["title"] = request_data["title"]
        event["description"] = request_data["description"]
        event["second"] = request_data["second"]
        event["source"] = request_data["source"]

        query = {"_id": ObjectId(id)}
        newvalues = {"$set": event}

        try:
            if id == None:
                return dumps({"Error": "Please specify the id of the tactical group."})
            else:
                event_collection.update_one(query, newvalues)

            result = event_collection.find(
                {"project_id": request_data["project_id"], "game_id": request_data["game_id"], "user_name": user_name})
            json_str = dumps(result)

            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}
