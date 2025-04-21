import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Events = sequelize.define(
  "Events",
  {
    id: {
      type: DataTypes.STRING(6),
      primaryKey: true,
      allowNull: false,
      field: "id",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "title",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "description",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "end_date",
    },
    time: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "time",
    },
    registered: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      field: "registered",
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "image",
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
      field: "price",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "location",
    },
    organiserId: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "organiser_id",
      references: {
        model: 'Users',
        key: 'email'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' // Optional: also cascade deletes if organiser is removed
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeValidate: (event) => {
        if (!event.id) {
          event.id = generateEventId();
        }
      }
    }
  }
);

// Function to generate 6-digit alphanumeric ID
function generateEventId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default Events;