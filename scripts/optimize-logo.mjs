import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

// WebP version (used by browsers that support it)
await sharp(join(publicDir, 'logo.png'))
  .resize(512, 512, { fit: 'cover' })
  .webp({ quality: 85 })
  .toFile(join(publicDir, 'logo.webp'))

// Compressed PNG fallback (keeps original for favicon compatibility)
await sharp(join(publicDir, 'logo.png'))
  .resize(512, 512, { fit: 'cover' })
  .png({ compressionLevel: 9, palette: false })
  .toFile(join(publicDir, 'logo-opt.png'))

const statsOriginal = (await import('fs')).statSync(join(publicDir, 'logo.png'))
const statsWebp     = (await import('fs')).statSync(join(publicDir, 'logo.webp'))
const statsPng      = (await import('fs')).statSync(join(publicDir, 'logo-opt.png'))

console.log(`Original:      ${(statsOriginal.size / 1024).toFixed(0)} KB`)
console.log(`logo.webp:     ${(statsWebp.size / 1024).toFixed(0)} KB`)
console.log(`logo-opt.png:  ${(statsPng.size / 1024).toFixed(0)} KB`)
