import { emptyAvatarUri } from "../constants/theme";

export function getMemberIconUri(data) {
  if (data.mb_icon_path) {
    return data.mb_icon_path;
  } else {
    return emptyAvatarUri;
  }
}

export function getMemberImageUri(data) {
  if (data.mb_image_path) {
    return data.mb_image_path;
  } else {
    return emptyAvatarUri;
  }
}