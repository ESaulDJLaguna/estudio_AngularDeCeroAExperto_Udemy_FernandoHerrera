//! Script que automáticamente va a crear los archivos environment con la configuraicón de las variables de entorno que se tienen el el '.env' y si no existe alguna key mande una excepción

/*
! writeFileSync: crea el archivo
! mkdirSync: crea el directorio
! fs: no se requiere importar porque ya viene en node
*/
const { writeFileSync, mkdirSync } = require("fs");

/*
! Se requiere leer las variables de entorno, para leerlas se ocupa el siguiente paquete (se utiliza -D porque será una dependencia de desarrollo):

! npm i -D dotenv

!> Se utiliza -D porque será una dependencia de desarrollo.

! Podemos tomar las configuraciones por defecto del paquete dotenv `.config()`.

! La configuración por defecto establece las variables de entorno que va a encontrar en el archivo .env
*/
require("dotenv").config();

const envRoute = "./src/environments";

const targetPath = `${envRoute}/environment.ts`;
const targetPathDev = `${envRoute}/environment.development.ts`;

const mapboxKey = process.env["MAPBOX_KEY"];

if (!mapboxKey) {
  throw new Error("MAPBOX_KEY is not set");
}

const envFileContent = `
export const environment = {
  mapboxKey: '${mapboxKey}',
};
`;

mkdirSync(envRoute, { recursive: true });
writeFileSync(targetPath, envFileContent);
writeFileSync(targetPathDev, envFileContent);

//! Para ejecutar el script desde la terminal se escribe: node ./scripts/set-envs.js
//! Pero como este procedimiento no es algo muy común o estándar de Angular sino que es algo propio y para que otros desarrolladores sepan qué hacer idealmente se creará un script nuevo en el package.json
