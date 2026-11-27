import React from "react";
import Spinner from "@/components/ui/bootstrap/spinner";

/**
 * Defines a column configuration in declarative data mode for {@link Table}.
 *
 * @template T - The row item data type.
 */
export interface TableColumn<T> {
  /** Unique key identifying this column or matching an item property. */
  key: string;

  /** Header title or React node displayed in the `<thead>`. */
  header: React.ReactNode;

  /** Optional fixed width for the column (e.g. `"150px"`, `200`, `"20%"`). */
  width?: string | number;

  /** Text alignment in column header and body cells. Defaults to `"start"`. */
  align?: "start" | "center" | "end";

  /** Custom CSS classes applied to the `<th>` header element. */
  headerClassName?: string;

  /** Custom CSS classes applied to each `<td>` cell, or a callback per row item. */
  className?: string | ((item: T, index: number) => string | undefined);

  /** Custom cell render function. Receives `(item, index)`. */
  render?: (item: T, index: number) => React.ReactNode;

  /** Whether clicking the column header triggers sorting. Defaults to true if table is sortable. */
  sortable?: boolean;
}

/**
 * Common styling and layout properties shared across all table modes.
 */
interface TableBaseProps extends Omit<
  React.TableHTMLAttributes<HTMLTableElement>,
  "border" | "children"
> {
  /** Striped row or column styling variant. */
  stripped?: "row" | "column";

  /** Enables highlight on row hover. */
  hover?: boolean;

  /** Border styling variant (`"bordered"` | `"borderless"`). */
  border?: "bordered" | "borderless";

  /** Compact table sizing. */
  size?: "sm";

  /** Optional table caption text. */
  caption?: string;

  /** Position of caption element: `"top"` or `"bottom"`. Defaults to `"bottom"`. */
  captionPosition?: "top" | "bottom";

  /** Wraps the table inside a responsive container (`table-responsive`). */
  responsive?: boolean;

  /** Responsive breakpoint for container (`"sm"` | `"md"` | `"lg"` | `"xl"` | `"xxl"`). */
  responsiveBreakpoint?: "sm" | "md" | "lg" | "xl" | "xxl";

  /** CSS class applied to `<thead>`. */
  theadClassName?: string;

  /** CSS class applied to the header `<tr>`. */
  headerRowClassName?: string;

  /** CSS class applied to `<tbody>`. */
  tbodyClassName?: string;

  /** CSS class applied to `<tfoot>`. */
  tfootClassName?: string;

  /** Custom footer node rendered in `<tfoot>`. */
  footer?: React.ReactNode;

  /** Displays a loading state with spinner overlay/row. */
  isLoading?: boolean;

  /** Custom text or node displayed during loading. Defaults to "Memuat data...". */
  loadingText?: React.ReactNode;
}

/**
 * Table mode that accepts raw HTML table children (`<thead>`, `<tbody>`, etc.).
 */
type TableWithChildren = {
  children?: React.ReactNode;
  columns?: never;
  items?: never;
  rowKey?: never;
  emptyText?: never;
  rowClassName?: never;
  sortable?: never;
  sortKey?: never;
  sortOrder?: never;
  onSort?: never;
};

/**
 * Table mode that accepts declarative `columns` and `items` data arrays.
 *
 * @template T - The row item data type.
 */
type TableWithData<T> = {
  children?: never;
  /** Array of column configurations. */
  columns: TableColumn<T>[];
  /** Array of data items to render as table rows. */
  items: T[];
  /** Unique key extractor or property name for table row React keys. */
  rowKey?: keyof T | ((item: T, index: number) => string | number);
  /** Custom CSS classes applied to each `<tr>`, or a function returning classes. */
  rowClassName?: string | ((item: T, index: number) => string | undefined);
  /** Node or message displayed when `items` is empty. Defaults to "Tidak ada data.". */
  emptyText?: React.ReactNode;
  /** Enables interactive column header sorting. */
  sortable?: boolean;
  /** Currently active sort column key. */
  sortKey?: string;
  /** Currently active sort direction (`"asc"` | `"desc"`). */
  sortOrder?: "asc" | "desc";
  /** Callback fired when a sortable column header is clicked. */
  onSort?: (key: string) => void;
};

/**
 * Props for the {@link Table} component, supporting either declarative data arrays
 * or standard React children.
 *
 * @template T - The row item data type.
 */
export type TableProps<T = Record<string, unknown>> = TableBaseProps &
  (TableWithChildren | TableWithData<T>);

/**
 * Reusable Bootstrap table component supporting two modes:
 * 1. **Declarative data mode**: Pass `columns` and `items` for built-in sorting, empty state, and loading spinners.
 * 2. **Children mode**: Pass standard `children` (`<thead>`, `<tbody>`) for custom table layouts.
 *
 * @template T - The row item data type.
 */
export default function Table<T = Record<string, unknown>>({
  stripped,
  hover = false,
  border,
  size,
  caption,
  captionPosition = "bottom",
  responsive = false,
  responsiveBreakpoint,
  className = "",
  style,
  theadClassName = "",
  headerRowClassName = "",
  tbodyClassName = "",
  tfootClassName = "",
  footer,
  // Data mode props
  columns,
  items,
  rowKey,
  rowClassName,
  emptyText = "Tidak ada data.",
  isLoading = false,
  loadingText = "Memuat data...",
  sortable = true,
  sortKey,
  sortOrder = "asc",
  onSort,
  // Children mode prop
  children,
  ...props
}: TableProps<T>) {
  const tableClass = [
    "table",
    stripped === "row" && "table-striped",
    stripped === "column" && "table-striped-columns",
    hover && "table-hover",
    border === "bordered" && "table-bordered",
    border === "borderless" && "table-borderless",
    size === "sm" && "table-sm",
    captionPosition === "top" && "caption-top",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const getRowKey = (item: T, index: number): string | number => {
    if (typeof rowKey === "function") return rowKey(item, index);
    if (typeof rowKey === "string" && rowKey in (item as object)) {
      return (item as Record<string, unknown>)[rowKey] as string | number;
    }
    return ((item as Record<string, unknown>)?.id as string | number) ?? index;
  };

  const renderContent = () => {
    if (children) {
      return children;
    }

    if (columns) {
      return (
        <>
          <thead className={theadClassName}>
            <tr className={headerRowClassName}>
              {columns.map((col) => {
                const isSortable = Boolean(sortable && col.sortable && onSort);
                const isCurrentSort = sortKey === col.key;

                return (
                  <th
                    key={col.key}
                    style={col.width ? { width: col.width } : undefined}
                    onClick={isSortable ? () => onSort?.(col.key) : undefined}
                    role={isSortable ? "button" : undefined}
                    tabIndex={isSortable ? 0 : undefined}
                    onKeyDown={
                      isSortable
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onSort?.(col.key);
                            }
                          }
                        : undefined
                    }
                    className={[
                      col.align && `text-${col.align}`,
                      isSortable && "user-select-none",
                      col.headerClassName,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    title={
                      isSortable
                        ? `Urutkan berdasarkan ${typeof col.header === "string" ? col.header : col.key}`
                        : undefined
                    }
                  >
                    <div
                      className={[
                        "d-inline-flex align-items-center gap-1",
                        col.align === "end" && "justify-content-end w-100",
                        col.align === "center" && "justify-content-center w-100",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span
                          className="d-inline-flex align-items-center justify-content-center ms-1 text-nowrap"
                          style={{ fontSize: "0.85em" }}
                          aria-hidden="true"
                        >
                          {isCurrentSort ? (
                            sortOrder === "asc" ? (
                              <i className="bi bi-arrow-up text-primary fw-bold" />
                            ) : (
                              <i className="bi bi-arrow-down text-primary fw-bold" />
                            )
                          ) : (
                            <i className="bi bi-arrow-down-up text-body-tertiary opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={tbodyClassName}>
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center text-body-secondary py-5"
                >
                  <Spinner size="sm" className="me-2 align-middle" />
                  <span className="align-middle small">{loadingText}</span>
                </td>
              </tr>
            ) : items && items.length > 0 ? (
              items.map((item, index) => {
                const trClass =
                  typeof rowClassName === "function"
                    ? rowClassName(item, index)
                    : rowClassName;

                return (
                  <tr key={getRowKey(item, index)} className={trClass}>
                    {columns.map((col) => {
                      const tdClass =
                        typeof col.className === "function"
                          ? col.className(item, index)
                          : col.className;

                      return (
                        <td
                          key={col.key}
                          className={[col.align && `text-${col.align}`, tdClass]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {col.render
                            ? col.render(item, index)
                            : (((item as Record<string, unknown>)[
                                col.key
                              ] as React.ReactNode) ?? "-")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center text-muted py-4"
                >
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
          {footer && <tfoot className={tfootClassName}>{footer}</tfoot>}
        </>
      );
    }

    return null;
  };

  const tableElement = (
    <table className={tableClass} style={style} {...props}>
      {caption && <caption>{caption}</caption>}
      {renderContent()}
    </table>
  );

  if (responsive) {
    const responsiveClass = responsiveBreakpoint
      ? `table-responsive-${responsiveBreakpoint}`
      : "table-responsive";
    return <div className={responsiveClass}>{tableElement}</div>;
  }

  return tableElement;
}
