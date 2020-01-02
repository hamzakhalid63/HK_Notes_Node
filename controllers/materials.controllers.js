const Classes = require('../models/classes.model').classModel;
const Materials = require('../models/classes.model').materialModel;
const materialsController = {};

materialsController.getAll = async (req, res) => {
  let materials;
  let currentClass;

  console.log(req.userData);
  try {

    const userId = req.userData.data._id;
    currentClass = await Classes.findOne({ "users._id": userId});

    materials = currentClass.materials;
    res.send({
      message: 'All Materials',
      data: materials      
    });

  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

materialsController.addMaterial = async (req, res) => {
  let currentClass;

  try {
    const body = req.body;
    const material = new Materials(body);

    const result = await Materials.create(material);

    if(!result) {
      res.send({
        message: 'Material Already Exists!'
      });
    }
    else {

      const userId = req.userData.data._id;
      currentClass = await Classes.findOne({ "users._id": userId});
      currentClass.materials.push(material);
      currentClass.save();

      console.log('material: '+material);
      console.log('material : '+result);
      console.log('class: '+currentClass.materials);
      
      res.send({
        message: 'Material Added Successfully',
        data: result
      });
    }
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

materialsController.getSingleMaterial = async (req, res) => {
  let material;
  let currentClass;
  try {
    const material = new Users(material);

    const userId = req.userData.data._id;
    currentClass = await Classes.findOne({ "users._id": userId});

    const _id = req.params._id;
    book = await books.findOne({ _id: _id });
    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: book
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};


materialsController.deleteMaterial = async (req, res) => {
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
    const _id = req.params._id;

    await Classes.update({'_id': currentClass._id}, {$pull: {"materials": {'_id': _id}}});

    const materialDeleted = await Materials.findOneAndDelete({
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

materialsController.updateMaterial = async (req, res) => {
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

async function runUpdate(_id, updates, res) {
  try {
    const result = await Books.updateOne(
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
async function runUpdateById(id, updates, res) {
  try {
    const result = await books.updateOne(
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

module.exports = materialsController;
