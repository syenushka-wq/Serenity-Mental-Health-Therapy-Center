const { Service } = require('../models');

exports.getAllServices = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status && status !== 'All') where.status = status;

    const services = await Service.findAll({
      where,
      order: [['price', 'ASC']],
    });

    res.json({
      success: true,
      services,
    });
  } catch (error) {
    next(error);
  }
};

exports.createService = async (req, res, next) => {
  try {
    const { name, description, durationMinutes, price, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Name and price are required.' });
    }

    const count = await Service.count();
    const serviceCode = `SRV-${String(101 + count).padStart(3, '0')}`;

    const newService = await Service.create({
      serviceCode,
      name,
      description: description || '',
      durationMinutes: durationMinutes || 50,
      price,
      category: category || 'General Therapy',
      status: 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      service: newService,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const { name, description, durationMinutes, price, category, status } = req.body;

    await service.update({
      name: name !== undefined ? name : service.name,
      description: description !== undefined ? description : service.description,
      durationMinutes: durationMinutes !== undefined ? durationMinutes : service.durationMinutes,
      price: price !== undefined ? price : service.price,
      category: category !== undefined ? category : service.category,
      status: status !== undefined ? status : service.status,
    });

    res.json({
      success: true,
      message: 'Service updated successfully.',
      service,
    });
  } catch (error) {
    next(error);
  }
};
