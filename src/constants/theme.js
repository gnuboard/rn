import Config from "react-native-config";

export const Colors = {
  'text_black': '#7a7a7a',
  'text_placeholder_black': '#b3b3b3',
  'navi_btn_black': "#464646",
  'btn_blue': '#4a90e2',
  'btn_gray': '#808080',
  'btn_green': 'green',
  'btn_text_white': 'white',
  'comment_count_bg': '#cbe3e8',
  'link_icon_bg': '#edd3fd',
  'file_icon_bg': '#ffefb9',
  'checkbox_border': '#B0B0B0',
  'dark_mode_background': '#333',
  'dark_mode_text': '#f5f5f5',
  'light_mode_background': '#f5f5f5',
  'light_mode_text': '#333',
  'highlight_gray': 'gray',
}

export const emptyAvatarPath = '/img/no_profile.gif'

export const emptyAvatarUri = `${Config.SERVER_URL}${emptyAvatarPath}`;