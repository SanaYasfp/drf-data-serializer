# drf-data-serializer

A simple data serializer like django-rest-framework serializer with a few less features some of which will be implemented in future versions

## install

`npm install --save drf-data-serializer`

## usage

```javascript
// CommonJS
const express = require("express");
const Serializer = require("drf-data-serializer");
const normalizePort = require("normalize-port-2");
// ES Module
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

    if (!valid) {
      res.status(400).send(serializer.errors);
      return;
    }

    // ...
});

app.listen(port);

```
