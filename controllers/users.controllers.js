const Classes = require('../models/classes.model').classModel;
const Users = require('../models/classes.model').userModel;

const randomGenerator = require("randomatic");
const path = require('path');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const usersController = {};

// #region GetAllUsers
usersController.getAll = async (req, res) => {

  let users;
  try {
    let merged = {};

    users = await Users.paginate(
      merged,
      { password: 0 },
      {
        password: 0,
        offset: 0,
        limit: Users.estimatedDocumentCount
      }
    );
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

// #region GetSingleUser
usersController.getSingleUser = async (req, res) => {
  let user;
  try {
    const _id = req.params._id;
    user = await Users.findOne({ _id: _id });
    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: user
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
// #endregion

// #region RegisterUser
usersController.registerUser = async (req, res) => {
  try {
    const body = req.body;
    const role = body.role;

    const password = body.password;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    body.password = hash;

    // #region RegisterAdmin
    if (role === "admin") {

      const user = new Users(body);
      const _class = await Classes.find();
      var classKeys = [];

      for (let i = 0; i < _class.length; i++) {
        classKeys.push(_class[i].key);
      }

      var randomKey = randomGenerator("Aa0", 6);
      while (classKeys.includes(randomKey)) {
        randomKey = randomGenerator("Aa0", 6);
      }

      const result = await Users.create(user);                                    // Store User in Users

      if(!result) {
        console.log("Hello");
        res.status(401).send({
          message: 'This email has been Registered Already!'
        });  
      }
      else {

        const classCreate = await Classes.create({ key: randomKey });  // Create Class
        classCreate.users.push(user);                                // Store User (Admin) in Class
        classCreate.save();
  
        res.send({
          message: 'Signup successful',
          data: result
        });  
      }
    }
    // #endregion
    // #region RegisterMember
    else if (role === "member") {

      const classKey = body.key;
      const user = new Users(body);
      const classFound = await Classes.findOne({ key: classKey });

      if (!classFound) {
        res.status(401).send({
          message: "The Key Dosen't Exists!"
        });
      }
      else {
        await Users.create(user);                        // Create User and Save
        classFound.users.push(user);                     // Push User in Found Class
        const result = classFound.save();                               // Save Class

        res.send({
          message: 'Signup successful',
          data: result
        });
      }
    };
    // #endregion
  } catch (ex) {
      res.status(500).send({
        message: "The Email has been Already Registered!"
      });
  }
};
// #endregion

// #region LoginUser
usersController.loginUser = async (req, res) => {
  try {
    const body = req.body;
    console.log(body);
    const email = body.email;

    const result = await Users.findOne({ email: email });
    if (!result) {
      // this means result is null
      res.status(401).send({
        message: 'This user doesnot exists. Please signup first'
      });
    } else {
      // email did exist
      // so lets match password

      if (bcrypt.compareSync(body.password, result.password)) {
        // great, allow this user access
        result.password = undefined;

        const token = jsonwebtoken.sign({
          data: result,
          role: result.role
        }, process.env.JWT_KEY, { expiresIn: '7d' });

        res.send({ message: 'Successfully Logged in', token: token });
      }

      else {
        console.log('password doesnot match');
        console.log(body.password);
        console.log(result.password);

        res.status(401).send({ message: 'Wrong email or Password' });
      }
    }
  } catch (ex) {
    console.log('ex', ex);
  }
};
// #endregion

// #region GetNextId
usersController.getNextId = async (req, res) => {
  try {
    const max_result = await Users.aggregate([
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

// #region DeleteUser
usersController.deleteUser = async (req, res) => {
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: 'ID missing'
    });
  }
  try {
    const _id = req.params._id;

    const result = await Users.findOneAndDelete({
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
usersController.uploadAvatar = async (req, res) => {
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

// #region UpdateUser
usersController.updateUser = async (req, res) => {
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
    const result = await Users.updateOne(
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
    const result = await Users.updateOne(
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

module.exports = usersController;
