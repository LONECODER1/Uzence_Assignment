import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";

export interface InputFieldProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    placeholder?: string;
    helperText?: string;
    errorMessage?: string;
    disabled?: boolean;
    invalid?: boolean;
    loading?: boolean;
    type?: "text" | "password";
    variant?: "filled" | "outlined" | "ghost";
    size?: "sm" | "md" | "lg";
    clearable?: boolean;
    className?: string;
}

const sizeStyles = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-5 py-3 text-base rounded-lg",
    lg: "px-7 py-4 text-lg rounded-xl",
};


const variantStyles = {
    filled: `
    bg-gray-100 dark:bg-gray-800 
    border border-transparent 
    focus:border-blue-500 focus:ring-2 focus:ring-blue-400 
    text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
  `,
    outlined: `
    border border-gray-300 dark:border-gray-600 
    bg-transparent 
    focus:border-blue-500 focus:ring-2 focus:ring-blue-400 
    text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
  `,
    ghost: `
    border border-transparent bg-transparent 
    focus:border-blue-500 focus:ring-2 focus:ring-blue-400 
    text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
  `,
};

export const InputField: React.FC<InputFieldProps> = ({
    value,
    onChange,
    label,
    placeholder,
    helperText,
    errorMessage,
    disabled = false,
    invalid = false,
    loading = false,
    type = "text",
    variant = "outlined",
    size = "md",
    clearable = false,
    className = "",
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className={`flex flex-col w-full ${className}`}>
            {label && (
                <label
                    className={`mb-1 text-sm font-medium ${disabled
                        ? "text-gray-400 dark:text-gray-500"
                        : "text-gray-700 dark:text-gray-200"
                        }`}
                >
                    {label}
                </label>
            )}

            <div className="relative flex items-center">
                <input
                    type={isPassword && showPassword ? "text" : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled || loading}
                    className={`w-full ${sizeStyles[size]} ${variantStyles[variant]} 
            ${invalid ? "border-red-500 dark:border-red-400 focus:ring-red-400" : ""}
            ${disabled ? "cursor-not-allowed opacity-60" : ""}
            transition-colors duration-200`}
                />

                {/* Clear button */}
                {clearable && value && !disabled && (
                    <button
                        type="button"
                        onClick={() =>
                            onChange?.({
                                target: { value: "" },
                            } as React.ChangeEvent<HTMLInputElement>)
                        }
                        className="absolute right-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={16} />
                    </button>
                )}

                {/* Password toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                )}

                {/* Loading spinner */}
                {loading && (
                    <div className="absolute right-2 animate-spin text-gray-400 dark:text-gray-300">
                        ⏳
                    </div>
                )}
            </div>

            {/* Helper/Error text */}
            {invalid && errorMessage ? (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {errorMessage}
                </p>
            ) : helperText ? (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {helperText}
                </p>
            ) : null}
        </div>
    );
};
