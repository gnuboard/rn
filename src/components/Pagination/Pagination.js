import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/theme/ThemeContext';
import { Colors } from '../../styles/colors';
import { Styles } from '../../styles/styles';

export const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const { textThemedColor } = useTheme();

  const renderPagination = () => {
    const pages = [];

    if (totalPages <= 1) {
      return null;
    }

    // Always show the first page
    pages.push(1);

    // Add ellipsis if needed after the first page
    if (currentPage > 3) {
      pages.push('...');
    }

    // Show previous page if it's not page 1 and not duplicating the first page
    if (currentPage > 2) {
      pages.push(currentPage - 1);
    }

    // Show the current page, but avoid duplicating page 1
    if (currentPage !== 1 && currentPage !== totalPages) {
      pages.push(currentPage);
    }

    // Show next page if it's not the last page and not duplicating the last page
    if (currentPage < totalPages - 1) {
      pages.push(currentPage + 1);
    }

    // Add ellipsis if needed before the last page
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show the last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (page === '...') {
        return (
          <Text key={index} style={[styles.pageText, textThemedColor]}>
            {page}
          </Text>
        );
      }

      return (
        <TouchableOpacity
          style={[
            styles.pageContainer,
            page === currentPage && {backgroundColor: Colors.btn_blue}
          ]}
          key={index}
          onPress={() => onPageChange(page)}
        >
          <Text
            style={[
              styles.pageText,
              textThemedColor,
              page === currentPage && {color: Colors.btn_text_white},
            ]}
          >
            {page}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.paginationContainer}>
      {/* Previous button */}
      {currentPage > 1 && (
        <TouchableOpacity onPress={() => onPageChange(currentPage - 1)}>
          <Text style={[styles.pageText, textThemedColor]}>{'<'} </Text>
        </TouchableOpacity>
      )}

      {/* Page numbers */}
      {renderPagination()}

      {/* Next button */}
      {currentPage < totalPages && (
        <TouchableOpacity onPress={() => onPageChange(currentPage + 1)}>
          <Text style={[styles.pageText, textThemedColor]}> {'>'} </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = new Styles.Pagination();