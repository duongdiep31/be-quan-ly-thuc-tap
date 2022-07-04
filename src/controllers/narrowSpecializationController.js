import narrow from '../models/narrow_specialization';
import Student from '../models/student';
export const getNarrow = async (req, res) => {
  try {
    const data = await narrow.find().populate('id_majors').sort({ createAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({
      msg: 'lỗi',
    });
  }
};
export const insertNarrow = async (req, res) => {
  console.log(req.body);
  const findName = await narrow.findOne({
    "name": req.body.name,
  });
  try {
    if (findName) {
      return res.status(201).json({
        msg: 'Tên chuyên ngành hẹp đã tồn tại, vui lòng đặt tên khác!',
        status: 'error',
        success: false,
      });
    } else {
      await new narrow(req.body)
        .save()
        .then((res) => narrow.findById(res._id).populate('id_majors'))
        .then((data) =>
          res.status(200).json({
            data: data,
            status: 'ok',
            success: true,
            msg:'Thành công'
          }),
        );
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateNarrow = async (req, res) => {
  const findName = await narrow.findOne({
    "name": req.body.name,
  });
  try {
    if (findName) {
      return res.status(201).json({
        msg: 'Tên chuyên ngành hẹp đã tồn tại, vui lòng đặt tên khác!',
        status: 'error',
        success: false,
      });
    } else {
      await narrow
        .findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate('id_majors')
        .then((res) => narrow.findById(res._id).populate('id_majors'))
        .then((data) =>
          res.status(200).json({
            data: data,
            status: 'ok',
            success: true,
            msg:'Sửa thành công'
          }),
        );
    }
  } catch (error) {
    res.status(500).json({
      message: 'Có lỗi vui lòng thử lại sau',
    });
  }
};

export const deleteNarrow = async (req, res) => {
  try {
    const findStudentNarrow = await student.find({
      narrow: req.body.id,
    });
    if (!findNarrows) {
      // console.log(true);
      return res.status(404).json({
        message: 'Ngành hẹp không tồn tại!',
      });
    }
    if (findStudentNarrow) {
      return res.status(500).json({
        message: 'Ngành hẹp có sinh viên không được xoá',
      });
    } else {
      const deleteManyUserNarrow = await student.deleteMany({ narrow: null });
      if (deleteManyUserNarrow) {
        return res.status(200).json({
          message: 'Xoá thành công',
        });
      } else {
        res.status(500).json({
          message: 'Có lỗi vui lòng thử lại sau',
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: 'Có lỗi vui lòng thử lại sau',
    });
  }
};
