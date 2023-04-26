import styles from "../src/pages/index.module.css";

export function Pagination(props: {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(props.totalItems / props.itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.pagination}>
      {pageNumbers.map((number) => (
        <button
          key={number}
          className={
            number === props.currentPage ? styles.active : styles.pageItem
          }
          onClick={() => props.paginate(number)}
        >
          {number}
        </button>
      ))}
    </div>
  );
}
