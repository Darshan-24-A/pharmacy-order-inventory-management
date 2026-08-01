import { getLowStockMedicines } from "../repositories/alertRepository.js";

export const getLowStockService = async () => {

    const medicines = await getLowStockMedicines();

    return medicines;

};