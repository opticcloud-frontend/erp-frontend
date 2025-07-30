interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   label?: string;
   error?: string; 
   disabled?: boolean;
   className?: string;
   placeholder?: string;
   classNameDiv?: string;
}

export const Input: React.FC<InputProps> = ({
   label= '', 
   error, 
   value, 
   disabled = false,
   className,
   classNameDiv,
   placeholder,
    ...props 
   }) => (
   <div className={`
     ${classNameDiv ?? ''}
    `}>
      {label?? (
         <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
         placeholder={placeholder ?? ' '}
         readOnly={disabled}
         className={`
            my-2 w-full px-3 py-2 border rounded-md border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 
            ${error ? 'border-red-500' : 'border-gray-300'
         }
         ${className ?? ''}
         `
      }
         value={value ?? ""} 
         {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
   </div>
);
