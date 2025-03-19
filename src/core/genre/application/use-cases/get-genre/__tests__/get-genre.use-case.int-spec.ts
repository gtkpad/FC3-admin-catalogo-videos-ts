import { GetGenreUseCase } from '../get-genre.use-case';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { Genre, GenreId } from '../../../../domain/genre.aggregate';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { Category } from '../../../../../category/domain/category.aggregate';
import { CategorySequelizeRepository } from 'core/category/infra/repository/sequelize/category-sequelize.repository';
import { CategoryModel } from 'core/category/infra/repository/sequelize/category.model';
import {
  GenreModel,
  GenreCategoryModel,
} from 'core/genre/infra/repository/sequelize/genre-model';
import { GenreSequelizeRepository } from 'core/genre/infra/repository/sequelize/genre-sequelize.repository';
import { UnitOfWorkSequelize } from 'core/shared/infra/sequelize/unit-of-work-sequelize';

describe('GetGenreUseCase Integration Tests', () => {
  let uow: UnitOfWorkSequelize;
  let useCase: GetGenreUseCase;
  let genreRepo: GenreSequelizeRepository;
  let categoryRepo: CategorySequelizeRepository;

  const sequelizeHelper = setupSequelize({
    models: [GenreModel, GenreCategoryModel, CategoryModel],
  });

  beforeEach(() => {
    uow = new UnitOfWorkSequelize(sequelizeHelper.sequelize);
    genreRepo = new GenreSequelizeRepository(GenreModel, uow);
    categoryRepo = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetGenreUseCase(genreRepo, categoryRepo);
  });

  it('should throws error when entity not found', async () => {
    const genreId = new GenreId();
    await expect(() => useCase.execute({ id: genreId.id })).rejects.toThrow(
      new NotFoundError(genreId.id, Genre),
    );
  });

  it('should returns a genre', async () => {
    const categories = Category.fake().theCategories(2).build();
    await categoryRepo.bulkInsert(categories);
    const genre = Genre.fake()
      .aGenre()
      .addCategoryId(categories[0].category_id)
      .addCategoryId(categories[1].category_id)
      .build();
    await genreRepo.insert(genre);
    const output = await useCase.execute({ id: genre.genre_id.id });
    expect(output).toStrictEqual({
      id: genre.genre_id.id,
      name: genre.name,
      categories: expect.arrayContaining([
        expect.objectContaining({
          id: categories[0].category_id.id,
          name: categories[0].name,
          created_at: categories[0].created_at,
        }),
        expect.objectContaining({
          id: categories[1].category_id.id,
          name: categories[1].name,
          created_at: categories[1].created_at,
        }),
      ]),
      categories_id: expect.arrayContaining([
        categories[0].category_id.id,
        categories[1].category_id.id,
      ]),
      is_active: true,
      created_at: genre.created_at,
    });
  });
});
