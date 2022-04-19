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


# The dataframe gets loaded once as soon as the flask-server starts to run
DF_FILEPATH = os.getenv('DF_FILEPATH')

app = Flask(__name__)
CORS(app)

start = time.time()
path_df = DF_FILEPATH
req_cols = ["game_id", "game_time_seconds",
            "mapped_id", "target_group_id", "x_norm", "y_norm"]     # Trimming the datas columns for faster processing results
df = pd.read_csv(path_df, index_col=None, sep=',',
                 decimal=".", usecols=req_cols)
print("Files Loaded:", time.time()-start)


@app.route('/', methods=["GET"])
def home():
    '''Home Route. Nothing special happens here.

    '''
    return "Welcome ", 200


@app.route('/teams', methods=["GET"])
def teams():
    '''Returns a teams cumulated tracking data of a specific game
    '''
    game_id = request.args.get('game_id', default=None)
    if request.method == "GET":
        result = MetaTeams.get_teams(game_id)

    return Response(result, mimetype='application/json')


@app.route('/meta/stats', methods=["GET"])
def stats():
    '''Returns the statistics of a game
    '''
    game_id = request.args.get('game_id', default=None)
    if request.method == "GET":
        result = MetaStats.get_stats(game_id)

    return Response(result, mimetype='application/json')


@app.route('/meta/events/<game_id>', methods=["GET"])
def meta_events(game_id):
    '''returns some automatically generated events of a game
    '''

    if request.method == "GET":
        result = MetaEvents.get_meta_events(game_id)

    return Response(result, mimetype='application/json')


@app.route('/meta/tracking', methods=["GET"])
def meta_tracking_data():
    '''returns tracking data. 
    However, the data, as of now, gets loaded rather once
    in memory for increasing the performance during the usage
    '''

    if request.method == "GET":
        game_id = request.args.get('game_id', default=None)
        result = MetaTrackingData.get_single_tracking_data(game_id, df)

    return Response(result, mimetype='application/json')


@app.route('/events/<project_id>', methods=["GET", "POST", "PUT", "DELETE"])
def events(project_id):
    '''Event Route
    Dynamic route for operations related to the events of a project.

    Args:
        :project_id: the id of the events project
    '''

    # Saving the @id parameter given via the URI
    id = request.args.get('event_id', default=None)

    if request.method == "GET":
        # Get all Events of a project or a specific event
        result = Events.get_events(id, project_id)

    if request.method == "POST":
        request_data = request.get_json()
        result = Events.create_event(
            request_data)          # Create a new Event

    if request.method == "PUT":
        request_data = request.get_json()
        # Overwrite an existing Event
        result = Events.update_event(id, request_data)

    if request.method == "DELETE":
        result = Events.delete_events(id, project_id)       # Delete an event

    return Response(result, mimetype='application/json')


@app.route('/tactical-groups/<project_id>', methods=["GET", "POST", "PUT", "DELETE"])
def tactical_groups(project_id):
    '''Tactical Group Route
    Dynamic route for operations related to the tactical groups of a project.

    Args:
        :project_id: the id of the tactical groups project
    '''
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
    '''Project Route
    route for operations related to the projects of a user.
    All CRUD operations are implemented. However, only the GET and
    POST are beeing actually used.

    Args:
        -
    '''
    id = request.args.get('project_id', default=None)
    user_name = request.args.get('user_name', default=None)

    if request.method == "GET":
        items = Projects.get_project(id, user_name)
        obj = json.loads(items)
        result = []
        for item in obj:
            meta_info = {}
            t_groups_amount = json.loads(TacticalGroups.get_t_groups(id,
                                                                     item["_id"]["$oid"]))
            meta_info["t_groups_amount"] = len(t_groups_amount)

            rp_amount = json.loads(RPS.get_rps_list(item["_id"]["$oid"], id))
            meta_info["rp_amount"] = len(rp_amount)

            result.append({**item, **meta_info})
        result = json.dumps(result)

    if request.method == "POST":
        request_data = request.get_json()
        items = Projects.create_project(request_data)
        obj = json.loads(items)
        result = []
        for item in obj:
            meta_info = {}
            t_groups_amount = json.loads(TacticalGroups.get_t_groups(id,
                                                                     item["_id"]["$oid"]))
            meta_info["t_groups_amount"] = len(t_groups_amount)

            rp_amount = json.loads(RPS.get_rps_list(item["_id"]["$oid"], id))
            meta_info["rp_amount"] = len(rp_amount)

            result.append({**item, **meta_info})
        result = json.dumps(result)

    if request.method == "PUT":
        request_data = request.get_json()
        result = Projects.update_project(id, request_data)

    if request.method == "DELETE":
        result = Projects.delete_project(id)

    return Response(result, mimetype='application/json')


@app.route('/rps/<project_id>', methods=["GET", "POST", "PUT", "DELETE"])
def recurrence_plots(project_id):
    '''Recurrence Plot Route
    Dynamic route for operations related to the recurrence plots of a project.

    GET: Returns a list with of all configurations and rqa/frps of a project.

    Args:
        :project_id: the id of the rps project
    '''

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
    '''Dynamic route for operations regardind the meta stable recurrence information

    '''

    if request.method == 'POST':
        request_data = request.get_json()
        result = RPS.create_meta_rp(df, request_data, rp_id)
    if request.method == 'GET':
        result = RPS.get_meta_rp(rp_id, df)

    return Response(result, mimetype='application/json')


@app.route('/rp/<id>', methods=["GET", "PUT"])
def recurrence_plot(id):
    '''Dynamic route for getting some information about one specific RP

    '''

    if request.method == 'GET':
        result = RPS.get_rp(id, df)

    if request.method == 'PUT':
        result = RPS.update_rp(id, df)

    return Response(result, mimetype='application/json')


@app.route('/rp/<id>/rqa', methods=["GET", "PUT"])
def rqa(id):
    '''Dynamic route for getting the rqas about one specific RP

    '''

    if request.method == 'GET':
        # return a list of the database object of the selected rp with its rqa-params
        result = RPS.get_rqa(id)

    return Response(result, mimetype='application/json')


app.run(debug=True)
