import { Link } from 'react-router'

const host = (process.env.PUBLIC_HOST || '').replace(/^https?:\/\//, '')

export default function NotFound() {
  return (
    <div className="w-full min-h-dvh flex flex-col items-center justify-center gap-0 p-4">
      <h1 className="text-primary">{`${host}/404 :(`}</h1>
      <h3 className="mt-8">Not Found</h3>
      <p className="opacity-60 text-center">
        Sorry, we could not find the requested resource.
      </p>
      <Link to="/" className="btn btn-primary mt-4">
        Return Home
      </Link>
    </div>
  )
}
