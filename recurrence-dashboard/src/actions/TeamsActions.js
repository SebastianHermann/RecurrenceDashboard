import axios from 'axios';

const GetTeams = () => async (dispatch) => {
  try {
    dispatch({
      type: 'TEAMS_LOADING',
    });

    const teams = await axios.get(`http://127.0.0.1:5000/teams`);
    console.log(teams.data);
    dispatch({
      type: 'TEAMS_SUCCESS',
      payload: teams.data,
    });
  } catch (e) {
    dispatch({
      type: 'TEAMS_FAIL',
    });
  }
};

export default GetTeams;
