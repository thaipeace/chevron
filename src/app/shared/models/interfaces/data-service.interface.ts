export abstract class IDataService<T> {
    abstract findById(id: string): T | Promise<T>;
}