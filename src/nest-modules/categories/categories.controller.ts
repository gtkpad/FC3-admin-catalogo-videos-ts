import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryUseCase } from '../../core/category/application/create-category/create-category.use-case';
import { DeleteCategoryUseCase } from '../../core/category/application/delete-category/delete-category.use-case';
import { GetCategoryUseCase } from '../../core/category/application/get-category/get-category.use-case';
import { ListCategoriesUseCase } from '../../core/category/application/list-categories/list-categories.use-case';
import { UpdateCategoryUseCase } from '../../core/category/application/update-category/update-category.use-case';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './categories.presenter';
import { CategoryOutput } from 'core/category/application/common/category-output';
import { SearchCategoriesDto } from './dto/search-categories.dto';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createUseCase: CreateCategoryUseCase;

  @Inject(UpdateCategoryUseCase)
  private updateUseCase: UpdateCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteUseCase: DeleteCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private getUseCase: GetCategoryUseCase;

  @Inject(ListCategoriesUseCase)
  private listUseCase: ListCategoriesUseCase;

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const output = await this.createUseCase.execute(createCategoryDto);

    return CategoriesController.serialize(output);
  }

  @Get()
  async search(@Query() search: SearchCategoriesDto) {
    const output = await this.listUseCase.execute(search);

    return new CategoryCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    const output = await this.getUseCase.execute({ id });

    return CategoriesController.serialize(output);
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const output = await this.updateUseCase.execute({
      ...updateCategoryDto,
      id,
    });

    return CategoriesController.serialize(output);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ) {
    await this.deleteUseCase.execute({ id });
  }

  static serialize(output: CategoryOutput) {
    return new CategoryPresenter(output);
  }
}
