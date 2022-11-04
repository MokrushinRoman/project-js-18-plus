import API from './api';
const MAIN_API_KEY = 'b92b6dc04d7a0a77de1e180daf2986e1';

const API_KEY =
  'b92b6dc04d7a0a77de1e180daf2986e1'; /*put your personal API-key instead of empty string*/

import { Notify } from 'notiflix';
export const getTrending = async ({ timeWindow = 'day', page = 1 } = {}) => {
  return await API.get(
    `/trending/all/${timeWindow}?api_key=${API_KEY}&page=${page}`
  )
    .then(response => {
      return response.data;
    })
    .catch(err => {
      Notify.failure(`Oops! ${err.message || "Can't find anything"}`);
      throw err;
    });
};
// @param
export const searchMovies = async params => {
  if (!params.query) {
    return await API.get(`/trending/all/day?api_key=${API_KEY}&page=1`)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        Notify.failure(`Oops! ${err.message || "Can't find anything"}`);
        throw err;
      });
  }
  const searchParams = new URLSearchParams(params).toString();

  return await API.get(`/search/movie?api_key=${API_KEY}&${searchParams}`)
    .then(response => response.data)
    .catch(err => {
      Notify.failure(`Oops! ${err.message || "Can't find anything"}`);
      throw err;
    });
};
export const getMovieDetails = id => {
  return API.get(`/movie/${id}?api_key=${API_KEY}`)
    .then(response => response.data)
    .catch(err => {
      const errorMessage =
        err.response.data.status_message || "Can't get details";

      Notify.failure(errorMessage);
      throw err;
    });
};
export const getActorsDetails = async movieId => {
  return await API.get(`movie/${movieId}/credits?api_key=${API_KEY}`)
    .then(({ data: { cast = [] } } = {}) => cast)
    .catch(err => {
      Notify.failure(`Oops! ${err.message || "Can't find actors"}`);
      throw err;
    });
};
export const getReviews = async ({ movieId, page = 1 }) => {
  return await API.get(
    `movie/${movieId}/reviews?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`
  )
    .then(response => {
      return response.data;
    })
    .catch(err => {
      Notify.failure(`Oops! ${err.message || "Can't find reviews"}`);
      throw err;
    });
};

export const getVideoTrailer = id => {
  return API.get(`/movie/${id}/videos?api_key=${API_KEY}&language=UA`)
    .then(response => response.data)
    .catch(err => {
      Notify.failure("Can't get details");
      throw err;
    });
};
