import { Sequelize } from "sequelize";
const db = new Sequelize("crudimg","root","",{
    host:"localhost",
    dialect:"mysql"
});

export default db;