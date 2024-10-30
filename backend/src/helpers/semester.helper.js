"use strict";
export function getCurrentSemester() {
    const currentMonth = new Date().getMonth() + 1; // Enero = 0
    return currentMonth <= 6 ? "Primer Semestre" : "Segundo Semestre";
  }
  
  export function isSemesterActive(semestre) {
    const currentSemester = getCurrentSemester();
    return currentSemester === semestre;
  }
  