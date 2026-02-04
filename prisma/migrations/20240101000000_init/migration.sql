-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" BYTEA NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);
