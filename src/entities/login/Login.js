import React, { useEffect } from 'react';
import './Login.scss';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import { Box, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
import { setUserCookie, deleteUserCookie } from '../../helpers/cookieHelper';
import { adjectives, nouns } from '../../helpers/guestNameHelper';

const Login = props => {
  const randomSelection = '(Random)';

  const [adjective, setAdjective] = React.useState(
    props.user?.prefAdjective ? props.user?.prefAdjective : randomSelection
  );
  const [noun, setNoun] = React.useState(props.user?.prefNoun ? props.user?.prefNoun : randomSelection);
  let adjectivesList = adjectives;
  !adjectivesList.includes(randomSelection) && adjectivesList.sort().unshift(randomSelection);
  let nounsList = nouns;
  !nounsList.includes(randomSelection) && nounsList.sort().unshift(randomSelection);

  useEffect(() => {
    if (props.user) {
      setAdjective(props.user.prefAdjective ? props.user.prefAdjective : randomSelection);
      setNoun(props.user.prefNoun ? props.user.prefNoun : randomSelection);
    }
  }, [props.user]);

  const login = useGoogleLogin({
    onSuccess: userResponse => {
      onSuccessfulLogin(userResponse);
    },
    onError: error => console.log('Login Failed:', error),
  });

  const logOut = () => {
    googleLogout();
    deleteUserCookie();
    props.onUserLogout();
  };

  const onSuccessfulLogin = response => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${response.access_token}`, {
        headers: {
          Authorization: `Bearer ${response.access_token}`,
          Accept: 'application/json',
        },
      })
      .then(res => {
        onSuccessfulUserInfo(res);
      })
      .catch(err => console.log(err));
  };

  const onSuccessfulUserInfo = userInfoResponse => {
    setUserCookie(userInfoResponse.data);
    props.onUserLogin(userInfoResponse.data);
  };

  const handleAdjectiveChange = event => {
    const newAdjective = event.target.value === randomSelection ? null : event.target.value;
    setAdjective(event.target.value);
    updateUserPreferences(newAdjective, noun === randomSelection ? null : noun);
  };

  const handleNounChange = event => {
    const newNoun = event.target.value === randomSelection ? null : event.target.value;
    setNoun(event.target.value);
    updateUserPreferences(adjective === randomSelection ? null : adjective, newNoun);
  };

  const updateUserPreferences = (adjective, noun) => {
    const userPreferences = {
      userId: props.user.id,
      adjective,
      noun,
    };
    props.socket.emit('updateUserPreferences', userPreferences);
    props.onUpdateUserPreferences(userPreferences);
  };

  return props.user ? (
    <div className="login">
      <div className="header">
        <div className="header-title">Join the fun!</div>
        <div className="header-subtitle">Please</div>
      </div>
      <div className="user-info">
        <div className="user-info__item">
          <div className="user-info__item-label">Email:</div>
          <div className="user-info__item-value">{props.user.email}</div>
        </div>
        <div className="user-info__item">
          <div className="user-info__item-label">Preferred in-game name:</div>
          <div className="user-info__item-value">
            <span>The</span>
            <Box sx={{ minWidth: 150, maxHeight: 50 }} className="user-info__item-value__dropdown">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Adjective</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={adjective}
                  label="adjective"
                  onChange={handleAdjectiveChange}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 250 } } }}
                >
                  {adjectivesList.map((adjective, index) => (
                    <MenuItem value={adjective} key={index}>
                      {adjective}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ minWidth: 150 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Noun</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={noun}
                  label="Age"
                  onChange={handleNounChange}
                  MenuProps={{ PaperProps: { sx: { maxHeight: 250 } } }}
                >
                  {nounsList.map((noun, index) => (
                    <MenuItem value={noun} key={index}>
                      {noun}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>
        <div className="user-info__item">
          <div className="user-info__item__logout-btn" onClick={logOut}>
            Log out
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="login">
      <div>
        <div>Join to reap many benefits</div>
        <button onClick={() => login()}>Log In</button>
      </div>
    </div>
  );
};

export default Login;
