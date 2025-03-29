interface Props {
  field: string
  value: string
}

export default function MyInfo({ field, value }: Props) {
  return (
    <li className="text-[1.4rem] uppercase prose">
      {field}
      <span className="text-4xl mx-2"> . . . .</span>
      <span className="text-2xl normal-case"> {value}</span>
    </li>
  )
}
// Irvr7(3ht%rxNcq(ult$8XDO
// nrK#-YP2FAt3Jg4
