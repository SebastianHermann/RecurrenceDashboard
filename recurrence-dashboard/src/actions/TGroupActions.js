import axios from 'axios';

export const GetTGroups = (request) => async (dispatch) => {
  try {
    dispatch({
      type: 'TGROUPS_LOADING',
    });
    console.log(request);
    const tGroups = await axios.get(
      `http://127.0.0.1:5000/tactical-groups/${request.project_id}`
    );

    dispatch({
      type: 'TGROUPS_SUCCESS',
      payload: tGroups.data,
    });
  } catch (e) {
    dispatch({
      type: 'TGROUPS_FAIL',
    });
  }
};

export const CreateTGroup = (request) => async (dispatch) => {
  try {
    dispatch({
      type: 'TGROUPS_LOADING',
    });

    let payload = {
      project_id: String(request.project_id),
      title: String(request.title),
      user_name: String(request.user_name),
      game_id: parseInt(request.game_id),
      player_list_1: request.player_list_1,
      player_list_2: request.player_list_2,
    };

    const projects = await axios.post(
      `http://localhost:5000/tactical-groups/${request.project_id}`,
      payload
    );

    dispatch({
      type: 'TGROUPS_SUCCESS',
      payload: projects.data,
    });
  } catch (e) {
    dispatch({
      type: 'TGROUPS_FAIL',
    });
  }
};

// export default GetProjects;
// export default CreateProject;
