const Pagination = ({
  totalPage,
  currentPage,
  setPage,
}: {
  totalPage: number;
  currentPage: number;
  setPage(number: number): void;
}) => {
  return (
    <div className="flex items-center justify-center mt-5 mb-4">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: totalPage }, (_, idx) => (
          <button
            className={`rounded-md border w-9 py-1 ${
              idx + 1 === currentPage && "bg-green-600 text-white"
            }`}
            key={idx}
            onClick={() => {
              setPage(idx);
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
