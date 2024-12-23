export const Box = ({
  children,
  title,
  className,
  ActionButton,
  Filters,
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
  ActionButton?: React.ReactNode;
  Filters?: React.ReactNode;
}) => {
  return (
    <div className={`border rounded-lg divide-y flex flex-col ${className}`}>
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between px-2 py-3">
        <h2 className="font-medium">{title}</h2>
        {Filters && Filters}
        {ActionButton && ActionButton}
      </div>
      <div className="flex-1 px-2 py-3">{children}</div>
    </div>
  );
};
