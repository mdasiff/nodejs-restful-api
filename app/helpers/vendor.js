import Role from '../models/Role.js';

const getVendorId = async (req, res) => {
    const role = await Role.findOne({ name: 'Vendor' }).sort( { createdAt: -1 } );

    if(!role) {
      res.status(500).json('Vendor role is not exists');
    }

    return role._id;
}

const roleHasVendor = (data) => {
  
  if(data.roles.length > 0) {
    return data.roles.some((item) => item.name === 'Vendor');
  }

}

export { 
    getVendorId,
    roleHasVendor
}