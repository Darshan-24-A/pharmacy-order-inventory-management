import { body } from "express-validator";

export const medicineValidator = [
  body("name")
    .notEmpty()
    .withMessage("Medicine name is required"),

  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be 0 or greater"),

  body("expiry_date")
    .isDate()
    .withMessage("Expiry date must be a valid date")
];