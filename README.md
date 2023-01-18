# drf-data-serializer

A simple data serializer like django-rest-framework serializer with a few less features some of which will be implemented in future versions

## install

`npm install --save drf-data-serializer`

## usage

```javascript
// Javascript
const express = require("express");
const Serializer = require("drf-data-serializer");
const normalizePort = require("normalize-port-2");

const app = express();

class PostSerializer extends Serializer {
  validator = {
    author: this.CharField({max_length: 15, min_length: 3, default: visitor}),
    content: this.CharField({max_length: 1500}),
    publish: this.DateTimeField({{
      or: this.DateField()
    }})
  }
}


const port = normalizePort(process.env.PORT || "8000");
app.use(express.json());

app.post('/', function (req, res) {
  const serializer = new PostSerializer(req.body);
  serializer.validate();
  const valid = serializer.is_valid;
});

app.listen(port);


const server = http.createServer(listenerOrApp).listen(port, () => {
    console.log(`Server running: http://127.0.0.1:${port}.`);
});
```

```typescript
// Typescript
import express from "express";
import Serializer from "drf-data-serializer";
import normalizePort from "normalize-port-2";

const app = express();

class PostSerializer extends Serializer {
  validator = {
    author: this.CharField({max_length: 15, min_length: 3, default: visitor}),
    content: this.CharField({max_length: 1500}),
    publish: this.DateTimeField({{
      or: this.DateField()
    }})
  }
}


const port = normalizePort(process.env.PORT || "8000");
app.use(express.json());

app.post('/', function (req, res) {
  const serializer = new PostSerializer(req.body);
  serializer.validate();
  const valid = serializer.is_valid;
});

app.listen(port);


const server = http.createServer(listenerOrApp).listen(port, () => {
    console.log(`Server running: http://127.0.0.1:${port}.`);
});
```
