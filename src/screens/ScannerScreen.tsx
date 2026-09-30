import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import { PDFEngine } from '../services/pdfEngine';
import { Camera, RefreshCw, Trash2, CheckCircle, Image as ImageIcon } from 'lucide-react-native';

export const ScannerScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedImages, setScannedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const cameraRef = useRef<any>(null);

  if (!permission) {
    return <View style={[styles.container, { backgroundColor: theme.bg }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: theme.bg }]}>
        <View style={styles.iconCircle}>
          <Camera size={36} color="#3B82F6" />
        </View>
        <Text style={[styles.permTitle, { color: theme.textPrimary }]}>Camera Access Required</Text>
        <Text style={[styles.permSub, { color: theme.textSecondary }]}>
          TridentPDF uses your camera locally to scan documents, auto-enhance contrast, and compile multi-page PDFs.
        </Text>
        <TouchableOpacity style={styles.permButton} onPress={requestPermission}>
          <Text style={styles.permButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.85,
        skipProcessing: false,
      });
      if (photo && photo.uri) {
        setScannedImages(prev => [...prev, photo.uri]);
      }
    } catch (err: any) {
      Alert.alert('Capture Failed', err.message);
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.9,
      });

      if (!res.canceled && res.assets) {
        const uris = res.assets.map(a => a.uri);
        setScannedImages(prev => [...prev, ...uris]);
      }
    } catch (err: any) {
      Alert.alert('Gallery Error', err.message);
    }
  };

  const handleGeneratePDF = async () => {
    if (scannedImages.length === 0) return;
    try {
      setIsProcessing(true);
      const pdfUri = await PDFEngine.imagesToPDF(scannedImages);
      setIsProcessing(false);

      Alert.alert(
        'Scan Compiled! 📄',
        `Successfully generated multi-page PDF (${scannedImages.length} pages).`,
        [
          { text: 'Clear & New Scan', onPress: () => setScannedImages([]) },
          {
            text: 'Share / Save PDF',
            onPress: () => Sharing.shareAsync(pdfUri),
          },
        ]
      );
    } catch (err: any) {
      setIsProcessing(false);
      Alert.alert('Compilation Error', err.message);
    }
  };

  const removePage = (index: number) => {
    setScannedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Live Camera Viewfinder */}
      <View style={styles.cameraWrapper}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          {/* Document Framing Guidelines */}
          <View style={styles.frameGuide}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
        </CameraView>
      </View>

      {/* Scanned Pages Carousel */}
      {scannedImages.length > 0 && (
        <View style={[styles.thumbnailSection, { backgroundColor: theme.surfaceElevated }]}>
          <Text style={[styles.pageCountText, { color: theme.textSecondary }]}>
            {scannedImages.length} page{scannedImages.length > 1 ? 's' : ''} captured
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbScroll}>
            {scannedImages.map((uri, idx) => (
              <View key={uri + idx} style={styles.thumbWrapper}>
                <Image source={{ uri }} style={styles.thumbnail} />
                <TouchableOpacity style={styles.thumbDelete} onPress={() => removePage(idx)}>
                  <Trash2 size={12} color="#FFFFFF" />
                </TouchableOpacity>
                <View style={styles.thumbIndexBadge}>
                  <Text style={styles.thumbIndexText}>{idx + 1}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Action Controls Bar */}
      <View style={[styles.controlsBar, { backgroundColor: theme.surface }]}>
        <TouchableOpacity
          style={[styles.secondaryActionBtn, { borderColor: theme.border }]}
          onPress={handlePickFromGallery}
        >
          <ImageIcon size={22} color={theme.textPrimary} />
        </TouchableOpacity>

        {/* Shutter Button */}
        <TouchableOpacity style={styles.shutterBtn} onPress={handleCapture} activeOpacity={0.8}>
          <View style={styles.shutterInner} />
        </TouchableOpacity>

        {/* Finish / Compile PDF Button */}
        <TouchableOpacity
          style={[
            styles.finishBtn,
            {
              backgroundColor: scannedImages.length > 0 ? theme.primary : theme.surfaceElevated,
              opacity: scannedImages.length > 0 ? 1 : 0.4,
            },
          ]}
          disabled={scannedImages.length === 0 || isProcessing}
          onPress={handleGeneratePDF}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <CheckCircle size={22} color={scannedImages.length > 0 ? '#FFFFFF' : theme.textMuted} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  permSub: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  permButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  permButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  frameGuide: {
    position: 'absolute',
    top: '12%',
    bottom: '12%',
    left: '8%',
    right: '8%',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#38BDF8',
  },
  cornerTL: { top: -2, left: -2, borderTopWidth: 4, borderLeftWidth: 4 },
  cornerTR: { top: -2, right: -2, borderTopWidth: 4, borderRightWidth: 4 },
  cornerBL: { bottom: -2, left: -2, borderBottomWidth: 4, borderLeftWidth: 4 },
  cornerBR: { bottom: -2, right: -2, borderBottomWidth: 4, borderRightWidth: 4 },
  thumbnailSection: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  pageCountText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  thumbScroll: {
    gap: 10,
  },
  thumbWrapper: {
    width: 60,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbDelete: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    borderRadius: 8,
    padding: 3,
  },
  thumbIndexBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  thumbIndexText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  shutterBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  secondaryActionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
