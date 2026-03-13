import { DataSource } from 'typeorm';
import { v4 } from 'uuid';

const dataSource = new DataSource({
  type: 'sqlite',
  database: 'db',
  entities: [__dirname + '/modules/**/*.sqlite.entity.{ts,js}'],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  await dataSource.query('DELETE FROM notifications');
  await dataSource.query('DELETE FROM subscriptions');
  await dataSource.query('DELETE FROM comments');
  await dataSource.query('DELETE FROM post_tags');
  await dataSource.query('DELETE FROM posts');
  await dataSource.query('DELETE FROM tags');
  await dataSource.query('DELETE FROM users');

  const readerUserId = v4();
  const writerUserId = v4();
  const moderatorUserId = v4();
  const adminUserId = v4();

  await dataSource.query(`
    INSERT INTO users (id, username, email, role, password) VALUES
    ('${readerUserId}', 'reader_user', 'reader@example.com', 'reader', 'password123'),
    ('${writerUserId}', 'writer_user', 'writer@example.com', 'writer', 'password123'),
    ('${moderatorUserId}', 'moderator_user', 'moderator@example.com', 'moderator', 'password123'),
    ('${adminUserId}', 'admin_user', 'admin@example.com', 'admin', 'password123')
  `);

  const tag1Id = v4();
  const tag2Id = v4();
  const tag3Id = v4();

  await dataSource.query(`
    INSERT INTO tags (id, name) VALUES
    ('${tag1Id}', 'typescript'),
    ('${tag2Id}', 'nodejs'),
    ('${tag3Id}', 'javascript')
  `);

  const draftPostId = v4();
  const pendingPostId = v4();
  const publishedPostId = v4();
  const rejectedPostId = v4();
  const now = new Date().toISOString();

  await dataSource.query(`
    INSERT INTO posts (id, title, content, status, authorId, slug, createdAt, updatedAt, publishedAt) VALUES
    ('${draftPostId}', 'My Draft Article', 'This is a draft...', 'draft', '${writerUserId}', 'my-draft-article', '${now}', '${now}', NULL),
    ('${pendingPostId}', 'Article Pending Review', 'Waiting for approval...', 'waiting', '${writerUserId}', 'article-pending-review', '${now}', '${now}', NULL),
    ('${publishedPostId}', 'Published Article', 'This is published...', 'accepted', '${writerUserId}', 'published-article', '${now}', '${now}', '${now}'),
    ('${rejectedPostId}', 'Rejected Article', 'This was rejected...', 'rejected', '${writerUserId}', 'rejected-article', '${now}', '${now}', NULL)
  `);

  await dataSource.query(`
    INSERT INTO post_tags ("postId", "tagId") VALUES
    ('${publishedPostId}', '${tag1Id}'),
    ('${publishedPostId}', '${tag2Id}'),
    ('${draftPostId}', '${tag3Id}')
  `);

  const comment1Id = v4();
  const comment2Id = v4();

  await dataSource.query(`
    INSERT INTO comments (id, postId, authorId, content, createdAt, updatedAt) VALUES
    ('${comment1Id}', '${publishedPostId}', '${readerUserId}', 'Great article!', '${now}', '${now}'),
    ('${comment2Id}', '${publishedPostId}', '${readerUserId}', 'Very informative, thanks!', '${now}', '${now}')
  `);

  await dataSource.query(`
    INSERT INTO subscriptions ("followerId", "followedId", "followedAt") VALUES
    ('${readerUserId}', '${writerUserId}', '${now}')
  `);

  console.log('Seed completed successfully!');
  console.log('Users created:');
  console.log('  - reader_user / password123 (reader)');
  console.log('  - writer_user / password123 (writer)');
  console.log('  - moderator_user / password123 (moderator)');
  console.log('  - admin_user / password123 (admin)');

  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
