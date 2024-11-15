/* eslint-disable no-empty */
import api from './index';

const uploadTracking = (config, Url) => {
  if (!config) return;

  const { tracking, timerStart, url } = config;
  if (tracking === true && timerStart && url) {
    const Duration = Date.now() - timerStart;

    if (Duration < 1500) return;

    try {
      api.getApiSaveRecord({ Url, Duration });
    } catch (error) {

    }
  }
};

export default {
  uploadTracking,
};
