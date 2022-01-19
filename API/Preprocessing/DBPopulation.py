import pymongo
import pandas as pd
from bson.json_util import loads, dumps
from bson.objectid import ObjectId
import time
import numpy as np
from scipy.spatial import distance_matrix
from db_meta_connection import DBMeta

import os
from dotenv import load_dotenv

start = time.time()
# def create_relative_matrix(df):
#     df = df[["x_norm", "y_norm"]]

#     df_a = df[['x_norm', 'y_norm']].to_numpy()
#     df_b = df[['x_norm', 'y_norm']].to_numpy()

#     player_matrix = distance_matrix(df_a, df_b)
#     return player_matrix


# def create_thrshld_matrix(rec_mat_rel, threshold):
#     rec_mat_norm = (rec_mat_rel < threshold).astype(int)
#     return rec_mat_norm


path = r'C:/Users/Sebastian Hermann/Documents/WI3/Masterthesis/WebApp/API/Data/GameStats.csv'
# req_cols = ["game_id", "game_time_seconds",
#             "mapped_id", "target_group_id", "x_norm", "y_norm"]
df = pd.read_csv(path, index_col=None, sep=',', decimal=".")

df_stats_dict = df.to_dict("records")


# load_dotenv()

# DB_CONNECTION_META = os.getenv('DB_CONNECTION_META')
# pymongo.MongoClient(DBMeta._path)


STATS = DBMeta.get_DB()["stats"]

for row in df_stats_dict:
    STATS.insert_one(row)


# print("Files Loaded:", time.time()-start)

# player_filter_1 = [9, 10]
# group_filter_1 = [1]
# game_filter = [1]

# df_1 = df[df['game_id'].isin(game_filter)
#           & df['mapped_id'].isin(player_filter_1)
#           & df['target_group_id'].isin(group_filter_1)]

# print("Files filtered:", time.time()-start)
# player_filter_2 = []
# group_filter_2 = []

# df_result = df_1.groupby(
#     ["game_time_seconds"], as_index=False).mean()
# print("Files grouped:", time.time()-start)

# rp_test = create_relative_matrix(df_result)
# print("Relative RP created:", time.time()-start)
# threshold = 9
# rp_thrsld_test = create_thrshld_matrix(rp_test, threshold)
# print("Threshold RP created:", time.time()-start)
# # print("Length:", len(rp_thrsld_test))


# # print(time.time() - start, " : File in Data Frame")
# # df_teams_fh_sh = df.groupby(
# #     ["game_id", "target_group_id", "mapped_id", "Halftime"], as_index=False).mean()
# # df_teams_full = df.groupby(
# #     ["game_id", "target_group_id", "mapped_id"], as_index=False).mean()
# # df_teams_full["Halftime"] = "full"

# # df_teams = df_teams_fh_sh.append(df_teams_full)
# # df = df[["game_id", "mapped_id", "target_group_id", "x_norm",
# #          "y_norm", "game_time_seconds", "Second_of_game"]]
# print("Connection built:", time.time()-start)

# record = {}
# record["project_id"] = 1
# record["rp_type"] = "thrshld"
# record["game"] = game_filter
# record["downsample_size"] = None
# record["data"] = rp_thrsld_test.tolist()
# print("Record created:", time.time()-start)

# rps.delete_many({})
# print("Record inserted:", time.time()-start)


# # rp_meta = {
# #     "_id": "abc",
# #     "game_id": 1,
# #     "project_id": 1,
# #     "rp_title": "first",
# #     "rp_type": ["thrshld", "cross", "relative", "absolute"],
# #     "threshold": 9,
# #     "target_group_1_mapped_id_list": [],
# #     "target_group_2_mapped_id_list": [],
# #     "cross_group_1_mapped_id_list": [],
# #     "cross_group_2_mapped_id_list": [],
# #     "downsample": {
# #         "is_downsampled": False,
# #         "downsample_size": 10
# #     },
# #     "favourite": False
# # }

# # def df_query_builder(df, rp_meta):


# #     return


# # df.to_dict('records')
# # tracking_data.delete_many({})
# # projects = db["projects"]
# # second_1 = 101
# # second_2 = 501
# # range_value = 60


# # result_1 = tracking_data.find({"game_id": 1, "mapped_id": 5, "target_group_id": 1,
# #                                "$and": [{"game_time_seconds": {"$gt": 10-2}},
# #                                         {"game_time_seconds": {"$lt": 10+3}}]})

# # result_2 = tracking_data.find({"game_id": 1, "mapped_id": 5, "target_group_id": 1,
# #                                "$and": [{"game_time_seconds": {"$gt": second_2-range_value}},
# #                                         {"game_time_seconds": {"$lt": second_2+range_value}}]})


# # # test = result_1[0]
# # print(list(result_1))

# # print(time.time() - start, " : Query done")
# # result_list = []

# # for i in range(range_value*2):
# #     frame = {}
# #     frame["index"] = i
# #     frame["players_1"] = []
# #     frame["players_2"] = []
# #     result_list.append(frame)
# # print(time.time() - start, " : Empty Array prepared")

# # for item in result_1:
# #     game_seconds = item["game_time_seconds"]
# #     index = game_seconds-second_1+range_value
# #     result_list[index-1]["players_1"].append(item)

# # for item in result_2:
# #     game_seconds = item["game_time_seconds"]
# #     index = game_seconds-second_2+range_value
# #     result_list[index-1]["players_2"].append(item)
# # game = {"game_id": {"$in": [2]}} if 2 < 0 else {}
# # players = {"mapped_id": {"$in": [1]}} if 2 < 0 else {}
# # groups = {"Second_of_game": {"$in": [1]}} if 2 < 0 else {}

# # query = {"$and": [game, players, groups]}


# # result = tracking_data.find(query)
# # print(list(result))
# # result = projects.find({})
# # print(list(result))

# rp_meta = {
#     "game_id": 1,
#     "project_id": 1,
#     "rp_title": "first",
#     "rp_type": "cross_threshold",
#     "threshold": 9,
#     "calc_logic": "avg",
#     "target_group_1_mapped_id_list": [5],
#     "target_group_2_mapped_id_list": [],
#     "cross_group_1_mapped_id_list": [],
#     "cross_group_2_mapped_id_list": [3],
#     "mirror_cord": True,
#     "downsample": {
#         "is_downsampled": False,
#         "downsample_size": 10
#     },
#     "favourite": False
# }

# {
#     "user_name": "test",
#     "game_id": 1,
#     "project_id": 1,
#     "rp_title": "First via api",
#                 "rp_type": "threshold",
#                 "threshold": 9,
#                 "calc_logic": "avg",
#                 "target_group_1": [5, 9, 10],
#                 "target_group_2": [5, 9, 10],
#                 "cross_group_1": [],
#                 "cross_group_2": [],
#                 "mirror_cord": True,
#                 "downsample": 10,
#                 "favourite": False,
#                 "rqa": {}
# }

# # rp_id = rps.insert_one(rp_meta).inserted_id
# result = rps.find_one({"_id":  ObjectId("61d87e808f948f31d67e5a95")})
# json_str = dumps(result)
# print(json_str)
print(time.time() - start, " : All Files processed")
# print(tracking_data.count_documents({}))
# client.close()
