import dotenv from 'dotenv'
import app from './app.js'
dotenv.config()

console.log('CWD:', process.cwd())
console.log('SUPABASE_URL:', process.env.SUPABASE_URL)


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
})
