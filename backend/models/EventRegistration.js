import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const EventRegistration = sequelize.define("EventRegistration", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	eventId: {
		type: DataTypes.STRING(6),
		allowNull: false,
		references: {
			model: 'Events',
			key: 'id'
		},
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE'
	},
	customerEmail: {
		type: DataTypes.STRING(100),
		allowNull: false,
		references: {
			model: 'Users',
			key: 'email'
		},
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE'
	},
	registrationDate: {
		type: DataTypes.DATE,
		defaultValue: DataTypes.NOW
	}
}, {
	timestamps: false
});

export default EventRegistration;