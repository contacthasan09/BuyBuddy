import { Category } from "./category.model";
import { AppError } from "../../utils/AppError";

export const listCategories = () => Category.find({ isActive: true }).sort({ name: 1 }).lean();

export const listAllCategories = () => Category.find().sort({ name: 1 }).lean();

export async function getCategory(id: string) {
  const cat = await Category.findById(id);
  if (!cat) throw new AppError("Category not found", 404);
  return cat;
}

export const createCategory = (data: any) => Category.create(data);

export async function updateCategory(id: string, data: any) {
  const cat = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!cat) throw new AppError("Category not found", 404);
  return cat;
}

export async function deleteCategory(id: string) {
  const cat = await Category.findByIdAndDelete(id);
  if (!cat) throw new AppError("Category not found", 404);
  return cat;
}