import { cn } from "@/lib/utils";

type FormInputProps = {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
};

const inputClassName =
  "w-full px-3 py-2 border border-primary-700 rounded-md bg-primary-800 text-white placeholder:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow";

export function FormInput({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  className,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white mb-1.5">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </label>
      <input
        type={type}
        id={id}
        required={required}
        value={value}
        onChange={onChange}
        className={cn(inputClassName, className)}
        placeholder={placeholder}
      />
    </div>
  );
}

type FormTextareaProps = {
  label: string;
  id: string;
  rows?: number;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
};

export function FormTextarea({
  label,
  id,
  rows = 3,
  placeholder,
  value,
  onChange,
  className,
}: FormTextareaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white mb-1.5">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        className={cn(inputClassName, "resize-none", className)}
        placeholder={placeholder}
      />
    </div>
  );
}
