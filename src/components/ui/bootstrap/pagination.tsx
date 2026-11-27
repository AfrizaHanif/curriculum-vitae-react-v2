"use client";

import React from "react";

/**
 * Props for the {@link Pagination} navigation component.
 */
export interface PaginationProps {
  /** The currently selected 1-indexed page number. */
  currentPage: number;

  /** Total number of pages available. If <= 1, the component renders null. */
  totalPages: number;

  /** Callback fired when a page number or prev/next button is clicked. */
  onPageChange: (page: number) => void;

  /** Additional CSS class names applied to the `<nav>` wrapper. */
  className?: string;
}

/**
 * Standard Bootstrap numeric pagination control (`<ul className="pagination">`).
 * Automatically disables previous/next controls on boundary limits and hides itself when totalPages <= 1.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Page navigation"
      className={`d-flex justify-content-center ${className}`}
    >
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            aria-label="Previous"
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li
            key={page}
            className={`page-item ${currentPage === page ? "active" : ""}`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}

        <li
          className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
        >
          <button
            type="button"
            className="page-link"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
