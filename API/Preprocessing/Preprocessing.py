import pandas as pd
import numpy as np
import csv
import json
from random import randint, choice

import random

# input_filepath = r'C:\Users\Sebastian Hermann\Documents\WI3\Masterthesis\WebApp\API\Data\Games.csv'
# output_filepath_1 = r'C:\Users\Sebastian Hermann\Documents\WI3\Masterthesis\WebApp\API\Data\Games1.json'
# output_filepath_2 = r'C:\Users\Sebastian Hermann\Documents\WI3\Masterthesis\WebApp\API\Data\Games.json'

# df = pd.read_csv(input_filepath)
# df.columns = df.columns.str.replace(' ','_')
# df = df[df["Game_Dscrptn"]=="Game01"]

# data=[]
# for i in range(0,100):

#     for j in range(0,100):
#         item = {}
#         item["x"] = i
#         item["y"] = j
#         item["z"] = random.randint(0, 1)
#         data.append(item)
test = np.zeros((100, 100))

data = {["test"]: test.tolist()}


jsonData = json.dumps(data)
open("test_rp2.json", "w").write(jsonData)


# df.to_json(output_filepath_1, orient="records")
