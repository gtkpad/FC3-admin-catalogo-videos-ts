import { NotFoundError } from '../../../../../../core/shared/domain/errors/not-found.error';
import { Category } from '../../../../../../core/category/domain/category.aggregate';
import { CategorySequelizeRepository } from '../../../../../../core/category/infra/repository/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../../../core/category/infra/repository/sequelize/category.model';
import { Uuid } from '../../../../../../core/shared/domain/value-objects/uuid.vo';
import { setupSequelize } from '../../../../../../core/shared/infra/testing/helpers';
import { GetCategoryUseCase } from '../get-category.use-case';

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const categoryId = new Uuid();
    await expect(() => useCase.execute({ id: categoryId.id })).rejects.toThrow(
      new NotFoundError(categoryId.id, Category),
    );
  });

  it('should returns a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const output = await useCase.execute({ id: category.category_id.id });
    expect(output).toStrictEqual({
      id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });
});
