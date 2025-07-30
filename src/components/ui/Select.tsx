interface Option {
  value: string | number;
  label: string;

}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  className?: string;
  classNameDiv?: string;
}

export const Select: React.FC<SelectProps> = ({
   label = '', 
   options,
   className,
   classNameDiv,
  ...props 
  }) => (
  <div className={`
     ${classNameDiv ?? ''}
    `}>
    {label ?? (
    <label className="block text-sm font-medium text-gray-700 ">{label}</label>
    )}
    <select
      className={`
        my-3 block  border rounded-md border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500
        ${className ?? 'w-5/6'}
        `}
      {...props}
    >
      {options.map((option: Option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))} 
    </select>
  </div>
);