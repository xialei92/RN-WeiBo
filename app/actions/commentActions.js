/**
 * Created by looper on 2017/8/29.
 */
import * as TYPES from './ActionTypes';
import TokenDao from '../dao/TokenDao';
import * as API from '../network/api';
import Toast from 'react-native-root-toast';

function fetchSuccess(json) {
  return {
    type: TYPES.FETCH_COMMENT_DATA_SUCCESS,
    data: json,
  }
}

function fetchFailure() {
  return {
    type: TYPES.FETCH_COMMENT_DATA_FAILURE
  };
}

function fetchRequest() {
  return {
    type: TYPES.FETCH_COMMENT_DATA_REQUEST
  };
}

function fetchMoreDataSuccess(json) {
  return {
    type: TYPES.FETCH_COMMENT_MORE_DATA_SUCCESS,
    data: json
  };
}

function fetchMoreDataRequest() {
  return {
    type: TYPES.FETCH_COMMENT_MORE_DATA_REQUEST
  };
}

function fetchMoreDataFailure() {
  return {
    type: TYPES.FETCH_COMMENT_MORE_DATA_FAILURE
  };
}

function fetchUserGroupSuccess(data) {
  return {
    type: TYPES.FETCH_USER_GROUP_SUCCESS,
    data
  }
}

function fetchUserGroupFailure() {
  return {
    type: TYPES.FETCH_USER_GROUP_FAILURE
  }
}

export function getData(id, max_id = 0) {
  const tokenDao = new TokenDao();
  const loadMore = !!max_id
  return (dispatch) => {
    dispatch(loadMore ? fetchMoreDataRequest() : fetchRequest())
    tokenDao.get().then(token => {
      if (token) {
        API.getComments({ access_token: token, id, max_id })
          .then(data => {
            if (loadMore) {
              dispatch(fetchMoreDataSuccess(data.comments))
            } else {
              dispatch(fetchSuccess(data.comments))
            }
          }).catch(error => {
          if (error.code === 403) {
            dispatch({ type: TYPES.LOGE_OUT })
            dispatch({ type: TYPES.CLEAR_TOKEN })
            Toast.show('授权过期，请重新登录');
          }
          dispatch(loadMore ? fetchMoreDataFailure() : fetchFailure());
        })
      }
    })
  }
}