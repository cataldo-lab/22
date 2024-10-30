"use strict";

export function handleSuccess(res, statusCode, message, data = {}) {
  return res.status(statusCode).json({
    status: "Success",
    message: `${message}. Operación exitosa.`,
    data,
  });
}

export function handleErrorClient(res, statusCode, message, details = {}) {
  return res.status(statusCode).json({
    status: "Client error",
    message: `${message}. Por favor, revisa los datos enviados.`,
    details,
  });
}

export function handleErrorServer(res, statusCode, message) {
  return res.status(statusCode).json({
    status: "Server error",
    message: `${message}. Ha ocurrido un problema en el servidor.`,
  });
}
