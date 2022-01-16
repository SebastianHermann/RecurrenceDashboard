from db.db_meta_connection import DBMeta
from bson.json_util import loads, dumps
import pandas as pd


class MetaTrackingData():
    collection = None

    def __init__(self):
        if MetaTrackingData.collection != None:
            raise Exception("This class is a singleton.")
        else:
            MetaTrackingData.collection = DBMeta.get_DB()["tracking_data"]

    @staticmethod
    def singleton():
        if MetaTrackingData.collection == None:
            MetaTrackingData()
        return MetaTrackingData.collection

    @staticmethod
    def get_tracking_data(request_data):
        tracking_data_collection = MetaTrackingData.singleton()

        game_id = request_data["game_id"]
        mapped_id_list = request_data["mapped_id_list"]
        target_group_id = request_data["target_group_id_list"]
        second_1 = request_data["second_1"]
        second_2 = request_data["second_2"]
        range_value = request_data["range_value"]

        cond_game = {"game_id": {"$in": game_id}} if len(game_id) > 0 else {}
        cond_players = {"mapped_id": {"$in": mapped_id_list}} if len(
            mapped_id_list) > 0 else {}
        cond_groups = {"target_group_id": {"$in": target_group_id}} if len(
            target_group_id) > 0 else {}

        cond_seconds_gt_1 = {"game_time_seconds": {
            "$gt": second_1-range_value}}
        cond_seconds_lt_1 = {"game_time_seconds": {
            "$lt": second_1+range_value+1}}
        cond_seconds_gt_2 = {"game_time_seconds": {
            "$gt": second_2-range_value}}
        cond_seconds_lt_2 = {"game_time_seconds": {
            "$lt": second_2+range_value+1}}

        query_1 = {"$and": [cond_game, cond_players,
                            cond_groups, cond_seconds_gt_1, cond_seconds_lt_1]}
        query_2 = {"$and": [cond_game, cond_players,
                            cond_groups, cond_seconds_gt_2, cond_seconds_lt_2]}
        try:
            result_1 = tracking_data_collection.find(query_1)
            result_2 = tracking_data_collection.find(query_2)

            result_list = []

            for i in range(range_value*2):
                frame = {}
                frame["index"] = i
                frame["players_1"] = []
                frame["players_2"] = []
                result_list.append(frame)

            for item in result_1:
                game_seconds = item["game_time_seconds"]
                index = game_seconds-second_1+range_value
                result_list[index-1]["players_1"].append(item)

            for item in result_2:
                game_seconds = item["game_time_seconds"]
                index = game_seconds-second_2+range_value
                result_list[index-1]["players_2"].append(item)

            json_str = dumps(result_list)
            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}

    @staticmethod
    def get_single_tracking_data(request_data, df):
        game_id = int(request_data)

        # target_group_1 = request_data["target_group_1"]
        # target_group_2 = request_data["target_group_2"]

        # pre filter the data frame
        df_game = df[df["game_id"] == game_id]
        # df_group_1 = df_game[df_game["target_group_id"]==1 & df_game["mapped_id"].is_in(target_group_1)]
        # df_group_2 = df_game[df_game["target_group_id"]==2 & df_game["mapped_id"].is_in(target_group_2)]
        # df_group_3 = df_game[df_game["target_group_id"]==3]

        # df_game = pd.concat(df_group_1,df_group_2,df_group_3)

        result = df_game.groupby('game_time_seconds')[
            ['mapped_id', 'target_group_id', "x_norm", "y_norm"]].apply(lambda g: g.values.tolist()).to_dict()
        result_list = []
        for item in result.keys():
            second = {}
            second["index"] = item
            player_list_1 = []
            player_list_2 = []
            ball_list = []
            for player in result[item]:
                p = {}
                p["mapped_id"] = player[0]
                p["target_group_id"] = player[1]
                p["x_norm"] = player[2]
                p["y_norm"] = player[3]
                if player[1] == 1:
                    player_list_1.append(p)
                elif player[1] == 2:
                    player_list_2.append(p)
                else:
                    ball_list.append(p)
            second["player_list_1"] = player_list_1
            second["player_list_2"] = player_list_2
            second["ball_list"] = ball_list
            result_list.append(second)

        try:
            json_str = dumps(result_list)
            return json_str

        except Exception as e:
            print("An exception occurred ::", e)
            return {"Error": e}
