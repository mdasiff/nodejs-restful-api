import Model from '../models/PermissionGroup.js';
import Permission from '../models/Permission.js';
import { validationResult } from 'express-validator';
import {
  CREATED,
  NOT_FOUND,
  UPDATED,
  DELETED,
  RESTORED
} from '../config/messages.js';
import { generateUniqueSlug } from '../helpers/common.js';

const create = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    req.body.slug = await generateUniqueSlug(Model, req.body.name);
    const data = new Model(req.body);
    await data.save();
    
    res.status(200).json({ data, message: CREATED });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const data = await Model.find({ deletedAt: null }).sort( { createdAt: -1 } );
    
    // Iterate over each PermissionGroup and get its child Permission
    const permissionGroupsWithChildren = data.map(async permissionGroup => {
      const permissions = await Permission.find({ permissiongroup: permissionGroup._id });

      return {
        ...permissionGroup.toObject(),
        permissions,
      };
    });

    // Wait for all PermissionGroups to be processed
    const processedPermissionGroups = await Promise.all(permissionGroupsWithChildren);
    
    res.status(200).json(processedPermissionGroups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllDeleted = async (req, res) => {
  
  try {
    
    const data = await Model.find({ deletedAt: { $ne: null } }).sort( { deletedAt: -1 } );
    
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await Model.findById(req.params.id);
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
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
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
    const data = await Model.findByIdAndUpdate(req.params.id, {deletedAt: new Date()});
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
    const data = await Model.findByIdAndUpdate(req.params.id, {deletedAt: null});
    if (!data) {
      return res.status(404).json({ error: NOT_FOUND });
    }
    res.status(200).json({ message: RESTORED });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  create,
  getAll,
  getAllDeleted,
  getById,
  update,
  destroy,
  restore
}