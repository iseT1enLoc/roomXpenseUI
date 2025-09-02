import { response } from '~/services/axios';

export const createInstance = (user) => {
  let newInstance = response.create();

  newInstance.interceptors.request.use(
    (config) => {
      if (user?.access_token) {
        config.headers['Authorization'] = 'Bearer ' + user.access_token;
      }
      return config;
    },
    (err) => Promise.reject(err)
  );

  newInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response) {
        return Promise.reject(error.response.data);
      }
      return Promise.reject(error);
    }
  );

  return newInstance;
};
