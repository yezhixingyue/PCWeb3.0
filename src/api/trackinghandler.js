/* eslint-disable no-empty */
import api from './index';

const uploadTracking = (config) => {
  if (!config) return;

  const { tracking, timerStart, url } = config;
  if (tracking === true && timerStart && url) {
    const Duration = Date.now() - timerStart;
    if (Duration < 1000) return;

    try {
      api.getApiSaveRecord({ Url: url, Duration });
    } catch (error) {

    }
  }
};

export default {
  uploadTracking,
};
