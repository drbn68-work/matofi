import { Badge } from "@/components/ui/badge";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pagesToShow: number[]; // <-- ¡AÑADE ESTA LÍNEA!
}

export const Pagination = ({
  currentPage,
  pageCount,
  pagesToShow,
  onPageChange,
}: PaginationProps) => {
  if (pageCount <= 1) return null;

  return (
    <div className="mt-8 flex justify-center gap-2">
      {/* Botón Prev si currentPage > 1 */}
      {currentPage > 1 && (
        <Badge
          variant="outline"
          className="cursor-pointer"
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </Badge>
      )}

      {/* Renderizamos sólo las páginas que nos llegan en pagesToShow */}
      {pagesToShow.map((page) => (
        <Badge
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Badge>
      ))}

      {/* Botón Next si currentPage < pageCount */}
      {currentPage < pageCount && (
        <Badge
          variant="outline"
          className="cursor-pointer"
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Badge>
      )}
    </div>
  );
};
