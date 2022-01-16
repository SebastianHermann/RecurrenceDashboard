import axios from 'axios';

export const GetProjects = () => async (dispatch) => {
  try {
    dispatch({
      type: 'PROJECTS_LOADING',
    });

    const projects = await axios.get(`http://127.0.0.1:5000/projects`);

    dispatch({
      type: 'PROJECTS_SUCCESS',
      payload: projects.data,
    });
  } catch (e) {
    dispatch({
      type: 'PROJECTS_FAIL',
    });
  }
};

export const CreateProject = (request) => async (dispatch) => {
  try {
    dispatch({
      type: 'PROJECTS_LOADING',
    });

    let payload = {
      user_name: String(request.user_name),
      game_id: parseInt(request.game_id),
      game_result: String(request.game_result),
      title: String(request.title),
    };

    const projects = await axios.post(
      `http://localhost:5000/projects`,
      payload
    );

    dispatch({
      type: 'PROJECTS_SUCCESS',
      payload: projects.data,
    });
  } catch (e) {
    dispatch({
      type: 'PROJECTS_FAIL',
    });
  }
};

// export default GetProjects;
// export default CreateProject;
