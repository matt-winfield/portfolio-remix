-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT,
    "publishedAt" DATETIME,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "slug" TEXT,
    "draft" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Article" ("content", "description", "draft", "id", "publishedAt", "slug", "tags", "title", "updatedAt") SELECT "content", "description", "draft", "id", "publishedAt", "slug", "tags", "title", "updatedAt" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
