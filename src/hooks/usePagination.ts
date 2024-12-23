import { useEffect, useState } from "react";

type UsePaginationProps = {
  data: any;
};

export const usePagination = ({ data }: UsePaginationProps) => {
  const pageSize = 20;

  const pageCount = Math.ceil(data?.length / pageSize);

  const [currentPage, setCurrentPage] = useState(0);

  const [filteredData, setFilteredData] = useState([]);

  const setPage = (pageNum: number) => {
    setCurrentPage(pageNum);
  };

  useEffect(() => {
    setFilteredData(
      data?.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
    );
  }, [data, currentPage]);

  return {
    data: filteredData,
    currentPage: currentPage + 1,
    totalPage: pageCount,
    setPage,
  };
};
