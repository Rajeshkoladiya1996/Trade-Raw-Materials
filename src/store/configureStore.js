/* eslint-disable import/first */
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
// import { sessionService } from 'redux-react-session';
import rootReducer from "../reducers";
import config from "../config";

const composeEnhancers =
  config.APP_TYPE === "local"
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  );
  return store;
}
