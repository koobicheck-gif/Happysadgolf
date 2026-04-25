'use client'
import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-masters-green text-white hover:bg-masters-green-dark active:scale-95',
  secondary: 'bg-masters-gold text-masters-dark hover:bg-yellow-600 active:scale-95',
  ghost: 'bg-transparent text-masters-green border border-masters-green hover:bg-masters-green-light active:scale-95',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95',
}

const sizes = {
  sm: 'text-sm px-3 py-1.5 rounded-lg',
  md: 'text-base px-5 py-2.5 rounded-xl',
  lg: 'text-lg px-6 py-3.5 rounded-2xl font-semibold',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        font-semibold transition-all duration-150 shadow-sm
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
