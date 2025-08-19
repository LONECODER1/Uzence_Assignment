import React, { useState } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff, Loader2, X } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label: string;
    variant?: 'outlined' | 'filled' | 'ghost';
    inputSize?: 'small' | 'medium' | 'large';
    theme?: 'light' | 'dark' | 'system';
    helperText?: string;
    errorMessage?: string;
    isLoading?: boolean;
    isInvalid?: boolean;
    isDisabled?: boolean;
    showClearButton?: boolean;
    onClear?: () => void;
}

export const Input = ({
    variant = 'outlined',
    inputSize = 'medium',
    theme = 'system',
    label,
    helperText,
    errorMessage,
    isLoading = false,
    isInvalid = false,
    isDisabled = false,
    showClearButton = false,
    onClear,
    id,
    type = 'text',
    value,
    className,
    ...props
}: InputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const hasContent = Boolean(value && value.toString().length > 0);
    const shouldFloatLabel = isFocused || hasContent;

    const baseInputClasses =
        'peer w-full bg-transparent outline-none transition-all duration-300 ease-out placeholder-transparent';

    const sizeClasses = {
        small: {
            input: 'px-3 pt-5 pb-1 text-sm',
            container: 'h-12',
            label: 'text-xs',
            labelFloat: 'text-xs top-2',
            labelRest: 'text-sm top-3.5',
            icon: 'h-4 w-4',
        },
        medium: {
            input: 'px-4 pt-6 pb-2 text-base',
            container: 'h-14',
            label: 'text-sm',
            labelFloat: 'text-xs top-2',
            labelRest: 'text-base top-4',
            icon: 'h-5 w-5',
        },
        large: {
            input: 'px-4 pt-7 pb-2 text-lg',
            container: 'h-16',
            label: 'text-base',
            labelFloat: 'text-sm top-2',
            labelRest: 'text-lg top-4',
            icon: 'h-6 w-6',
        },
    };

    const currentSize = sizeClasses[inputSize];

    const variantClasses = {
        outlined: clsx(
            'border-2 rounded-lg bg-transparent',
            isFocused && !isInvalid
                ? 'border-blue-600 shadow-lg shadow-blue-600/20'
                : 'border-gray-300 hover:border-gray-400',
            'dark:border-gray-600 dark:hover:border-gray-500',
            isFocused && !isInvalid && 'dark:border-blue-500 dark:shadow-blue-500/20'
        ),
        filled: clsx(
            'border-b-2 border-t-0 border-l-0 border-r-0 rounded-t-lg bg-gray-50',
            'hover:bg-gray-100 hover:shadow-md',
            isFocused && !isInvalid
                ? 'border-blue-600 bg-gray-50 shadow-lg shadow-blue-600/10'
                : 'border-gray-300',
            'dark:bg-gray-800 dark:hover:bg-gray-750 dark:border-gray-600',
            isFocused && !isInvalid && 'dark:border-blue-500 dark:bg-gray-800'
        ),
        ghost: clsx(
            'border-b-2 border-t-0 border-l-0 border-r-0 bg-transparent',
            'hover:bg-gray-50 hover:shadow-sm',
            isFocused && !isInvalid
                ? 'border-blue-600 bg-gray-50/50'
                : 'border-gray-300',
            'dark:hover:bg-gray-800 dark:border-gray-600',
            isFocused && !isInvalid && 'dark:border-blue-500 dark:bg-gray-800/50'
        ),
    };

    const stateClasses = clsx({
        'opacity-60 cursor-not-allowed': isDisabled,
        '!border-red-500 hover:!border-red-600': isInvalid,
        'dark:!border-red-400': isInvalid,
    });

    const handleClear = () => onClear?.();
    const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev);
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        props.onFocus?.(e);
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        props.onBlur?.(e);
    };

    const isPasswordType = type === 'password';
    const inputType = isPasswordType && isPasswordVisible ? 'text' : type;

    const hasClearButton = showClearButton && hasContent && !isDisabled && !isLoading;
    const hasPasswordToggle = isPasswordType && !isDisabled && !isLoading;
    const hasIcons = hasClearButton || hasPasswordToggle || isLoading;

    const iconPadding = hasIcons ? (inputSize === 'small' ? 'pr-12' : inputSize === 'medium' ? 'pr-14' : 'pr-16') : '';

    return (
        <div
            className={clsx('w-full font-sans', {
                dark: theme === 'dark',
                light: theme === 'light',
            })}
        >
            <div className={clsx('relative', currentSize.container)}>
                <input
                    id={id}
                    type={inputType}
                    value={value}
                    disabled={isDisabled}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={clsx(
                        baseInputClasses,
                        currentSize.input,
                        variantClasses[variant],
                        stateClasses,
                        iconPadding,
                        'text-gray-900 dark:text-gray-100',
                        className
                    )}
                    placeholder={label}
                    {...props}
                />

                <label
                    htmlFor={id}
                    className={clsx(
                        'absolute left-4 pointer-events-none transition-all duration-300 ease-out origin-left',
                        shouldFloatLabel
                            ? clsx(
                                currentSize.labelFloat,
                                isInvalid
                                    ? 'text-red-500 dark:text-red-400'
                                    : isFocused
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-500 dark:text-gray-400'
                            )
                            : clsx(
                                currentSize.labelRest,
                                isInvalid
                                    ? 'text-red-400'
                                    : 'text-gray-500 dark:text-gray-400'
                            ),
                        isDisabled && 'opacity-60'
                    )}
                >
                    {label}
                </label>

                {hasIcons && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        {isLoading && (
                            <Loader2 className={clsx(
                                currentSize.icon,
                                'animate-spin text-gray-400 dark:text-gray-500'
                            )} />
                        )}

                        {hasClearButton && (
                            <button
                                type="button"
                                onClick={handleClear}
                                aria-label="Clear input"
                                className={clsx(
                                    'group rounded-full p-1 transition-all duration-200',
                                    'hover:bg-gray-100 active:bg-gray-200',
                                    'dark:hover:bg-gray-700 dark:active:bg-gray-600'
                                )}
                            >
                                <X className={clsx(
                                    currentSize.icon,
                                    'text-gray-400 transition-colors duration-200',
                                    'group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                )} />
                            </button>
                        )}

                        {hasPasswordToggle && (
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                                className={clsx(
                                    'group rounded-full p-1 transition-all duration-200',
                                    'hover:bg-gray-100 active:bg-gray-200',
                                    'dark:hover:bg-gray-700 dark:active:bg-gray-600'
                                )}
                            >
                                {isPasswordVisible ? (
                                    <EyeOff className={clsx(
                                        currentSize.icon,
                                        'text-gray-400 transition-colors duration-200',
                                        'group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                    )} />
                                ) : (
                                    <Eye className={clsx(
                                        currentSize.icon,
                                        'text-gray-400 transition-colors duration-200',
                                        'group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                    )} />
                                )}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {isInvalid && errorMessage && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 animate-in slide-in-from-top-1 duration-300">
                    {errorMessage}
                </p>
            )}

            {!isInvalid && helperText && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {helperText}
                </p>
            )}
        </div>
    );
};

export default function InputDemo() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="max-w-md mx-auto p-8 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Google-Style Inputs
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Material Design inspired input components
                </p>
            </div>

            <div className="space-y-6">
                <Input
                    id="name"
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                    showClearButton
                    onClear={() => setName('')}
                    helperText="Enter your full legal name"
                />

                <Input
                    id="email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="filled"
                    showClearButton
                    onClear={() => setEmail('')}
                    isInvalid={email.length > 0 && !email.includes('@')}
                    errorMessage="Please enter a valid email address"
                />

                <Input
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                    showClearButton
                    onClear={() => setPassword('')}
                    helperText="Must be at least 8 characters long"
                />

                <Input
                    id="loading-demo"
                    label="Loading State"
                    value="Processing..."
                    variant="filled"
                    isLoading={isLoading}
                    isDisabled={isLoading}
                />

                <button
                    onClick={() => {
                        setIsLoading(!isLoading);
                        setTimeout(() => setIsLoading(false), 3000);
                    }}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                    Toggle Loading State
                </button>
            </div>

            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Features:</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <li>• Floating labels with smooth animations</li>
                    <li>• Password toggle with eye icon</li>
                    <li>• Clear button functionality</li>
                    <li>• Enhanced hover and focus effects</li>
                    <li>• Google Material Design styling</li>
                    <li>• Dark mode support</li>
                    <li>• Loading states</li>
                    <li>• Error validation</li>
                </ul>
            </div>
        </div>
    );
}
