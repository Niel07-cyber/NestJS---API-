export class PostSlug {
  private readonly value: string;

  constructor(input: string) {
    this.value = input;
  }

  public static generate(title: string): string {
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 100);

    if (!slug || slug === '-') {
      slug = `post-${Math.random().toString(36).substring(2, 8)}`;
    }

    return slug;
  }

  public static validate(slug: string): boolean {
    if (!slug || slug.length < 3 || slug.length > 100) return false;
    if (slug.startsWith('-') || slug.endsWith('-')) return false;
    if (!/^[a-z0-9-]+$/.test(slug)) return false;
    return true;
  }

  toString(): string {
    return this.value;
  }
}