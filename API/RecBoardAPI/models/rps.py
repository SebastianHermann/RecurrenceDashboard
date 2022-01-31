from helper.frp_prep import create_meta_stable_rp
from db.db_connection import DBConnection
from helper.rp_prep import prep_recurrence_plot, prep_cross_recurrence_plot, create_recurrence_plot
from helper.rqa_prep import get_rqas
from bson.json_util import loads, dumps
from bson.objectid import ObjectId
import time

from threading import Thread


class Compute(Thread):
    def __init__(self, rp_id, rp_original, rps_collection):
        Thread.__init__(self)
        self.rp_id = rp_id
        self.rp_original = rp_original
        self.rps_collection = rps_collection

    def run(self):
        rqa = get_rqas(self.rp_original, self.rps_collection, self.rp_id)
        query = {"_id": ObjectId(self.rp_id)}
        newvalues = {"$set": {"rqa": rqa}}
        self.rps_collection.update_one(query, newvalues)
        print("Thread closed")


class RPS():

    collection = None

    def __init__(self):
        if RPS.collection != None:
            raise Exception("This class is a singleton.")
        else:
            RPS.collection = DBConnection.get_DB()["rps"]

    @staticmethod
    def singleton():
        if RPS.collection == None:
            RPS()
        return RPS.collection

    @staticmethod
    def create_rp(data, request_data):

        start = time.time()
        rps_collection = RPS.singleton()

        try:
            user_name = request_data.get("user_name", "Test")
            game_id = request_data.get("game_id")
            project_id = request_data.get("project_id")
            rp_type = request_data.get("rp_type", "threshold")
            rp_title = request_data.get(
                "rp_title", "RP (" + rp_type + ") of")
            threshold = request_data.get("threshold", 9)
            calc_logic = request_data.get("calc_logic", "avg")
            target_tactical_group_id = request_data.get(
                "target_tactical_group_id", "")
            target_group_1 = request_data.get("target_group_1", [])
            target_group_2 = request_data.get("target_group_2", [])
            cross_tactical_group_id = request_data.get(
                "cross_tactical_group_id", "")
            cross_group_1 = request_data.get("cross_group_1", [])
            cross_group_2 = request_data.get("cross_group_2", [])
            mirror_cord = request_data.get("mirror_cord", True)
            downsample = request_data.get("downsample", 10)
            favourite = request_data.get("favourite", False)
            rqa = {}

            rp_meta = {
                "user_name": user_name,
                "game_id": game_id,
                "project_id": project_id,
                "rp_title": rp_title,
                "rp_type": rp_type,
                "threshold": threshold,
                "calc_logic": calc_logic,
                "target_tactical_group_id": target_tactical_group_id,
                "target_group_1": target_group_1,
                "target_group_2": target_group_2,
                "cross_tactical_group_id": cross_tactical_group_id,
                "cross_group_1": cross_group_1,
                "cross_group_2": cross_group_2,
                "mirror_cord": mirror_cord,
                "downsample": downsample,
                "favourite": favourite,
                "rqa": rqa
            }

            df_target = prep_recurrence_plot(data, rp_meta)
            df_cross = None
            if "cross" in rp_type:
                df_cross = prep_cross_recurrence_plot(data, rp_meta)

            rp, rp_original = create_recurrence_plot(
                rp_meta, df_target, df_cross)

            rp_id = rps_collection.insert_one(rp_meta).inserted_id
            # allRps = rps_collection.find({"project_id": project_id})<
            result = rps_collection.find_one({"_id": ObjectId(rp_id)})

            # Calculation for the rqa metrics
            if "threshold" in rp_meta["rp_type"] or "cross" in rp_meta["rp_type"]:
                thread_a = Compute(rp_id, rp_original, rps_collection)
                thread_a.start()

            json_str = dumps({**result, "data": rp.tolist()})
            print("RP created, RQA are calculated simultaneously", time.time()-start)

            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def get_rps_list(project_id, id=None):
        rps_collection = RPS.singleton()

        try:
            if id == None:
                result = rps_collection.find({"project_id": project_id})
                json_str = dumps(result)
                return json_str
            else:
                result = rps_collection.find_one({"_id":  ObjectId(id)})
                rp_meta = dumps(result)
                return rp_meta

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def get_rp(id, data):
        rps_collection = RPS.singleton()
        start = time.time()
        try:
            result = rps_collection.find_one({"_id":  ObjectId(id)})
            rp_meta = dict(result)

            df_target = prep_recurrence_plot(data, rp_meta)
            df_cross = None
            if "cross" in rp_meta.get("rp_type"):
                df_cross = prep_cross_recurrence_plot(data, rp_meta)

            rp, rp_original = create_recurrence_plot(
                rp_meta, df_target, df_cross)
            # rqa does not has to explictly calculated
            print(time.time()-start)
            return dumps({**rp_meta, "data": rp.tolist()})

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def delete_rp_infos(project_id, id=None):
        rps_collection = RPS.singleton()
        try:
            if id == None:

                rps_collection.delete_many(
                    {"project_id": project_id})
            else:
                rps_collection.delete_one(
                    {"_id": ObjectId(id)})

            result = rps_collection.find(
                {"project_id": project_id})
            json_str = dumps(result)

            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def update_rp(id, request_data):
        rps_collection = RPS.singleton()
        try:
            user_name = request_data.get("user_name", "Test")
            game_id = request_data.get("game_id")
            project_id = request_data.get("project_id")
            rp_type = request_data.get("rp_type", "threshold")
            rp_title = request_data.get(
                "rp_title", "RP (" + rp_type + ") of ")
            threshold = request_data.get("threshold", 9)
            calc_logic = request_data.get("calc_logic", "avg")
            target_group_1 = request_data.get("target_group_1", [])
            target_group_2 = request_data.get("target_group_2", [])
            cross_group_1 = request_data.get("cross_group_1", [])
            cross_group_2 = request_data.get("cross_group_2", [])
            mirror_cord = request_data.get("mirror_cord", True)
            downsample = request_data.get("downsample", 10)
            favourite = request_data.get("favourite", False)
            rqa = request_data.get("rqa", {})

            rp_meta = {
                "user_name": user_name,
                "game_id": game_id,
                "project_id": project_id,
                "rp_title": rp_title,
                "rp_type": rp_type,
                "threshold": threshold,
                "calc_logic": calc_logic,
                "target_group_1": target_group_1,
                "target_group_2": target_group_2,
                "cross_group_1": cross_group_1,
                "cross_group_2": cross_group_2,
                "mirror_cord": mirror_cord,
                "downsample": downsample,
                "favourite": favourite,
                "rqa": rqa
            }

            query = {"_id": ObjectId(id)}
            newvalues = {"$set": rp_meta}
            rps_collection.update_one(query, newvalues)

            result = rps_collection.find(
                {"project_id": project_id})
            json_str = dumps(result)

            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def create_meta_rp(data, request_data):

        start = time.time()
        rps_collection = RPS.singleton()

        meta_rp_thrshld = 18
        min_rec_points = 0.2
        white_space_width = 45

        try:
            user_name = request_data.get("user_name", "Test")
            game_id = request_data.get("game_id")
            project_id = request_data.get("project_id")
            rp_type = request_data.get("rp_type", "threshold")
            rp_title = request_data.get(
                "rp_title", "RP (" + rp_type + ") of")
            # threshold = request_data.get("threshold", 9)
            calc_logic = request_data.get("calc_logic", "avg")
            target_tactical_group_id = request_data.get(
                "target_tactical_group_id", "")
            target_group_1 = request_data.get("target_group_1", [])
            target_group_2 = request_data.get("target_group_2", [])
            cross_tactical_group_id = request_data.get(
                "cross_tactical_group_id", "")
            cross_group_1 = request_data.get("cross_group_1", [])
            cross_group_2 = request_data.get("cross_group_2", [])
            mirror_cord = request_data.get("mirror_cord", True)
            downsample = request_data.get("downsample", 10)
            favourite = request_data.get("favourite", False)
            rqa = {}

            rp_meta = {
                "user_name": user_name,
                "game_id": game_id,
                "project_id": project_id,
                "rp_title": rp_title,
                "rp_type": rp_type,
                "threshold": meta_rp_thrshld,
                "calc_logic": calc_logic,
                "target_tactical_group_id": target_tactical_group_id,
                "target_group_1": target_group_1,
                "target_group_2": target_group_2,
                "cross_tactical_group_id": cross_tactical_group_id,
                "cross_group_1": cross_group_1,
                "cross_group_2": cross_group_2,
                "mirror_cord": mirror_cord,
                "downsample": downsample,
                "favourite": favourite,
                "rqa": rqa
            }

            df_target = prep_recurrence_plot(data, rp_meta)
            df_cross = None
            if "cross" in rp_type:
                df_cross = prep_cross_recurrence_plot(data, rp_meta)

            rp, rp_original = create_recurrence_plot(
                rp_meta, df_target, df_cross)

            # rp_id = rps_collection.insert_one(rp_meta).inserted_id
            # # allRps = rps_collection.find({"project_id": project_id})<
            # result = rps_collection.find_one({"_id": ObjectId(rp_id)})

            # Calculation for the rqa metrics
            # if "threshold" in rp_meta["rp_type"] or "cross" in rp_meta["rp_type"]:
            #     thread_a = Compute(rp_id, rp_original, rps_collection)
            #     thread_a.start()

            # json_str = dumps({**result, "data": rp.tolist()})
            [meta_rp, meta_rp_rec] = create_meta_stable_rp(
                rp_original, min_rec_points, white_space_width)
            [meta_rp_down, meta_rp_rec_down] = create_meta_stable_rp(
                rp, min_rec_points, white_space_width)
            json_str = dumps({"rp": rp.tolist(), "meta_rp": meta_rp.tolist(
            ), "meta_rp_rec": meta_rp_rec.tolist(), "meta_rp_down": meta_rp_down.tolist(), "meta_rp_rec_down": meta_rp_rec_down.tolist()})
            # print("RP created, RQA are calculated simultaneously", time.time()-start)

            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def get_rqa(id):
        rps_collection = RPS.singleton()

        result = rps_collection.find_one({"_id":  ObjectId(id)})
        json_str = dumps(result)
        return json_str
