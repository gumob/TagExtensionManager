import React from 'react';

interface ButtonXLargeComponentProps {
  className?: string;
  onClick: () => void;
  children?: React.ReactNode;
}

export const ButtonXLargeComponent: React.FC<ButtonXLargeComponentProps> = ({
  className = 'bg-zinc-600 dark:bg-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-600',
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={`h-10 px-3 py-2 text-sm font-medium rounded-full text-zinc-100 focus:outline-none transition-colors ${className}`}
    >
      {children}
    </button>
  );
};

export const AddButtonComponent: React.FC<ButtonXLargeComponentProps> = ({ onClick }) => {
  return (
    <ButtonXLargeComponent
      className="bg-zinc-600 dark:bg-zinc-500 hover:bg-zinc-300 dark:hover:bg-zinc-600"
      onClick={onClick}
    >
      Add
    </ButtonXLargeComponent>
  );
};

export const DeleteButtonComponent: React.FC<ButtonXLargeComponentProps> = ({ onClick }) => {
  return (
    <ButtonXLargeComponent
      className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500"
      onClick={onClick}
    >
      Delete
    </ButtonXLargeComponent>
  );
};

export const CancelButtonComponent: React.FC<ButtonXLargeComponentProps> = ({ onClick }) => {
  return (
    <ButtonXLargeComponent
      className="bg-zinc-400 dark:bg-zinc-600 hover:bg-zinc-500 dark:hover:bg-zinc-500"
      onClick={onClick}
    >
      Cancel
    </ButtonXLargeComponent>
  );
};
