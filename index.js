const http = require("http");
const url = require("url");
const fs = require("fs");

const { insertar, consultar, editar, eliminar } = require("./consultas");

http
  .createServer(async (req, res) => {
    if (req.url == "/" && req.method == "GET") {
      res.setHeader("content-type", "text/html");

      const html = fs.readFileSync("index.html", "utf8");
      res.end(html);
    }

    // Paso insertar
    if (req.url == "/ejercicios" && req.method == "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body));

        const respuesta = await insertar(datos);

        res.end(JSON.stringify(respuesta));
      });
    }
    if (req.url == "/ejercicios" && req.method == "GET") {
      const registros = await consultar();
      res.end(JSON.stringify(registros));
    }

    // Paso Editar
    if (req.url == "/ejercicios" && req.method == "PUT") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", async () => {
        const datos = Object.values(JSON.parse(body));

        const respuesta = await editar(datos);
        res.end(JSON.stringify(respuesta));
      });
    }

    // Hacer el delete
    if (req.url.startsWith("/ejercicios?") && req.method == "DELETE") {
      const { nombre } = url.parse(req.url, true).query;
      const respuesta = await eliminar(nombre);
      res.end(JSON.stringify(respuesta));
    }
  })
  .listen(3000, () => console.log("Servidor corriendo en el puerto 3000"));
