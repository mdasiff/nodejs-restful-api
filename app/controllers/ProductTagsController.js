import Modal from '../models/ProductTags.js';
import { validationResult } from 'express-validator';
import { CREATED, NOT_FOUND, UPDATED, DELETED, RESTORED } from '../config/messages.js';
import { generateUniqueSlug, removeEmptyProperties } from '../helpers/common.js';

export const add = async (req, res) => {
  try {
    // Check for validation errors
    //return console.log(req);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if(req.file)
    {
      const { filename } = req.file;
      req.body.image = filename;
    }

    req.body = removeEmptyProperties(req.body);
    req.body.slug = await generateUniqueSlug(Modal, req.body.name);
    const data = new Modal(req.body);
    await data.save();
    
    res.status(200).json({ data, message: CREATED });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    //const data = await Admin.find().sort( { createdAt: -1 } );
    const data = await Modal.find({ deletedAt: null }).sort( { createdAt: -1 } );
    
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await Modal.findById(req.params.id);
    console.log(data);
    if (!data) {
      return res.status(404).json({ error: NOT_FOUND });
    }
    
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//export { create, getAll, getAllDeleted, getById, update, destroy, restore, getAllParents }