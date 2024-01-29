import Modal from '../models/Product.js';
import { validationResult } from 'express-validator';
import { CREATED, NOT_FOUND, UPDATED, DELETED, RESTORED } from '../config/messages.js';
import { generateUniqueSlug, removeEmptyProperties, calculateSalePrice } from '../helpers/common.js';

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

    req.body = removeEmptyProperties(req.body);
    req.body.slug = await generateUniqueSlug(Modal, req.body.name);
    req.body.discounted_price = calculateSalePrice(req.body.price, req.body.discount);
    
    const data = new Modal(req.body);
    await data.save();
    
    res.status(200).json({ data, message: CREATED });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    //const data = await Admin.find().sort( { createdAt: -1 } );
    const data = await Modal.find({ deletedAt: null }).sort( { createdAt: -1 } ).populate('category');
    
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllDeleted = async (req, res) => {
  
  try {
    //const data = await Admin.find({}, { password: 0 }).sort( { createdAt: -1 } );
    const data = await Modal.find({ deletedAt: { $ne: null } }).sort( { deletedAt: -1 } ).populate('category');
    
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await Modal.findById(req.params.id).populate('category');
    console.log(data);
    if (!data) {
      return res.status(404).json({ error: NOT_FOUND });
    }
    
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const update = async (req, res) => {
  try {
    
    
    if(req.file)
    {
      const { filename } = req.file;
      req.body.image = filename;
    }
    req.body.discounted_price = calculateSalePrice(req.body.price, req.body.discount);
    const data = await Modal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data) {
      return res.status(404).json({ error: NOT_FOUND });
    }
    
    res.status(200).json({ data, message: UPDATED });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const destroy = async (req, res) => {
  try {
    //const data = await Admin.findByIdAndRemove(req.params.id);
    const data = await Modal.findByIdAndUpdate(req.params.id, {deletedAt: new Date()});
    if (!data) {
      return res.status(404).json({ error: NOT_FOUND });
    }
    res.status(200).json({ message: DELETED });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const restore = async (req, res) => {
  try {
    const data = await Modal.findByIdAndUpdate(req.params.id, {deletedAt: null});
    if (!data) {
      return res.status(404).json({ error: NOT_FOUND });
    }
    res.status(200).json({ message: RESTORED });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { create, getAll, getAllDeleted, getById, update, destroy, restore }