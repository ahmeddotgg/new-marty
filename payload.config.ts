import { postgresAdapter } from "@payloadcms/db-postgres"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import path from "path"
import { buildConfig } from "payload"
import sharp from "sharp"
import { fileURLToPath } from "url"
import Media from "./collections/media"
import StoreItems from "./collections/store-items"
import StoreTypes from "./collections/store-types"
import Stores from "./collections/stores"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname)
    }
  },
  collections: [Media, Stores, StoreItems, StoreTypes],
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true
      },
      token: process.env.BLOB_READ_WRITE_TOKEN
    })
  ],
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts")
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || ""
    }
  }),
  sharp
})
