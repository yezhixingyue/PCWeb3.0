/* eslint-disable no-empty */
import Cookie from '../assets/js/Cookie';

let apiUrl = '';
if (process.env.NODE_ENV === 'development') {
  apiUrl = 'http://localhost:3005';
} else if (process.env.NODE_ENV === 'production') {
  if (!process.env.VUE_APP_BASE_URL) { // 正式
    apiUrl = 'https://www.ybz888.com';
  } else { // 测试生产环境
    apiUrl = 'http://192.168.1.92:3066';
  }
}

const handleRequestData = (error) => {
  if (!error || !error.response) return null;
  const url = error.response.config?.url?.split('?')[0] || '';
  if (!url || JSON.stringify(error).length > 30000) return null;
  let c = Cookie.getCookie('customerInfo');
  let id;
  if (c) {
    c = JSON.parse(c);
    id = c && c.CustomerID ? c.CustomerID : '';
  }
  return { id, url, error: JSON.stringify(error) };
};

const sendError = (data) => {
  const temp = handleRequestData(data);
  if (!temp) return;
  try {
    const request = new XMLHttpRequest();

    request.open('post', `${apiUrl}/Api/Log/Write`, true);

    request.setRequestHeader('Content-type', 'application/json');

    request.withCredentials = true;

    request.send(JSON.stringify(temp));
  } catch (err) {

  }
};

export default sendError;
