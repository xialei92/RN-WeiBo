/**
 * Created by looper on 2017/8/29.
 */
import * as Types from '../actions/ActionTypes'

const initialState = {
  data: [],
  refreshing: false,
  error: false,
  loading: false,
  groupError: false
};

export function homeDataState(state = initialState, action) {
  switch (action.type) {
    case Types.FETCH_HOME_DATA_REQUEST:
      return {
        ...state,
        refreshing: true,
        loading: false,
      };
    case Types.FETCH_HOME_DATA_SUCCESS:
      return {
        ...state,
        refreshing: false,
        loading: false,
        data: action.data
      };
    case Types.FETCH_HOME_DATA_FAILURE:
      return {
        ...state,
        refreshing: false,
        loading: false,
        error: true
      };
    case Types.FETCH_HOME_MORE_DATA_REQUEST:
      return {
        ...state,
        refreshing: false,
        loading: true,
      };
    case Types.FETCH_HOME_MORE_DATA_SUCCESS:
      action.data.shift();//删除重复元素
      return {
        ...state,
        refreshing: false,
        loading: false,
        data: state.data.concat(action.data)
      };
    case Types.FETCH_HOME_MORE_DATA_FAILURE:
      return {
        ...state,
        refreshing: false,
        loading: false,
        error: true
      };
    case Types.FETCH_USER_GROUP_SUCCESS:
      return {
        ...state,
        groups: state.data,
      };
    case Types.FETCH_USER_GROUP_FAILURE:
      return {
        ...state,
        groupError:true,
      };
    default:
      return state;
  }
}
