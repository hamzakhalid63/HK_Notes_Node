const Classes = require('../models/classes.model').classModel;
const Users = require('../models/classes.model').userModel;

const path = require('path');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const classesController = {};

// #region GetAllClasses
classesController.getAll = async (req, res) => {
  let classes;
  try {
    let merged = {};

    classes = await Classes.paginate(
      merged,
      {
        offset: 0,
        limit: Users.estimatedDocumentCount
      }
    );
    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: classes
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
// #endregion

// #region GetClassById
classesController.getSingleClassByClassId = async (req, res) => {
  let result;
  try {
    const _id = req.params._id;
    result = await Classes.findOne({ _id: _id });

    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: result
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
// #endregion

// #region GetClassByUserId
classesController.getSingleClassByUserId = async (req, res) => {
  let result;

  try {
    const userId = req.userData.data._id;
    result = await Classes.findOne({ "users._id": userId});

    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: result
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
// #endregion

// #region GetNextId
classesController.getNextId = async (req, res) => {
  try {
    const max_result = await Classes.aggregate([
      { $group: { _id: null, max: { $max: '$id' } } }
    ]);

    let nextId;
    if (max_result.length > 0) {
      nextId = max_result[0].max + 1;
    } else {
      nextId = 1;
    }

    var data = {
      code: 200,
      data: { id: nextId }
    };
    res.status(200).send(data);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
// #endregion

// #region DeleteClass
classesController.deleteClass = async (req, res) => {
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: 'ID missing'
    });
  }
  try {
    const _id = req.params._id;

    const result = await Classes.findOneAndDelete({
      _id: _id
    });
    //   const result = await Inventory.updateOne({
    //         _id: _id
    //     }, {
    //         $set: {is_deleted: 1}
    //     }, {
    //         upsert: true,
    //         runValidators: true
    //     });
    res.status(200).send({
      code: 200,
      message: 'Deleted Successfully'
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
// #endregion

// #region UploadAvater
classesController.uploadAvatar = async (req, res) => {
  try {
    const filePath = `images/avatar/avatar-${req.params.id}`;
    const ext = path.extname(req.file.originalname);
    const updates = {
      avatar: filePath,
      avatar_ext: ext
    };
    runUpdateById(req.params.id, updates, res);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
// #endregion

// #region UpdateClass
classesController.updateClass = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: 'ID missing'
    });
  }
  try {
    const _id = req.params._id;
    let updates = req.body;
    runUpdate(_id, updates, res);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
// #endregion

// #region RunUpdate
async function runUpdate(_id, updates, res) {
  try {
    const result = await Classes.updateOne(
      {
        _id: _id
      },
      {
        $set: updates
      },
      {
        upsert: true,
        runValidators: true
      }
    );

    {
      if (result.nModified == 1) {
        res.status(200).send({
          code: 200,
          message: 'Updated Successfully'
        });
      } else if (result.upserted) {
        res.status(200).send({
          code: 200,
          message: 'Created Successfully'
        });
      } else {
        res.status(422).send({
          code: 422,
          message: 'Unprocessible Entity'
        });
      }
    }
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
}
// #endregion

// #region RunUpdateById
async function runUpdateById(id, updates, res) {
  try {
    const result = await Classes.updateOne(
      {
        id: id
      },
      {
        $set: updates
      },
      {
        upsert: true,
        runValidators: true
      }
    );

    if (result.nModified == 1) {
      res.status(200).send({
        code: 200,
        message: 'Updated Successfully'
      });
    } else if (result.upserted) {
      res.status(200).send({
        code: 200,
        message: 'Created Successfully'
      });
    } else {
      {
        res.status(200).send({
          code: 200,
          message: 'Task completed successfully'
        });
      }
    }
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
}
// #endregion

// #region GetAllUsersByClassId
classesController.getAllUsersByKey = async (req, res) => {
  let result;
  try {
    const key = req.params.key;
    result = await Classes.findOne({ key: key });

    const users = result.users;
    console.log(users);

    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: users
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
// #endregion

// #region DeleteUser
classesController.deleteUser = async (req, res) => {
  let currentClass;

  if (!req.params.userId) {
    Fu;
    res.status(500).send({
      message: 'ID missing'
    });
  }
  try {
    const userId = req.userData.data._id;
    currentClass = await Classes.findOne({ "users._id": userId});
    const _id = req.params.userId;

    await Classes.update({'_id': currentClass._id}, {$pull: {"users": {'_id': _id}}});

    const userDeleted = await Users.findOneAndDelete({
      _id: _id
    });

    res.status(200).send({
      code: 200,
      message: 'Deleted Successfully'
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
// #endregion

module.exports = classesController;
