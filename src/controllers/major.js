import Major from '../models/major';

export const getListMajor = async (req, res) => {
  try {
    const majors = await Major.find().sort({ createdAt: -1 });
    res.status(200).json({
      majors,
      success: true,
    });
  } catch (error) {
    res.json(error);
  }
};

export const getMajor = async (req, res) => {
  try {
    const major = await Major.findById(req.params.id);
    res.status(200).json({
      major,
      success: true,
    });
  } catch (error) {
    res.json(error);
  }
};

export const createMajor = async (req, res) => {
  const duplicate = await Major.findOne({
    $or: [
      {
        "name": req.body.name,
      },
      {
        "majorCode": req.body.majorCode,
      },
    ],
  });
  try {
    if (duplicate !== null) {
      res.status(201).json({
        status: 'error',
        success: false,
        msg: 'Trùng tên',
      });
      return;
    } else {
      const major = await Major.create(req.body);
      res.status(200).json({
        status: 'ok',
        success: true,
        data: major,
        msg: 'Thành công',
      });
      return;
    }
  } catch (error) {
    error;
  }
};

export const updateMajor = async (req, res) => {
  try {
    const major = await Major.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      status: 'ok',
      success: true,
      data: major,
      message: 'Sửa ngành học thành công',
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      success: false,
      msg: 'Thất bại',
      data: {},
    });
  }
};

export const removeMajor = async (req, res) => {
  try {
    const major = await Major.findByIdAndRemove(req.params.id);
    res.status(200).json({
      major,
      message: 'Xóa ngành học thành công',
    });
  } catch (error) {
    res.json({
      error,
    });
  }
};
