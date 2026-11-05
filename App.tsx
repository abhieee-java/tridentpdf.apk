import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { ThemeProvider, useAppTheme } from './src/theme/ThemeContext';
import { WPSBottomNav, WPSTab } from './src/components/WPSBottomNav';
import { WPSActionMenu, WPSActionType } from './src/components/WPSActionMenu';
import { FormatBadge } from './src/components/FormatBadge';
import { DocumentStorageService, getFileFormat } from './src/services/documentStorage';
import { SystemErrorService } from './src/services/systemErrorService';
import { ActiveDocumentStore } from './src/services/activeDocumentStore';
import { SystemNotificationBanner } from './src/components/SystemNotificationBanner';
import { DocumentViewerScreen } from './src/screens/DocumentViewerScreen';

// Screens
import { RecentFilesScreen } from './src/screens/RecentFilesScreen';
import { FoldersCloudScreen } from './src/screens/FoldersCloudScreen';
import { WPSToolsScreen } from './src/screens/WPSToolsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ScannerScreen } from './src/screens/ScannerScreen';
import { Header } from './src/components/Header';
import { CommandPaletteModal } from './src/components/CommandPaletteModal';
import { ToolDetailModal } from './src/components/ToolDetailModal';
import { DpdpComplianceModal } from './src/components/DpdpComplianceModal';
import { AppTool } from './src/types';
import { ArrowLeft, Share2, FileText, CheckCircle2 } from 'lucide-react-native';

export interface DocumentRouteParams {
  filePath: string;
  fileName: string;
  fileType: 'docx' | 'doc' | 'xlsx' | 'xls' | 'csv' | 'pptx' | 'ppt' | 'pdf' | 'txt';
  readOnly?: boolean;
}

export type ActiveRoute =
  | { type: 'tab'; tab: WPSTab }
  | { type: 'document'; params: DocumentRouteParams }
  | { type: 'scanner' };

function MainApp() {
  const { theme, isDark } = useAppTheme();
  const [activeTab, setActiveTab] = useState<WPSTab>('recent');
  const [currentRoute, setCurrentRoute] = useState<ActiveRoute>({
    type: 'tab',
    tab: 'recent',
  });
  const [isActionMenuOpen, setIsActionMenuOpen] = useState<boolean>(false);
  const [isDpdpOpen, setIsDpdpOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [selectedToolId, setSelectedToolId] = useState<AppTool | null>(null);
  const [activeFile, setActiveFile] = useState<{ name: string; uri: string; size?: number } | null>(null);

  useEffect(() => {
    const unsub = ActiveDocumentStore.subscribe(doc => {
      setActiveFile(doc ? { name: doc.name, uri: doc.uri, size: doc.size } : null);
    });
    return () => unsub();
  }, []);

  const handleOpenDocument = (params: DocumentRouteParams) => {
    setCurrentRoute({
      type: 'document',
      params,
    });
  };

  const handleSelectAction = async (action: WPSActionType) => {
    switch (action) {
      case 'new_doc': {
        try {
          const docName = `New_Document_${Date.now().toString().slice(-4)}.docx`;
          const filePath = `${FileSystem.documentDirectory}${docName}`;
          await FileSystem.writeAsStringAsync(
            filePath,
            `WPS Office Document\n\nTitle: ${docName}\nCreated: ${new Date().toLocaleString()}\n`,
            { encoding: FileSystem.EncodingType.UTF8 }
          );
          await DocumentStorageService.addDocument({
            id: `doc_${Date.now()}`,
            name: docName,
            uri: filePath,
            type: 'docx',
            size: 1024,
            modifiedAt: Date.now(),
          });
          await ActiveDocumentStore.setActiveDocument({
            name: docName,
            uri: filePath,
            type: 'docx',
            size: 1024,
          });
          SystemErrorService.showNotification({
            code: 'OPERATION_SUCCESS',
            title: 'Document Created',
            message: `Created "${docName}" locally in workspace.`,
            severity: 'success',
          });
          setCurrentRoute({
            type: 'document',
            params: { filePath, fileName: docName, fileType: 'docx', readOnly: false },
          });
        } catch (e: any) {
          SystemErrorService.reportError(e, 'Create Document');
        }
        break;
      }
      case 'new_sheet': {
        try {
          const sheetName = `New_Spreadsheet_${Date.now().toString().slice(-4)}.xlsx`;
          const filePath = `${FileSystem.documentDirectory}${sheetName}`;
          await FileSystem.writeAsStringAsync(
            filePath,
            `Item,Quantity,Price\nSample A,10,25.00\nSample B,5,15.50\n`,
            { encoding: FileSystem.EncodingType.UTF8 }
          );
          await DocumentStorageService.addDocument({
            id: `sheet_${Date.now()}`,
            name: sheetName,
            uri: filePath,
            type: 'xlsx',
            size: 1024,
            modifiedAt: Date.now(),
          });
          await ActiveDocumentStore.setActiveDocument({
            name: sheetName,
            uri: filePath,
            type: 'xlsx',
            size: 1024,
          });
          SystemErrorService.showNotification({
            code: 'OPERATION_SUCCESS',
            title: 'Spreadsheet Created',
            message: `Created "${sheetName}" locally in workspace.`,
            severity: 'success',
          });
          setCurrentRoute({
            type: 'document',
            params: { filePath, fileName: sheetName, fileType: 'xlsx', readOnly: false },
          });
        } catch (e: any) {
          SystemErrorService.reportError(e, 'Create Spreadsheet');
        }
        break;
      }
      case 'new_slide': {
        try {
          const slideName = `New_Presentation_${Date.now().toString().slice(-4)}.pptx`;
          const filePath = `${FileSystem.documentDirectory}${slideName}`;
          await FileSystem.writeAsStringAsync(
            filePath,
            `WPS Office Presentation\n\nSlide 1: Title\nSlide 2: Overview\n`,
            { encoding: FileSystem.EncodingType.UTF8 }
          );
          await DocumentStorageService.addDocument({
            id: `slide_${Date.now()}`,
            name: slideName,
            uri: filePath,
            type: 'pptx',
            size: 1024,
            modifiedAt: Date.now(),
          });
          await ActiveDocumentStore.setActiveDocument({
            name: slideName,
            uri: filePath,
            type: 'pptx',
            size: 1024,
          });
          SystemErrorService.showNotification({
            code: 'OPERATION_SUCCESS',
            title: 'Presentation Created',
            message: `Created "${slideName}" locally in workspace.`,
            severity: 'success',
          });
          setCurrentRoute({
            type: 'document',
            params: { filePath, fileName: slideName, fileType: 'pptx', readOnly: false },
          });
        } catch (e: any) {
          SystemErrorService.reportError(e, 'Create Presentation');
        }
        break;
      }
      case 'scan': {
        setCurrentRoute({ type: 'scanner' });
        break;
      }
      case 'cloudinary_upload': {
        try {
          const res = await DocumentPicker.getDocumentAsync({
            type: '*/*',
            copyToCacheDirectory: true,
          });
          if (res.canceled || !res.assets || res.assets.length === 0) return;

          const file = res.assets[0];
          const dest = `${FileSystem.documentDirectory}${file.name}`;
          await FileSystem.copyAsync({ from: file.uri, to: dest });

          const docType = getFileFormat(file.name);
          await DocumentStorageService.addDocument({
            id: `cloud_up_${Date.now()}`,
            name: file.name,
            uri: dest,
            type: docType,
            size: file.size || 0,
            modifiedAt: Date.now(),
            isCloud: true,
          });
          await ActiveDocumentStore.setActiveDocument({
            name: file.name,
            uri: dest,
            type: docType,
            size: file.size || 0,
          });

          SystemErrorService.showNotification({
            code: 'DOCUMENT_READY',
            title: 'File Access Ready',
            message: `Imported "${file.name}" into local document vault.`,
            severity: 'success',
          });
        } catch (e: any) {
          SystemErrorService.reportError(e, 'Cloud Access');
        }
        break;
      }
    }
  };

  const renderCurrentView = () => {
    if (currentRoute.type === 'document') {
      const { fileName, filePath, fileType, readOnly } = currentRoute.params;
      return (
        <DocumentViewerScreen
          filePath={filePath}
          fileName={fileName}
          fileType={fileType}
          readOnly={readOnly}
          onBack={() => setCurrentRoute({ type: 'tab', tab: activeTab })}
          onLaunchTool={(toolId, file) => {
            setActiveFile(file);
            setSelectedToolId(toolId);
          }}
        />
      );
    }

    if (currentRoute.type === 'scanner') {
      return (
        <View style={[styles.screenContent, { backgroundColor: theme.bg }]}>
          <View
            style={[
              styles.docTopBar,
              {
                backgroundColor: isDark ? '#121217' : '#FFFFFF',
                borderBottomColor: theme.border,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setCurrentRoute({ type: 'tab', tab: activeTab })}
            >
              <ArrowLeft size={22} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.docBarTitle, { color: theme.textPrimary }]}>
              WPS Camera Scanner
            </Text>
          </View>
          <ScannerScreen />
        </View>
      );
    }

    // Active Tab Screen
    switch (activeTab) {
      case 'recent':
        return <RecentFilesScreen onOpenDocument={handleOpenDocument} />;
      case 'folders':
        return (
          <FoldersCloudScreen
            onOpenDocument={handleOpenDocument}
            onNavigateToSettings={() => {
              setActiveTab('settings');
              setCurrentRoute({ type: 'tab', tab: 'settings' });
            }}
          />
        );
      case 'tools':
        return (
          <WPSToolsScreen
            onOpenDocument={handleOpenDocument}
            onNavigateToScanner={() => setCurrentRoute({ type: 'scanner' })}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            onOpenDpdp={() => setIsDpdpOpen(true)}
            onNavigateCloudSettings={() => {
              setActiveTab('folders');
              setCurrentRoute({ type: 'tab', tab: 'folders' });
            }}
          />
        );
      default:
        return <RecentFilesScreen onOpenDocument={handleOpenDocument} />;
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.bg }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Centralized Apple-Grade System Notification & Recovery Banner */}
      <SystemNotificationBanner />

      {/* TridentPDF Official Header Navbar */}
      {currentRoute.type === 'tab' && (
        <Header
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
          onOpenDpdp={() => setIsDpdpOpen(true)}
        />
      )}

      {/* Main Screen Body */}
      <View style={[styles.screenContent, { backgroundColor: theme.bg }]}>
        {renderCurrentView()}
      </View>

      {/* Authentic WPS 4-Tab Bottom Navigation + FAB */}
      {currentRoute.type === 'tab' && (
        <WPSBottomNav
          activeTab={activeTab}
          onSelectTab={tab => {
            setActiveTab(tab);
            setCurrentRoute({ type: 'tab', tab });
          }}
          onPressAction={() => setIsActionMenuOpen(true)}
          isActionMenuOpen={isActionMenuOpen}
        />
      )}

      {/* 60fps Native Animated WPS Action Menu */}
      <WPSActionMenu
        visible={isActionMenuOpen}
        onClose={() => setIsActionMenuOpen(false)}
        onSelectAction={handleSelectAction}
      />

      {/* Global Command Palette Modal */}
      <CommandPaletteModal
        visible={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTool={id => setSelectedToolId(id)}
      />

      {/* Global Tool Detail Modal (All 25 Tools + 94KB SEO Guide) */}
      <ToolDetailModal
        visible={!!selectedToolId}
        toolId={selectedToolId}
        onClose={() => setSelectedToolId(null)}
        activeFile={activeFile}
        onSelectActiveFile={setActiveFile}
      />

      {/* Global DPDP Modal */}
      <DpdpComplianceModal
        visible={isDpdpOpen}
        onClose={() => setIsDpdpOpen(false)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
  },
  docTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  docTitleWrap: {
    flex: 1,
  },
  docBarTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  docBarSub: {
    fontSize: 11,
    marginTop: 1,
  },
  shareBtn: {
    padding: 6,
  },
  docPreviewBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  docPreviewCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  docPreviewHeading: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  readyBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
  },
  docPreviewDesc: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  actionOpenBtn: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 20,
  },
  actionOpenText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
