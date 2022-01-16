from db.db_connection import DBConnection
from bson.json_util import loads, dumps
from bson.objectid import ObjectId


class Projects():
    collection = None

    def __init__(self):
        if Projects.collection != None:
            raise Exception("This class is a singleton.")
        else:
            Projects.collection = DBConnection.get_DB()[
                "projects"]

    @staticmethod
    def singleton():
        if Projects.collection == None:
            Projects()
        return Projects.collection

    @staticmethod
    def create_project(request_data, user_name="test"):
        project_collection = Projects.singleton()
        try:
            project = {}
            project["user_name"] = user_name
            project["game_id"] = request_data["game_id"]
            project["title"] = request_data["title"]
            project["game_result"] = request_data["game_result"]
            project["description"] = request_data.get("description", "")

            project_collection.insert_one(project)
            result = project_collection.find(
                {"user_name": user_name})
            json_str = dumps(result)

            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def get_project(id, user_name="test"):
        project_collection = Projects.singleton()
        try:
            if id == None:
                result = project_collection.find(
                    {"user_name": user_name})
                json_str = dumps(result)

                return json_str
            else:
                result = project_collection.find(
                    {"_id": ObjectId(id)})
                json_str = dumps(result)

                return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def delete_project(id, user_name="test"):
        project_collection = Projects.singleton()
        try:
            if id == None:
                project_collection.delete_many(
                    {"user_name": user_name})
            else:
                project_collection.delete_one(
                    {"_id": ObjectId(id)})

            result = project_collection.find(
                {"user_name": user_name})
            json_str = dumps(result)

            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def update_project(id, request_data, user_name="test"):
        project_collection = Projects.singleton()

        project = {}
        project["user_name"] = user_name
        project["game_id"] = request_data["game_id"]
        project["title"] = request_data["title"]
        project["game_result"] = request_data["game_result"]
        project["description"] = request_data.get("description", "")

        query = {"_id": ObjectId(id)}
        newvalues = {"$set": project}

        try:
            if id == None:
                return dumps({"Error": "Please specify the id of the project."})
            else:
                project_collection.update_one(query, newvalues)

            result = project_collection.find(
                {"user_name": user_name})
            json_str = dumps(result)

            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}
