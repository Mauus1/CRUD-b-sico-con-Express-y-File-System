const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());


app.get('/elements', (req, res) => {
  fs.readFile('data.json', (err, data) => {
    if (err) {
      res.status(500).send({ message: 'Error reading file' });
    } else {
      const elements = data.split('\n').filter(Boolean);
      res.send(elements);
    }
  });
});

// aca use el motodo "fs.readFile()" para leer el contenido de data.json, luego si hay algun error al leer el archivo se enviara una respuesta con el codigo { message: 'Element not found' } y finalmente se divide el contenido del archivo en líneas individuales con data.split('\n'), luego se filtran las líneas vacías con .filter(Boolean) para eliminar cualquier línea que sea una cadena vacía.
app.get('/elements/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile('data.json', (err, data) => {
    if (err) {
      res.status(500).send({ message: 'Error reading file' });
    } else {
      const elements = data.split('\n').filter(Boolean);
      const element = elements.find(e => e.id === id);

      if (element) {
        res.send(element);
      } else {
        res.status(404).send({ message: 'Element not found' });
      }
    }
  });
});

// aca podemos crear un elemento, utilizo el metodo app.post() para definir la ruta /elements y pongo una funcion que maneja la solicitudes post, finalmente utilizo el método fs.appendFile() para agregar el objeto element al final del archivo data.json
app.post('/elements', (req, res) => {
  const { id, name } = req.body;
  const element = { id, name };

  fs.appendFile('data.json', `${JSON.stringify(element)}\n`, 'utf8', err => {
    if (err) {
      res.status(500).send({ message: 'Error writing file' });
    } else {
      res.send(element);
    }
  });
});

// aca podemos actualizar un elemento existente, se extrae el id del elemento y extraer el name del cuerpo de la solicitud
app.put('/elements/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send({ message: 'Error reading file' });
    } else {
      const elements = data.split('\n').filter(Boolean);
      const index = elements.findIndex(e => e.id === id);

      if (index >= 0) {
        elements[index].name = name;
        fs.writeFile('data.json', elements.join('\n') + '\n', 'utf8', err => {
          if (err) {
            res.status(500).send({ message: 'Error writing file' });
          } else {
            res.send(elements[index]);
          }
        });
      } else {
        res.status(404).send({ message: 'Element not found' });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
