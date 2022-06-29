/* eslint-disable no-empty */
import Cookie from '../assets/js/Cookie';

const handleRequestData = (error) => {
  if (!error || !error.response) return null;
  const url = error.response.config?.url?.split('?')[0] || '';
  if (!url || JSON.stringify(error).length > 20000) return null;
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

    request.open('post', '/Api/Log/Write', true);

    request.setRequestHeader('Content-type', 'application/json');

    request.send(JSON.stringify(temp));
  } catch (err) {

  }
};

export default sendError;
