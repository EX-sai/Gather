import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
	name: {
		type: DataTypes.STRING(100),
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING(100),
		allowNull: false,
		unique: true,
		primaryKey: true,
	},
	password: {
		type: DataTypes.STRING(255),
		allowNull: false,
	},
	creation_date: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW,
	},
	profile_visibility: {
		type: DataTypes.ENUM("public", "private"),
		defaultValue: "public",
	},
	role: {
		type: DataTypes.ENUM("admin", "customer", "organiser"),
		defaultValue: "customer"
	},
});

export default User;
