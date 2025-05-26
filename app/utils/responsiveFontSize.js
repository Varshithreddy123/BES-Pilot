// utils/responsiveFontSize.js
import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Base width for scaling (e.g., iPhone 11 width)
const baseWidth = 414;

const scale = screenWidth / baseWidth;

export function responsiveFontSize(size) {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    // Android often needs a slight adjustment for readability
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}