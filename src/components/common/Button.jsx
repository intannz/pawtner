const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, type = 'button', disabled }) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
  };

  const sizes = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={`btn ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${disabled ? 'btn-disabled' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;