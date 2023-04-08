import { InputHTMLAttributes, forwardRef, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  autoComplete?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,

    classNameInput = 'w-full border border-gray-200 p-3 outline-none focus:border-gray-400 focus:shadow-sm',
    classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    ///^d+$/.test(value) : test TH chỉ có số
    if (/^\d+$/.test(value) || value === '') {
      // Thực thi onChang callback từ bên ngoài truyển vào props
      onChange && onChange(event)
      // Cập nhật local value state
      setLocalValue(value)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} onChange={handleChange} value={value || localValue} {...rest} ref={ref} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
