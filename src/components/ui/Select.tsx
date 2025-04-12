interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
}

export const Select: React.FC<SelectProps> = ({ label, options, ...props }) => (
  <div className="">
    <label className="block text-sm font-medium text-gray-700 ">{label}</label>
    <select
      className="my-3 block w-5/6 border rounded-md border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
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