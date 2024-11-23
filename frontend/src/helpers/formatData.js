import { startCase } from 'lodash';
import { format as formatRut } from 'rut.js';
import { format as formatTempo } from "@formkit/tempo";


export function formatUserData(user) {
    return {
        ...user,
        nombre: startCase(user.nombre),
        apellido: startCase(user.apellido),
        rol: startCase(user.rol),
        rut: formatRut(user.rut),
        createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
    };
}

export function convertirMinusculas(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'string') {
            obj[key] = obj[key].toLowerCase();
        }
    }
    return obj;
}

export function formatPostUpdate(user) {
    return {
        nombre: startCase(user.nombre),
        apellido: startCase(user.apellido),
        rol: startCase(user.rol),
        rut: formatRut(user.rut),
        email: user.email,
        createdAt: formatTempo(user.createdAt, "DD-MM-YYYY")
    };
}


export const normalizeRut = (rut) => {
    if (!rut) return ""; 
    const cleanRut = rut.replace(/[.-]/g, "").trim();
    if (cleanRut.length < 8) return "Es muy corto";
    const body = cleanRut.slice(0, -1);
    const verifier = cleanRut.slice(-1);
    return `${body}-${verifier}`;
  };