import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from './colors';

export class Styles {
  static disabledButton = { backgroundColor: Colors.btn_gray };

  static formContainer = {
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
  }

  static input = {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    height: 48,
    color: Colors.text_black,
  }

  static get halfInput () {
    return {
      ...this.input,
      width: '48%',
    }
  }

  static button = {
    padding: 10,
    height: 48,
    borderRadius: 3,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  }

  static get snsButton() {
    return {
      ...this.button,
      backgroundColor: '#4267B2',
    }
  }

  static submitButton(widthRate=100) {
    return {
      ...this.button,
      backgroundColor: Colors.btn_blue,
      width: `${widthRate}%`,
    }
  }

  static cancelButton(widthRate) {
    return {
      ...this.button,
      backgroundColor: Colors.btn_gray,
      width: `${widthRate}%`,
    }
  }

  static errorText = {
    color: 'red',
    textAlign: 'center',
    fontSize: 15,
    marginBottom: 10,
  }

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
        formContainer: Styles.formContainer,
        input: Styles.input,
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
        snsButton: Styles.snsButton,
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
        button: Styles.submitButton(),
        buttonText: {
          color: Colors.btn_text_white,
          textAlign: 'center',
          fontWeight: 'bold',
        },
        disabledButton: Styles.disabledButton,
        errorText: Styles.errorText,
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
        searchInput: Styles.input,
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
        titleContainer: {
          flexDirection: 'row',
          alignItems: 'center',
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
        buttonText: {
          color: Colors.btn_text_white,
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 16,
        },
        submitButton: {
          ...Styles.submitButton(33),
          marginRight: 10,
        },
        cancelButton: Styles.cancelButton(33),
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
        halfInput: Styles.halfInput,
        errorText: Styles.errorText,
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
        submitButton: Styles.submitButton(33),
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

  static LoginScreen = class {
    constructor() {
      return StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        backButton: {
          position: 'absolute',
          top: 8,
          left: 2,
          zIndex: 1,
          padding: 10,
        },
        formContainer: Styles.formContainer,
        title: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'left',
        },
        input: Styles.input,
        checkboxContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        label: {
          margin: 2,
          color: Colors.text_black,
        },
        loginButton: Styles.submitButton(),
        loginButtonLoading: {
          backgroundColor: Colors.btn_gray,
          padding: 10,
          borderRadius: 3,
          marginTop: 10,
          width: '100%',
        },
        socialLoginGroupContainer: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 20,
        },
        socialLoginLogo: {
          width: 35,
          height: 35,
        },
        loginButtonText: {
          color: Colors.btn_text_white,
          textAlign: 'center',
          fontWeight: 'bold',
        },
        forgotPassword: {
          color: Colors.btn_blue,
          textAlign: 'center',
          marginTop: 15,
          fontSize: 12,
        },
        errorText: Styles.errorText,
      });
    }
  }

  static SignupScreen = class {
    constructor() {
      return StyleSheet.create({
        container: {
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          padding: 20,
        },
        formContainer: Styles.formContainer,
        button: Styles.submitButton(),
        buttonText: {
          color: Colors.btn_text_white,
          textAlign: 'center',
          fontWeight: 'bold',
        },
        disabledButton: Styles.disabledButton,
        outlineButton: {
          backgroundColor: 'transparent',
          borderColor: Colors.btn_blue,
          borderWidth: 1,
        },
        outlineButtonText: {
          color: Colors.btn_blue,
          textAlign: 'center',
          fontWeight: 'bold',
        },
        snsButton: Styles.snsButton,
        snsButtonText: {
          color: 'white',
          textAlign: 'center',
          fontWeight: 'bold',
        },
      });
    }
  }

  static WriteListScreen = class {
    constructor() {
      return StyleSheet.create({
        container: {
          flex: 1,
          padding: 10
        },
        listHeader: {
          backgroundColor: '#FFF6FA',
        },
        noticeItem: {
          padding: 10,
          borderBottomWidth: 1,
        },
        indicatorFooter: {
          padding: 10,
        },
        noWritesContainer: {
          flex: 0.5,
          justifyContent: 'center',
          alignItems: 'center',
        },
        noWritesText: {
          fontSize: 16,
        }
      });
    }
  }

  static WriteScreen = class {
    constructor() {
      return StyleSheet.create({
        container: {
          flex: 1,
          padding: 16,
        },
        subjectWithButton: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          width: '98%',
          height: 48,
        },
        buttonCommon: {
          paddingVertical: 3,
          paddingHorizontal: 16,
          borderRadius: 4,
          marginBottom: 10,
          marginRight: 10,
          width: 70,
          height: 48,
          justifyContent: 'center',
          alignItems: 'center',
        },
        replyButton: {
          backgroundColor: Colors.btn_green,
        },
        updateButton: {
          backgroundColor: Colors.btn_blue,
        },
        buttonText: {
          color: Colors.btn_text_white,
        },
        deleteButton: {
          backgroundColor: Colors.btn_gray,
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 16,
          width: '80%',
        },
        bindedButton: {
          position: 'absolute',
          top: 1,
          right: 15,
          zIndex: 1,
        },
        metaContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 16,
        },
        authorAvatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#5e3aee',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        },
        avatarImage: {
          width: '100%',
          height: '100%',
          borderRadius: 20,
        },
        avatarText: {
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold',
        },
        metaInfo: {
          justifyContent: 'center',
        },
        author: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        date: {
          fontSize: 14,
        },
        content: {
          fontSize: 16,
          lineHeight: 24,
        },
        commentContainer: {
          marginTop: 50,
          paddingBottom: 100,
        },
        commentHeaderText: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        noCommentText: {
          textAlign: 'center',
        },
        linkContainer: {
          flexDirection: 'row',
          borderWidth: 0.5,
          borderRadius: 5,
          borderColor: 'gray',
          padding: 5,
          marginBottom: 10,
          height: 45,
          alignItems: 'center',
        },
        wrLink: {
          textAlign: 'center',
          textAlignVertical: 'center',
          backgroundColor: Colors.link_icon_bg,
          width: 30,
          height: 30,
          fontSize: 17,
          marginRight: 10,
        },
        fileContainer: {
          flexDirection: 'row',
          borderWidth: 0.5,
          borderRadius: 5,
          borderColor: 'gray',
          padding: 5,
          marginBottom: 10,
          height: 45,
          alignItems: 'center',
        },
        wrFile: {
          textAlign: 'center',
          textAlignVertical: 'center',
          backgroundColor: Colors.file_icon_bg,
          width: 30,
          height: 30,
          fontSize: 17,
          marginRight: 10,
        },
        linkText: {
          fontWeight: 'bold',
          color: Colors.text_black,
        },
        fileSubject: {
          flexDirection: 'row',
          marginBottom: 3,
        },
        fileName: {
          fontWeight: 'bold',
          color: Colors.text_black,
        },
        fileSize: {
          color: Colors.text_black,
        },
        fileDownload:{
          color: Colors.text_black,
        },
        loading_text: {
          fontSize: 24,
        },
        commentsPAgeContainer: {
          alignItems: 'center',
        },
        writeEllipsis: {
          height: 48,
          width: 48,
          justifyContent: 'center',
          alignItems: 'flex-end',
        }
      });
    }
  }

  static WriteUpdateScreen = class {
    constructor() {
      return StyleSheet.create({
        container: {
          flex: 1,
          paddingTop: 15,
          width: '100%',
        },
        pickerContainer: {
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 5,
          height: 50,
          marginBottom: 10,
          justifyContent: 'center',
        },
        scrollContainer: {
          width: '100%',
          paddingHorizontal: 20,
          contentContainerStyle: {
            alignItems: 'center',
            justifyContent: 'center',
          }
        },
        inputContainer: {
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        input: Styles.input,
        halfInput: Styles.halfInput,
        webViewContainer: {
          height: Dimensions.get('window').height * 0.5,
          width: '100%',
        },
        checkBoxContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
        },
        checkboxInnerContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          width: '48%',
        },
        buttonContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 20,
          marginBottom: 40,
          paddingHorizontal: 10,
          height: 50,
        },
        cancelButton: Styles.cancelButton(45),
        submitButton: Styles.submitButton(45),
        buttnText: {
          color: Colors.btn_text_white,
          fontWeight: 'bold',
        },
        fileButton: {
          width: '100%',
          height: 48,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 5,
          marginBottom: 10,
          justifyContent: 'center',
          paddingHorizontal: 10,
        },
        fileButtonText: {
          color: Colors.text_black,
        },
        checkboxText: {
          color: Colors.text_black,
        }
      });
    }
  }

  static BoardScreen = class {
    constructor() {
      return StyleSheet.create({
        container: {
          flex: 1,
          padding: 10,
        },
        section: {
          marginBottom: 30,
        },
        sectionTitleButton: {
          height: 48,
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          marginVertical: 10,
        },
        loading_text: {
          fontSize: 24,
        },
      });
    }
  }

  static HomeScreen = class {
    constructor() {
      return StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#f0f0f0',
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
          position: 'relative',
        },
        menuButton: {
          position: 'absolute',
          left: 16,
        },
        content: {
          padding: 16,
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
        },
        row: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 16,
        },
        column: {
          flex: 1,
          marginHorizontal: 8,
        },
        sectionTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          marginTop: 16,
          marginBottom: 8,
        },
      });
    }
  }

  static ProfileScreen = class {
    constructor() {
      return StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: '#f5f5f5',
        },
        scrollView: {
          flexGrow: 1,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        loadingText: {
          fontSize: 18,
          color: '#888',
        },
        header: {
          height: 150,
          position: 'relative',
        },
        coverImage: {
          width: '100%',
          height: '100%',
        },
        avatarContainer: {
          position: 'absolute',
          bottom: -30,
          left: 20,
          borderRadius: 75,
          borderWidth: 5,
          borderColor: '#fff',
          elevation: 5,
        },
        avatar: {
          width: 50,
          height: 50,
          borderRadius: 50,
        },
        infoContainer: {
          paddingTop: 60,
          paddingHorizontal: 20,
        },
        name: {
          fontSize: 24,
          fontWeight: 'bold',
          color: '#333',
        },
        username: {
          fontSize: 16,
          color: '#666',
          marginBottom: 10,
        },
        bioContainer: {
          maxHeight: 100,
          marginBottom: 20,
          backgroundColor: '#fff',
          borderRadius: 10,
          paddingHorizontal: 15,
          paddingVertical: 5,
          elevation: 2,
        },
        bio: {
          fontSize: 16,
          color: '#444',
          marginBottom: 20,
        },
        statsContainer: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: 20,
          backgroundColor: '#fff',
          borderRadius: 10,
          padding: 15,
          elevation: 2,
        },
        statItem: {
          alignItems: 'center',
        },
        statValue: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333',
        },
        statLabel: {
          fontSize: 14,
          color: '#666',
        },
        detailsContainer: {
          backgroundColor: '#fff',
          borderRadius: 10,
          padding: 15,
          elevation: 2,
          marginBottom: 20,
        },
        detailRowContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        },
        detailLabel: {
          fontSize: 14,
          color: '#666',
          width: 50,
        },
        detailValue: {
          fontSize: 14,
          color: '#333',
        },
        button: {
          ...Styles.submitButton(50),
          marginTop: 10,
        },
        buttonText: {
          color: Colors.btn_text_white,
        }
      });
    }
  }

  static ProfileUpdateScreen = class {
    constructor() {
      return StyleSheet.create({
        contentContainer: {
          paddingBottom: 50,
        },
        container: {
          flex: 1,
          padding: 30,
          backgroundColor: '#fff',
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          padding: 15,
          textAlign: 'center',
        },
        inputContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        input: Styles.input,
        zipInput: {
          ...Styles.input,
          width: '75%',
        },
        multilineInput: {
          height: 100,
          textAlignVertical: 'top',
        },
        button: {
          ...Styles.submitButton(20),
          marginVertical: 0,
        },
        buttonText: {
          color: '#fff',
          textAlign: 'center',
        },
        fileContainer: {
          flexDirection: 'row',
        },
        fileButton: {
          backgroundColor: '#f0f0f0',
          padding: 15,
          borderRadius: 5,
          marginBottom: 10,
          marginRight: 10,
          width: '80%',
        },
        fileButtonText: {
          color: '#333',
        },
        checkboxContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        },
        checkbox: {
          width: 20,
          height: 20,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 3,
          marginRight: 10,
          justifyContent: 'center',
          alignItems: 'center',
        },
        checkboxInner: {
          width: 12,
          height: 12,
          backgroundColor: 'transparent',
        },
        checkboxChecked: {
          backgroundColor: '#4CAF50',
        },
        checkboxLabel: {
          flex: 1,
          fontSize: 13,
        },
        submitButton: Styles.submitButton(),
        submitButtonText: {
          color: '#fff',
          fontSize: 18,
        },
        disabledButton: Styles.disabledButton,
      });
    }
  }

  static SettingsScreen = class {
    constructor() {
      return StyleSheet.create({
        container: {
          flex: 1,
        },
        itemContainer: {
          justifyContent: 'center',
          borderWidth: 0.5,
          borderColor: 'gray',
          height: 80,
          paddingLeft: 20,
        },
        text: {
          fontSize: 20,
        },
      });
    }
  }

  static ZipScreen = class {
    constructor() {
      return StyleSheet.create({
        container: {
          marginTop: '15%',
          height: '85%',
        },
      });
    }
  }
}
