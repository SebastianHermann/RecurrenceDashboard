import axios from 'axios';

export const GetEvents = (project_id) => async (dispatch) => {
  try {
    dispatch({
      type: 'EVENTS_LOADING',
    });

    const events = await axios.get(
      `http://127.0.0.1:5000/events/${project_id}`
    );

    dispatch({
      type: 'EVENTS_SUCCESS',
      payload: events.data,
    });
  } catch (e) {
    dispatch({
      type: 'EVENTS_FAIL',
    });
  }
};

export const CreateEvent = (request) => async (dispatch) => {
  try {
    dispatch({
      type: 'EVENTS_LOADING',
    });

    let payload = {
      project_id: String(request.project_id),
      game_id: parseInt(request.game_id),
      second: parseInt(request.second),
      title: String(request.title),
      description: String(request.description),
    };

    const events = await axios.post(
      `http://localhost:5000/events/${request.project_id}`,
      payload
    );

    dispatch({
      type: 'EVENTS_SUCCESS',
      payload: events.data,
    });
  } catch (e) {
    dispatch({
      type: 'EVENTS_FAIL',
    });
  }
};

// export default GetProjects;
// export default CreateProject;
