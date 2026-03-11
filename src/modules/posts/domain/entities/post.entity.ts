import { v4 } from 'uuid';
import { PostContent } from '../value-objects/post-content.value-object';
import { PostTitle } from '../value-objects/post-title.value-object';
import { InvalidPostTransitionException } from '../exceptions/invalid-post-transition.exception';

export type PostStatus = 'draft' | 'waiting' | 'accepted' | 'rejected';

export class PostEntity {
  private _title: PostTitle;
  private _content: PostContent;
  private _authorId: string;
  private _status: PostStatus;
  private _tags: { id: string; name: string }[];
  private _slug: string;

  private constructor(
    readonly id: string,
    title: PostTitle,
    content: PostContent,
    authorId: string,
    status: PostStatus,
    tags: { id: string; name: string }[] = [],
    slug: string = '',
  ) {
    this._title = title;
    this._content = content;
    this._authorId = authorId;
    this._status = status;
    this._tags = tags;
    this._slug = slug;
  }

  public get status() {
    return this._status;
  }

  public get authorId() {
    return this._authorId;
  }

  public get slug() {
    return this._slug;
  }

  public static reconstitute(input: Record<string, unknown>) {
    return new PostEntity(
      input.id as string,
      new PostTitle(input.title as string),
      new PostContent(input.content as string),
      input.authorId as string,
      input.status as PostStatus,
      (input.tags as { id: string; name: string }[]) ?? [],
      (input.slug as string) ?? '',
    );
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      title: this._title.toString(),
      content: this._content.toString(),
      status: this._status,
      authorId: this._authorId,
      slug: this._slug,
      tags: this._tags ?? [],
    };
  }

  public static create(
    title: string,
    content: string,
    authorId: string,
    slug: string = '',
  ): PostEntity {
    return new PostEntity(
      v4(),
      new PostTitle(title),
      new PostContent(content),
      authorId,
      'draft',
      [],
      slug,
    );
  }

  public update(title?: string, content?: string) {
    if (title) {
      this._title = new PostTitle(title);
    }
    if (content) {
      this._content = new PostContent(content);
    }
  }

  public updateSlug(slug: string): void {
    this._slug = slug;
  }

  public submitForReview(): void {
    if (this._status !== 'draft') {
      throw new InvalidPostTransitionException();
    }
    this._status = 'waiting';
  }

  public approve(): void {
    if (this._status !== 'waiting') {
      throw new InvalidPostTransitionException();
    }
    this._status = 'accepted';
  }

  public reject(): void {
    if (this._status !== 'waiting') {
      throw new InvalidPostTransitionException();
    }
    this._status = 'rejected';
  }
}