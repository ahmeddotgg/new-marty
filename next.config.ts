import { withPayload } from "@payloadcms/next/withPayload"

const nextConfig = {
  allowedDevOrigins: ["192.168.1.3"]
}

export default withPayload(nextConfig)
