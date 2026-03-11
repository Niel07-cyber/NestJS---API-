import { v4 } from 'uuid';
import { CommentContent } from '../value-objects/comment-content.value-object';

export class CommentEntity {
  private _content: CommentContent;
  private _postId: string;
  private _authorId: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    readonly id: string,
    content: CommentContent,
    postId: string,
    authorId: string,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this._content = content;
    this._postId = postId;
    this._authorId = authorId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public get authorId() {
    return this._authorId;
  }

  public get postId() {
    return this._postId;
  }

  public static create(content: string, postId: string, authorId: string): CommentEntity {
    const now = new Date();
    return new CommentEntity(v4(), new CommentContent(content), postId, authorId, now, now);
  }

  public static reconstitute(input: Record<string, unknown>): CommentEntity {
    return new CommentEntity(
      input.id as string,
      new CommentContent(input.content as string),
      input.postId as string,
      input.authorId as string,
      new Date(input.createdAt as string),
      new Date(input.updatedAt as string),
    );
  }

  public update(content: string): void {
    this._content = new CommentContent(content);
    this._updatedAt = new Date();
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      postId: this._postId,
      content: this._content.toString(),
      authorId: this._authorId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
