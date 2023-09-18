-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Qualification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_Qualification" ("date", "id", "institution", "title") SELECT "date", "id", "institution", "title" FROM "Qualification";
DROP TABLE "Qualification";
ALTER TABLE "new_Qualification" RENAME TO "Qualification";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
