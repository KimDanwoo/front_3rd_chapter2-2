type InputFieldPropsUnion = { type: 'text'; value: string } | { type: 'number'; value: number }

type InputFieldProps = {
  id?: string
  name?: string
  placeholder?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  className?: string
} & InputFieldPropsUnion

export const InputField = ({ ...props }: InputFieldProps) => {
  const { label, ...inputProps } = props
  const className = props.className || 'w-full p-2 border rounded'
  return (
    <>
      {label && (
        <label className="block mb-1 block text-sm font-medium text-gray-700" htmlFor={inputProps.id}>
          {label}:
        </label>
      )}

      <input {...inputProps} className={className} />
    </>
  )
}
