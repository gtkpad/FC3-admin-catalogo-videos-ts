import { SearchParams } from "../../../../shared/domain/repository/search-params";
import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { InMemorySearchableRepository } from "../../../../shared/infra/repository/in-memory.repository";
import { Category } from "../../../domain/category.entity";
import {
  CategoryFilter,
  CategorySearchParams,
  CategorySearchResult,
  ICategoryRepository,
} from "../../../domain/category.repository";

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, Uuid, CategoryFilter>
  implements ICategoryRepository
{
  sortableFields: string[] = ["name", "created_at"];

  protected async applyFilter(
    items: Category[],
    filter: CategoryFilter
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) => {
      return i.name.toLowerCase().includes(filter.toLowerCase());
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }

  protected applySort(
    items: Category[],
    sort: SearchParams["sort"],
    sort_dir: SearchParams["sort_dir"],
    custom_getter?: (sort: string, item: Category) => any
  ): Category[] {
    return sort
      ? super.applySort(items, sort, sort_dir, custom_getter)
      : super.applySort(items, "created_at", "desc");
  }
}
