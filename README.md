# API

This repository contains a Node.js application with MongoDB integration. It's designed for [briefly describe the purpose of your project].

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Create a Module (recommended)](#create_a_module)
- [Create a Module Manually](#create_a_module_manually)
    - [Create Model](#create_model)
    - [Create Migration](#create_migration)
    - [Create Rules](#create_rules)
    - [Create Controller](#create_controller)
    - [Create Route](#create_route)
- [Migrate Newly created private routes](#migrate_newly_created_private_routes)

<div id="prerequisites"></div>

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js:** [Download and Install Node.js](https://nodejs.org/)

- **MongoDB:** [Install MongoDB](https://docs.mongodb.com/manual/installation/)

<div id="getting-started"></div>

## Getting Started

<div id="installation"></div>

### Installation

1. Clone this repository:

```bash
git clone https://bitbucket.org/avyatech/erp-apis/src/master/
cd erp-apis
npm install
```
<div id="configuration"></div>

### Configuration
Create a **`.env`** file in the root directory of the project with the following environment variables:
```env
PORT=4000
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/restapi
JWT_SECRET=V8AhlskG3J578vLDBwJmR4ZJ3UDhscyeAPH3EqHluKlzrRVKoylzLDUUYopy0DeZ
```
Replace database with your MongoDB database name and configure the PORT as needed.

### Usage
```
npm start
```

Access your application in your web browser at http://localhost:4000 (or the configured PORT).

<div id="create_a_module_or_resource"></div>

## Create a Module or resource (recommended)
Introducing a custom command, `make:resources`, which is designed to streamline the creation of complete resources within application. This command automates the generation of essential components such as models, migrations, validations, routes, and controllers, allowing you to focus more on building features and less on repetitive boilerplate code.
To use the `make:resources` command, simply run:
```
node resource.js make:resources YourResourceName
```
Replace `YourResourceName `with the desired name for your resource. Suppose you have named it `Product`, then this command will generate the following components:

- Model: A file representing the data structure and behavior of your resource.
  `File Path: app > models > Product.js`

- Migration: Database migration file to define the schema for your resource's table.
`File Path: migration > product.js`

- Validation: Pre-configured validation rules for the resource.
`File Path: app > validation > product.js`

- Route: API routes associated with your resource.
`File Path: app > routes > private > product.js`

- Controller: A controller to handle HTTP requests related to your resource.
`File Path: app > controllers > ProductController.js`

Note: This command will create a private route, after creating you must need to migrate the routes using command `node migrate.js migrate-route`

<div id="create_a_module_manually"></div>

## Create a Module Manually
create a new module which will perform create record. Suppose we're creating a brand module.

1. Create Model
2. Create Migration
3. Create Rules
4. Create Controller
5. Create Route

<div id="create_model"></div>

#### 1. Create Model
Create a model and schema file which will define the document structure in mongodDB.
`app > models > Brand.js` and paste below code.

```JavaScript
//Brand.js

import mongoose from 'mongoose';
import { STATUS, STATUS_ACTIVE } from '../config/constants.js';

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  status: {
    type: String,
    enum: STATUS,
    default: STATUS_ACTIVE
  },
  deletedAt: { type: Date, default: null },
}, {
  timestamps: true
});

export default mongoose.model('Brand', brandSchema);
```
<div id="create_migration"></div>

### 2. Create Migration
Create a migration file which will migrate defined document structure in mongodDB. migrations > [time]-brands.js and paste below code.

```JavaScript
//[time]-brands.js

import connectDB from '../app/database/connect.js';
connectDB();

import Model from '../app/models/Brand.js';

module.exports = {
  up: async () => {
    
    await Model.createCollection();
  },
  down: async () => {
    await Model.collection.drop();
  },
};
```

<div id="create_rules"></div>

### 3. Create Rules
Rule will validate requests data before pass to Controller. `app > validations > brand.js` and paste below code

```JavaScript
//brand.js

import { check } from 'express-validator';
import {
  required,
  valid,
  min,
  upload_valid
} from './lang.js';

const createRules = [
  check('name')
    .notEmpty().withMessage(required('Name'))
    .isString().withMessage(valid('name'))
    .isLength({ min: 2 }).withMessage(min('Name', 2)),
  check('image')
    .custom((value, { req }) => {
      if (value) {
        // If an image is provided, perform validation checks
        if (!value.buffer) {
          throw new Error('Invalid image file');
        }

        // Check the file type (MIME type)
        if (!value.mimetype.startsWith('image/')) {
          throw new Error('Only image files are allowed');
        }

        // Define a maximum file size (adjust as needed)
        const maxFileSize = 5 * 1024 * 1024; // 5 MB
        if (value.buffer.length > maxFileSize) {
          throw new Error('Image file size exceeds the maximum allowed size');
        }
      }

      return true; // Return true to indicate successful validation (or no image provided)
    })
    .withMessage('Invalid image file')
];

export {
    createRules
};

```
<div id="create_controller"></div>

### 4. Create Controller 
Now create a controller where we will define businesse logic.
`app > controllers > BrandController.js` and paste below code.

```JavaScript
//BrandController.js

import Model from '../models/Brand.js';
import { validationResult } from 'express-validator';
import { CREATED, NOT_FOUND, UPDATED, DELETED, RESTORED } from '../config/messages.js';
import { generateUniqueSlug } from '../helpers/common.js';

const create = async (req, res) => {
  
  try {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if(req.file)
    {
      const { filename } = req.file;
      req.body.image = filename;
    }
    
    req.body.slug = await generateUniqueSlug(Model, req.body.name);
    const data = new Model(req.body);
    await data.save();
    
    res.status(200).json({ data, message: CREATED });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/*Other CRUD functions like get, find, delete, restore edit, update etc*/

export { create }
```

<div id="create_route"></div>

### 5. Create route
Now create a route. under files `app > routes > private > brand.js`
and paste below code.

```JavaScript
//brand.js

import express from 'express';
const router = express.Router();

import {
    create
    //Other functions import here
} from '../controllers/BrandController.js';

import { createRules } from '../validations/brand.js';
import { upload } from '../helpers/fileUpload.js';
/* other file imports if needed*/

const middleware = express.Router();
router.use('/', middleware);

middleware.post('/', upload.single('image'), createRules, create);
/* other routes register here like, get, find, edit, update delete, restore, etc...*/


export default router;

```

We have successfully created a `Brand` module, adjust above code as per your need.


### authMiddleware.js
authMiddleware is a function to authenticate and verify JWT tokens provided in the request header. Also its validate permissions on every request.

### Create Private route
Go to app > routes > private > brand.js and write routes.
```
End Point Will be: /api/brand/{endpoint}
```

### Create Public route
Go to app > routes > public > search.js and write routes.
```
End Point Will be: /api/brand/{endpoint}
```

### Migrate Newly created private routes
When you create a new private route, it's essential to add it to both the 'permission_groups' and 'permissions' tables. Don't worry you're just one command away from inserting it into the database, so there's no need for manual work.
Note: No need to migrate public routes.
```
Command: node migrate.js migrate-route
```
