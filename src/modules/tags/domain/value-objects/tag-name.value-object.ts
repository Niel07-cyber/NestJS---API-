export class TagName {
  private readonly value: string;

  constructor(input: string) {
    this.validate(input);
    this.value = input.toLowerCase();
  }

  private validate(input: string): void {
    if (!input || input.trim().length === 0) {
      throw new Error('Tag name cannot be empty');
    }
    if (input.length < 2) {
      throw new Error('Tag name too short (min 2 chars)');
    }
    if (input.length > 50) {
      throw new Error('Tag name too long (max 50 chars)');
    }
    if (!/^[a-z0-9-]+$/.test(input.toLowerCase())) {
      throw new Error(
        'Tag name must be lowercase alphanumeric and may contain hyphens',
      );
    }
  }

  toString(): string {
    return this.value;
  }
}