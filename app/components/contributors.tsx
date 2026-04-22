import dayjs from 'dayjs'

export type ContributorsProps = {
  authors: string[]
  date?: Date
}

export default function Contributors({
  authors,
  date = new Date(),
}: ContributorsProps) {
  return (
    <span className="flex flex-row gap-1 items-center flex-wrap my-2">
      <p className="text-sm opacity-60">
        {dayjs(date).format('DD MMMM, YYYY')} by
      </p>
      {authors.map((name, i) => (
        <p key={`${name}/${i}`} className="text-sm font-semibold">
          {name}
          {!i && authors.length > 1 ? ',' : ''}
        </p>
      ))}
    </span>
  )
}
