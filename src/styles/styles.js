import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from './colors';

export class Styles {
  static width = Dimensions.get('window').width;

  static get ITEM_WIDTH() {
    return this.width*0.9;
  }

  static get ITEM_HEIGHT() {
    return this.ITEM_WIDTH * 0.75;
  }

  static SignupForm = class {
    constructor() {
      return StyleSheet.create({
        formContainer: {
          backgroundColor: 'white',
          padding: 20,
          borderRadius: 5,
          width: '100%',
          maxWidth: 300,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          marginBottom: 15,
        },
        input: {
          height: 48,
          borderColor: '#ddd',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
          borderRadius: 3,
          width: '100%',
          color: Colors.text_black,
        },
        checkboxContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        },
        label: {
          marginLeft: 8,
        },
        agreementContainer: {
          flex: 1,
        },
        title: {
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 15,
        },
        snsButton: {
          backgroundColor: '#4267B2',
          padding: 10,
          borderRadius: 5,
          marginBottom: 15,
        },
        sectionTitle: {
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 10,
          color: Colors.text_black,
        },
        agreementScroll: {
          height: 100,
          borderColor: '#ccc',
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
        },
        agreementText: {
          fontSize: 13,
          color: Colors.text_black,
        },
        tableContainer: {
          borderWidth: 1,
          borderColor: '#ccc',
          marginBottom: 10,
        },
        tableRow: {
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderColor: '#ccc',
        },
        tableCell: {
          flex: 1,
          padding: 5,
          fontSize: 12,
          color: Colors.text_black,
        },
        tableHeader: {
          fontWeight: 'bold',
          backgroundColor: '#f0f0f0',
        },
        checkboxContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        },
        checkbox: {
          borderColor: Colors.text_black,
          borderWidth: 1,
        },
        label: {
          marginLeft: 8,
          fontSize: 14,
          color: Colors.text_black,
        },
        button: {
          backgroundColor: Colors.btn_blue,
          padding: 10,
          borderRadius: 3,
          marginTop: 10,
          width: '100%',
        },
        buttonText: {
          color: Colors.btn_text_white,
          textAlign: 'center',
          fontWeight: 'bold',
        },
        disabledButton: {
          backgroundColor: '#cccccc',
        },
        errorText: {
          color: 'red',
          fontSize: 12,
          marginBottom: 10,
        },
      });
    }
  }

  static Arrow = class {
    constructor() {
      return StyleSheet.create({
        backButton: {
          position: 'absolute',
          top: 8,
          left: 2,
          zIndex: 1,
          padding: 10,
          height: 48,
          width: 48,
        },
      });
    }
  }

  static Delete = class {
    constructor() {
      return StyleSheet.create({
        container: {
          position: 'relative',
          width: 50,
          height: 50,
        },
        image: {
          width: '100%',
          height: '100%',
          borderRadius: 50,
        },
        deleteButton: {
          position: 'absolute',
          top: -5,
          right: -5,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 12,
          width: 14,
          height: 14,
          justifyContent: 'center',
          alignItems: 'center',
        },
        deleteButtonText: {
          color: 'white',
          fontSize: 7,
          fontWeight: 'bold',
        },
      });
    }
  }

  static Inputs = class {
    constructor() {
      return StyleSheet.create({
        searchInput: {
          marginTop: 15,
          marginHorizontal: 8,
          padding: 8,
          paddingHorizontal: 15,
          borderRadius: 4,
          borderWidth: 1,
          borderColor: Colors.border_gray,
          height: 48,
        },
      });
    }
  }

  static Toolbar = class {
    constructor() {
      return StyleSheet.create({
        toolbar: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginBottom: -10,
          marginRight: 10,
        },
        iconButton: {
          height: 48,
          width: 48,
          alignItems: 'flex-end',
          justifyContent: 'center',
        },
      });
    }
  }

  static Latest = class {
    constructor() {
      return StyleSheet.create({
        container: {
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1,
        },
        title: {
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 8,
          color: Colors.text_black,
        },
        subjectHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        },
        item: {
          paddingVertical: 6,
          borderBottomWidth: 1,
          height: 48,
          justifyContent: 'center',
          borderBottomColor: '#e0e0e0',
        },
        itemTitle: {
          fontSize: 16,
          color: Colors.text_black,
        },
        itemDate: {
          fontSize: 12,
          color: Colors.text_black,
          marginTop: 2,
        },
        itemSource: {
          fontSize: 12,
          color: '#666',
          marginTop: 2,
        },
      });
    }
  }

  static LatestGallery = class {
    constructor() {
      return StyleSheet.create({
        container: {
          marginBottom: 20,
        },
        title: {
          fontSize: 20,
          fontWeight: 'bold',
          marginBottom: 10,
          paddingHorizontal: 16,
        },
        itemContainer: {
          width: Styles.ITEM_WIDTH,
          marginRight: 10,
        },
        image: {
          width: Styles.ITEM_WIDTH,
          height: Styles.ITEM_HEIGHT,
          borderRadius: 8,
        },
        textContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 8,
        },
        itemTitle: {
          flex: 1,
          fontSize: 16,
          marginRight: 8,
        },
        itemDate: {
          fontSize: 12,
        },
      });
    }
  }

  static Modal = class {
    constructor() {
      return StyleSheet.create({
        centeredView: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalView: {
          margin: 20,
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 35,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5
        },
        modalDescription: {
          color: Colors.text_black,
        },
        textInput: {
          width: 207,
          height: 50,
          marginVertical: 15,
          borderWidth: 1,
          padding: 10,
          color: Colors.text_black,
        },
        buttonContainer: {
          flexDirection: 'row',
        },
        button: {
          width: '33%',
          padding: 10,
          height: 48,
          justifyContent: 'center',
        },
        buttonText: {
          color: Colors.btn_text_white,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 16,
        },
        submitButton: {
          backgroundColor: Colors.btn_blue,
          marginRight: 10,
        },
        cancelButton: {
          backgroundColor: Colors.btn_gray,
        }
      });
    }
  }

  static Pagination = class {
    constructor() {
      return StyleSheet.create({
        paginationContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 20,
        },
        pageContainer: {
          borderRadius: 5,
          padding: 3
        },
        pageText: {
          fontSize: 14,
          marginHorizontal: 10,
        },
        currentPageText: {
          fontWeight: 'bold',
          color: 'red',
        },
      });
    }
  }

  static Comment = class {
    constructor() {
      return StyleSheet.create({
        container: {
          marginBottom: 10,
        },
        divider: {
          height: 1,
          backgroundColor: '#e0e0e0',
          marginBottom: 10,
        },
        commentHeader: {
          flexDirection: 'row',
          alignItems: 'flex-start',
        },
        avatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
          marginRight: 10,
        },
        commentContent: {
          flex: 1,
        },
        commentInfo: {
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: 5,
        },
        authorName: {
          fontWeight: 'bold',
          marginRight: 10,
        },
        dateTime: {
          fontSize: 12,
          marginRight: 10,
        },
        button: {
          backgroundColor: '#2196F3',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
          marginRight: 5,
          height: 48,
          width: 55,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
        },
        replyButton: {
          backgroundColor: Colors.btn_green,
          marginBottom: 5,
        },
        updateButton: {
          backgroundColor: Colors.btn_blue,
          marginBottom: 5,
        },
        deleteButton: {
          backgroundColor: Colors.btn_gray,
        },
        buttonText: {
          color: 'white',
          fontSize: 14,
        },
        commentBody: {
          marginTop: 5,
        },
        secretComment: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        commentText: {
          marginLeft: 5,
        },
        iconButton: {
          width: 48,
          height: 48,
          marginLeft: -30,
          alignItems: 'flex-end',
        },
      });
    }
  }

  static CommentForm = class {
    constructor() {
      return StyleSheet.create({
        container: {
          marginTop: 10,
        },
        divider: {
          height: 1,
          backgroundColor: '#e0e0e0',
          marginBottom: 10,
        },
        input: {
          borderWidth: 1,
          borderColor: '#e0e0e0',
          borderRadius: 4,
          padding: 8,
          marginBottom: 10,
        },
        formFooter: {
          marginTop: 10,
        },
        nonLoginInputs: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        },
        smallInput: {
          borderWidth: 1,
          borderColor: '#e0e0e0',
          borderRadius: 4,
          padding: 8,
          width: '48%',
          height: 48,
        },
        errorText: {
          color: 'red',
          textAlign: 'center',
          marginBottom: 10,
        },
        formActions: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        secretCommentContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        secretCommentText: {
          marginLeft: 8,
          fontSize: 14,
        },
        submitButton: {
          backgroundColor: Colors.btn_blue,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 4,
          height: 48,
          width: 90,
          justifyContent: 'center',
          alignItems: 'center',
        },
        updateButton: {
          backgroundColor: Colors.btn_green,
        },
        submitButtonText: {
          color: 'white',
          fontSize: 14,
        },
        secretCommentSwitch: {
          width: 48,
          height: 48,
        },
      });
    }
  }

  static WriteListItem = class {
    constructor() {
      return StyleSheet.create({
        writeContainer: {
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
        },
        writeMainContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 5,
        },
        wrMainArg: {
          marginRight: 5,
        },
        writeSubContainer: {
          flexDirection: 'row',
        },
        wrSubArg: {
          marginRight: 10,
          fontSize: 11,
        },
        wrCommentText: {
          textAlign: 'center',
          textAlignVertical: 'center',
          backgroundColor: Colors.comment_count_bg,
          width: 16,
          height: 16,
          fontSize: 11,
          color: Colors.text_black,
        },
        wrLink: {
          textAlign: 'center',
          textAlignVertical: 'center',
          backgroundColor: Colors.link_icon_bg,
          width: 16,
          height: 16,
          fontSize: 11,
          color: Colors.text_black,
        },
        wrFile: {
          textAlign: 'center',
          textAlignVertical: 'center',
          backgroundColor: Colors.file_icon_bg,
          width: 16,
          height: 16,
          fontSize: 11,
          color: Colors.text_black,
        },
      });
    }
  }
}
