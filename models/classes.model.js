const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;

// Material Schema

const Material = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse:true
    },
     name: {
        type: String
    },
    files: [
        {
            fileName: String
        }
    ],
    avatar: {
        type: String
    },
    avatar_ext: {
        type: String
    },
      is_deleted: {
        type: Number,
        default: 0
    }
});
Material.plugin(mongoosePaginate);
const materialModel = mongoose.model("Material", Material);

// Class Schema
const User = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse: true
    },
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String
    },
    role: {
        type: String
    },
    department: {
        type: String
    },
    designation: {
        type: String
    },
    avatar: {
        type: String
    },
    avatar_ext: {
        type: String
    },
    is_deleted: {
        type: Number,
        default: 0
    }
});
User.plugin(mongoosePaginate);
User.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}
const userModel = mongoose.model("User", User);

// Class Schema
const Class = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse: true
    },
    class_Name: {
        type: String,
        default: "Class"
    },
    key: {
        type: String,
        unique: true,
        sparse: true
    },
    users: [
        User
    ],
    materials: [
        Material
    ],
    department: {
        type: String
    },

    avatar: {
        type: String
    },
    avatar_ext: {
        type: String
    },
    is_deleted: {
        type: Number,
        default: 0
    }
});
Class.plugin(mongoosePaginate);
const classModel = mongoose.model("Class", Class);


module.exports = {userModel, materialModel, classModel};
