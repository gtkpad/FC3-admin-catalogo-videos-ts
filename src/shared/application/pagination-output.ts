import { SearchResult } from "../domain/repository/search-result";

export type PaginationOutput<Item = any> = {
  items: Item[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
};

export class PaginationOutputMapper {
  static toOutput<Item = any>(
    items: Item[],
    props: Omit<SearchResult, "items">
  ): PaginationOutput<Item> {
    const { current_page, last_page, per_page, total } = props;
    return {
      items,
      current_page,
      last_page,
      per_page,
      total,
    };
  }
}
