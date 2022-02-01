function sendJson(response, statusCode = 200) {
  const status = statusCode >= 200 && statusCode < 300;
  const responsePayload = {};
  responsePayload['status'] = status;
  if (typeof response === 'string') responsePayload['message'] = response;
  else if (typeof response === 'object') responsePayload['data'] = response;
  return this.status(statusCode).json(responsePayload);
}

module.exports = sendJson;
