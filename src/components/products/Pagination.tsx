
import { Badge } from "@/components/ui/badge";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, pageCount, onPageChange }: PaginationProps) => {
  if (pageCount <= 1) return null;

  return (
    <div className="mt-8 flex justify-center gap-2">
      {Array.from({ length: pageCount }).map((_, index) => (
        <Badge
          key={index}
          variant={currentPage === index + 1 ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </Badge>
      ))}
    </div>
  );
};
