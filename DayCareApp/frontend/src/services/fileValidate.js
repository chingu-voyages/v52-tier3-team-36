export const MAX_FILE_SIZE = 1048576; //Max image size is 1MB
// Valid image extensions list
const validFileExtensions = { image: ['jpg', 'png', 'jpeg'] };
//Checks if the image is valid
export function isValidImage(fileName, fileType) {
  return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
}

