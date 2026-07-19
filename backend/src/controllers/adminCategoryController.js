const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const categoryService = require("../services/categoryService");

const listCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.listCategories();
  sendSuccess(res, 200, { categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  sendSuccess(res, 201, { category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  sendSuccess(res, 200, { category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  sendSuccess(res, 200, { id: req.params.id });
});

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
