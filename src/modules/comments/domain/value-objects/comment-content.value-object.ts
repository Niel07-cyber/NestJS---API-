import { InvalidCommentContentException } from '../exceptions/invalid-comment-content.exception';

export class CommentContent {
  private readonly value: string;

  constructor(content: string) {
    if (!content || content.trim().length === 0) {
      throw new InvalidCommentContentException();
    }
    if (content.length > 1000) {
      throw new InvalidCommentContentException();
    }
    this.value = content.trim();
  }

  toString(): string {
    return this.value;
  }
}
