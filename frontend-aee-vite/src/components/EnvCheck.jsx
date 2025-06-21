export default function EnvCheck() {
  return (
    <div>
      <p>GOOGLE_CLIENT_ID: {import.meta.env.VITE_GOOGLE_CLIENT_ID}</p>
      <p>API_BASE_URL: {import.meta.env.VITE_API_BASE_URL}</p>
      <p>APP_MODE: {import.meta.env.VITE_APP_MODE}</p>
    </div>
  )
}
