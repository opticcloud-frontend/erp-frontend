interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
}

export const Select: React.FC<SelectProps> = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 ">{label}</label>
    <select
      className="my-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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