// api-response.js
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = true;
  }

  static success(res, data, message = "Success", statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
  }

  static created(res, data, message = "Created") {
    return res.status(201).json(new ApiResponse(201, data, message));
  }
}

export default ApiResponse;