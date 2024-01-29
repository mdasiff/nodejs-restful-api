import Admin from '../models/Admin.js';
import Role from '../models/Role.js';
import Permission from '../models/Permission.js';
import PermissionGroup from '../models/PermissionGroup.js';
import { validationResult } from 'express-validator';
import {
  CREATED,
  NOT_FOUND,
  UPDATED,
  DELETED,
  RESTORED
} from '../config/messages.js';

const create = async (req, res) => {
  //const id = "653a4a731185dd329201fe05";
  //const id = "653a588d15ae355cf839fb40";
  
  //const role = await Role.findOne({"_id":id});
  //console.log(role);

  // let newPermission = {
  //   "_id":"6539fea3928ed9aea02c2b5c"
  // };

  // if (!role.permissiongroups[0].permissions) {
  //   role.permissiongroups.permissions = [];
  // }

  // role.permissiongroups.permissions.push(newPermission);

  //const pg = role.permissiongroups[0];
  //await role.save();
  //role.permissiongroups.permissions = [];
  //console.log(role.permissiongroups[0]);

  //console.log(role.permissiongroups);
  
  //const data = new Role(req.body);
    
  //await data.save();

  const id = "653b5126c7a8ce8b01d1043e";

  const data = await Role.findOne({"_id":id}).populate('permissiongroups.permissions');

  return res.status(200).json({ data });
}

const create1 = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = new Role(req.body);
    await data.save();
    
    res.status(200).json({ data, message: CREATED });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    //const data = await Admin.find().sort( { createdAt: -1 } );
    const data = await Role.find({ deletedAt: null }).sort( { createdAt: -1 } ).populate({
      path: 'permissions',
      model: Permission,
      populate: {
        path: 'permissiongroup',
        model: PermissionGroup,
      },
    });
    
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllDeleted = async (req, res) => {
  
  try {
    
    const data = await Role.find({ deletedAt: { $ne: null } }).sort( { deletedAt: -1 } ).populate({
      path: 'permissions',
      model: Permission,
      populate: {
        path: 'permissiongroup',
        model: PermissionGroup,
      },
    });
    
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await Role.findById(req.params.id)
    .populate({
      path: 'permissions',
      model: Permission,
      populate: {
        path: 'permissiongroup',
        model: PermissionGroup,
      },
    });
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
    const data = await Role.findByIdAndUpdate(req.params.id, req.body, {
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
    const data = await Role.findByIdAndUpdate(req.params.id, {deletedAt: new Date()});
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
    const data = await Role.findByIdAndUpdate(req.params.id, {deletedAt: null});
    if (!data) {
      return res.status(404).json({ error: NOT_FOUND });
    }
    res.status(200).json({ message: RESTORED });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { create, getAll, getAllDeleted, getById, update, destroy, restore }