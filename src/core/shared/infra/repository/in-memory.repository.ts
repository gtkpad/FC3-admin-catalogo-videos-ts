import { InvalidArgumentError } from 'core/shared/domain/errors/invalid-argument.error';
import { Entity } from '../../domain/entity';
import { NotFoundError } from '../../domain/errors/not-found.error';
import {
  IRepository,
  ISearchableRepository,
} from '../../domain/repository/repository.interface';
import { SearchParams } from '../../domain/repository/search-params';
import { SearchResult } from '../../domain/repository/search-result';
import { ValueObject } from '../../domain/value-object';

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject,
> implements IRepository<E, EntityId>
{
  items: E[] = [];

  public async insert(entity: E): Promise<void> {
    this.items.push(entity);
    await Promise.resolve();
  }

  public async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
    await Promise.resolve();
  }

  public async update(entity: E): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.entity_id.equals(entity.entity_id),
    );
    if (index < 0) {
      throw new NotFoundError(entity.entity_id, this.getEntity());
    }

    this.items[index] = entity;
    await Promise.resolve();
  }

  public async delete(entity_id: EntityId): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.entity_id.equals(entity_id),
    );
    if (index < 0) {
      throw new NotFoundError(entity_id, this.getEntity());
    }

    this.items.splice(index, 1);
    await Promise.resolve();
  }

  public async findById(entity_id: EntityId): Promise<E | null> {
    return Promise.resolve(this._get(entity_id));
  }

  public async findAll(): Promise<E[]> {
    return Promise.resolve(this.items);
  }

  async findByIds(ids: EntityId[]): Promise<E[]> {
    //avoid to return repeated items
    return Promise.resolve(
      this.items.filter((entity) => {
        return ids.some((id) => entity.entity_id.equals(id));
      }),
    );
  }

  async existsById(
    ids: EntityId[],
  ): Promise<{ exists: EntityId[]; not_exists: EntityId[] }> {
    if (!ids.length) {
      throw new InvalidArgumentError(
        'ids must be an array with at least one element',
      );
    }

    if (this.items.length === 0) {
      return {
        exists: [],
        not_exists: ids,
      };
    }

    const existsId = new Set<EntityId>();
    const notExistsId = new Set<EntityId>();
    ids.forEach((id) => {
      const item = this.items.find((entity) => entity.entity_id.equals(id));

      item ? existsId.add(id) : notExistsId.add(id);
    });
    return Promise.resolve({
      exists: Array.from(existsId.values()),
      not_exists: Array.from(notExistsId.values()),
    });
  }

  abstract getEntity(): new (...args: any[]) => E;

  protected _get(entity_id: EntityId) {
    const item = this.items.find((item) => item.entity_id.equals(entity_id));
    return typeof item === 'undefined' ? null : item;
  }
}

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string,
  >
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, Filter>
{
  sortableFields: string[] = [];

  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
    const filteredItems = await this.applyFilter(this.items, props.filter);
    const itemsSorted = this.applySort(
      filteredItems,
      props.sort,
      props.sort_dir,
    );
    const itemsPaginated = this.applyPaginate(
      itemsSorted,
      props.page,
      props.per_page,
    );

    return new SearchResult({
      items: itemsPaginated,
      total: filteredItems.length,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null,
  ): Promise<E[]>;

  protected applyPaginate(
    items: E[],
    page: SearchParams['page'],
    per_page: SearchParams['per_page'],
  ) {
    const start = (page - 1) * per_page;
    const limit = start + per_page;
    return items.slice(start, limit);
  }

  protected applySort(
    items: E[],
    sort: SearchParams['sort'],
    sort_dir: SearchParams['sort_dir'],
    custom_getter?: (sort: string, item: E) => any,
  ) {
    if (!sort || !this.sortableFields.includes(sort)) return items;

    return [...items].sort((a, b) => {
      const aValue = custom_getter ? custom_getter(sort, a) : a[sort];
      const bValue = custom_getter ? custom_getter(sort, b) : b[sort];

      if (aValue < bValue) return sort_dir === 'asc' ? -1 : 1;

      if (aValue > bValue) return sort_dir === 'asc' ? 1 : -1;

      return 0;
    });
  }
}
