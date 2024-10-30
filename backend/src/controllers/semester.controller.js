"use strict"// controllers/semester.controller.js""
import { getCurrentSemester } from "../helpers/semester.helper.js";
import { handleSuccess } from "../handlers/responseHandlers.js";

export function getActiveSemester(req, res) {
  const semester = getCurrentSemester();
  handleSuccess(res, 200, "Semestre activo obtenido", { semester });
}
