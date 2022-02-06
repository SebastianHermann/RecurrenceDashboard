import json
from models.meta_stats import MetaStats
from models.rps import RPS
from models.meta_tracking_data import MetaTrackingData
from models.events import Events
from models.meta_events import MetaEvents
from models.projects import Projects
from flask import Flask, request, jsonify, Response
from models.meta_teams import MetaTeams
from models.tactical_groups import TacticalGroups
import pandas as pd
import time
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

DF_FILEPATH = os.getenv('DF_FILEPATH')

app = Flask(__name__)
CORS(app)

start = time.time()
path_df = DF_FILEPATH
req_cols = ["game_id", "game_time_seconds",
            "mapped_id", "target_group_id", "x_norm", "y_norm"]
df = pd.read_csv(path_df, index_col=None, sep=',',
                 decimal=".", usecols=req_cols)
print("Files Loaded:", time.time()-start)


@app.route('/', methods=["GET"])
def home():
    # Test streaming
    # print("request income")
    # time.sleep(5)
    # print("function done")
    # thread_a = Compute(request.__copy__())
    # thread_a.start()

    return "Welcome ", 200


@app.route('/teams', methods=["GET"])
def teams():
    game_id = request.args.get('game_id', default=None)
    if request.method == "GET":
        result = MetaTeams.get_teams(game_id)

    return Response(result, mimetype='application/json')


@app.route('/meta/stats', methods=["GET"])
def stats():
    game_id = request.args.get('game_id', default=None)
    if request.method == "GET":
        result = MetaStats.get_stats(game_id)

    return Response(result, mimetype='application/json')


@app.route('/meta/events/<game_id>', methods=["GET"])
def meta_events(game_id):

    if request.method == "GET":
        result = MetaEvents.get_meta_events(game_id)

    return Response(result, mimetype='application/json')


@app.route('/meta/tracking', methods=["GET"])
def meta_tracking_data():

    if request.method == "GET":
        game_id = request.args.get('game_id', default=None)
        # request_data = request.get_json()
        # print("request", request_data)
        result = MetaTrackingData.get_single_tracking_data(game_id, df)

    return Response(result, mimetype='application/json')


@app.route('/events/<project_id>', methods=["GET", "POST", "PUT", "DELETE"])
def events(project_id):
    id = request.args.get('event_id', default=None)

    if request.method == "GET":
        result = Events.get_events(id, project_id)

    if request.method == "POST":
        request_data = request.get_json()
        result = Events.create_event(request_data)

    if request.method == "PUT":
        request_data = request.get_json()
        result = Events.update_event(id, request_data)

    if request.method == "DELETE":
        result = Events.delete_events(id, project_id)

    return Response(result, mimetype='application/json')


@app.route('/tactical-groups/<project_id>', methods=["GET", "POST", "PUT", "DELETE"])
def tactical_groups(project_id):
    id = request.args.get('t_group_id', default=None)

    if request.method == "GET":
        result = TacticalGroups.get_t_groups(id, project_id)

    if request.method == "POST":
        request_data = request.get_json()
        result = TacticalGroups.create_t_group(project_id, request_data)

    if request.method == "PUT":
        request_data = request.get_json()
        result = TacticalGroups.update_t_groups(id, project_id, request_data)

    if request.method == "DELETE":
        result = TacticalGroups.delete_t_groups(id, project_id)

    return Response(result, mimetype='application/json')


@app.route('/projects', methods=["GET", "POST", "PUT", "DELETE"])
def projects():
    id = request.args.get('project_id', default=None)
    user_name = request.args.get('user_name', default=None)

    if request.method == "GET":
        result = Projects.get_project(id, user_name)

    if request.method == "POST":
        request_data = request.get_json()
        result = Projects.create_project(request_data)

    if request.method == "PUT":
        request_data = request.get_json()
        result = Projects.update_project(id, request_data)

    if request.method == "DELETE":
        result = Projects.delete_project(id)

    return Response(result, mimetype='application/json')


@app.route('/rps/<project_id>', methods=["GET", "POST", "PUT", "DELETE"])
def recurrence_plots(project_id):

    if request.method == 'GET':
        id = request.args.get('rp_id', default=None)
        request_data = request.get_json()
        result = RPS.get_rps_list(project_id, id)

    if request.method == 'POST':
        request_data = request.get_json()
        result = RPS.create_rp(df, request_data)

    if request.method == 'DELETE':
        id = request.args.get('rp_id', default=None)
        # request_data = request.get_json()
        result = RPS.delete_rp_infos(project_id, id)

    return Response(result, mimetype='application/json')


@app.route('/rp/<rp_id>/meta', methods=["GET", "POST", "PUT", "DELETE"])
def recurrence_plots_meta(rp_id):

    if request.method == 'POST':
        request_data = request.get_json()
        result = RPS.create_meta_rp(df, request_data, rp_id)
    if request.method == 'GET':
        result = RPS.get_meta_rp(rp_id, df)

    return Response(result, mimetype='application/json')


@app.route('/rp/<id>', methods=["GET", "PUT"])
def recurrence_plot(id):

    if request.method == 'GET':
        result = RPS.get_rp(id, df)

    if request.method == 'PUT':
        result = RPS.update_rp(id, df)

    return Response(result, mimetype='application/json')


@app.route('/rp/<id>/rqa', methods=["GET", "PUT"])
def rqa(id):

    if request.method == 'GET':
        # return a list of the database object of the selected rp with its rqa-params
        result = RPS.get_rqa(id)

    return Response(result, mimetype='application/json')


app.run(debug=True)
