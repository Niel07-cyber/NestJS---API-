import { v4 } from 'uuid';
import { TagName } from '../value-objects/tag-name.value-object';

export class TagEntity {
  private _name: TagName;

  private constructor(
    readonly id: string,
    name: TagName,
    readonly createdAt: Date,
  ) {
    this._name = name;
  }

  public get name() {
    return this._name.toString();
  }

  public static create(name: string): TagEntity {
    return new TagEntity(v4(), new TagName(name), new Date());
  }

  public update(name: string): void {
    this._name = new TagName(name);
  }

  public static reconstitute(input: Record<string, unknown>): TagEntity {
    return new TagEntity(
      input.id as string,
      new TagName(input.name as string),
      new Date(input.createdAt as string),
    );
  }

  public toJSON() {
    return {
      id: this.id,
      name: this._name.toString(),
      createdAt: this.createdAt,
    };
  }
}