import mongoose from "mongoose";
const {Schema,model}=mongoose;


const coursRSchema = new Schema(
    {
       

        nomCoursR:{
            type:String,
            enum: ["Les classes et les objets", "L'héritage", "le polymorphisme", "Les interfaces", "encapsulation"],
            required:true
        },
        description: {
            type: String, // Vous pouvez ajuster le type selon vos besoins
            required: true
        },
        pdff:{
            type:String,
            required:true
        },
    },
    {
        timestamps:true
    }
);

export default model ('CoursR',coursRSchema)