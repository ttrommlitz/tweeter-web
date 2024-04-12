export class DataPage<T> {
  items: T[];
  hasMorePages: boolean;

  constructor(items: T[], hasMorePages: boolean) {
    this.items = items;
    this.hasMorePages = hasMorePages;
  }
}