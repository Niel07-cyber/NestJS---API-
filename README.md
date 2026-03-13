# Medium-like API - Software Architecture Final Project

## Tech Stack
- NestJS, TypeORM, SQLite, EventEmitter2, JWT/Passport

## Setup
```bash
npm install
```

## Environment
Create a `.env` file:
```
PORT=3000
DATABASE_URL=db
NODE_ENV=development
```

## Running the app
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Seed the database
```bash
npm run seed
```

### Seed credentials
| Username | Password | Role |
|----------|----------|------|
| reader_user | password123 | reader |
| writer_user | password123 | writer |
| moderator_user | password123 | moderator |
| admin_user | password123 | admin |

## Features Implemented

### Feature 1: Tags System
- `POST /tags` — Create tag (admin only)
- `GET /tags` — List all tags
- `PATCH /tags/:id` — Update tag (admin only)
- `DELETE /tags/:id` — Delete tag (admin only)
- `POST /posts/:postId/tags/:tagId` — Add tag to post
- `DELETE /posts/:postId/tags/:tagId` — Remove tag from post
- `GET /posts?tags=typescript,nodejs` — Filter posts by tags

### Feature 2: Post Slugs
- Auto-generated from title on creation
- Unique enforcement with -2, -3 suffix
- `GET /posts/:slug` — Get post by slug
- `PATCH /posts/:id/slug` — Manual slug override

### Feature 3: Comments
- `POST /posts/:postId/comments` — Create comment
- `GET /posts/:postId/comments` — List comments (paginated)
- `GET /posts/:postId/comments/count` — Comment count
- `PATCH /comments/:id` — Update comment (author only)
- `DELETE /comments/:id` — Delete comment (author, post author, moderator, admin)

### Feature 4: Subscriptions & Notifications
- `POST /users/:userId/follow` — Follow user
- `DELETE /users/:userId/follow` — Unfollow user
- `GET /users/:userId/followers` — Get followers
- `GET /users/:userId/following` — Get following
- `GET /notifications` — Get my notifications
- `PATCH /notifications/:id/read` — Mark as read
- `POST /notifications/mark-all-read` — Mark all as read

## Running tests
```bash
npm run test
```
