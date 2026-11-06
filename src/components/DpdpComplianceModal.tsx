import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { BRAND_ENTITY } from '../data/seoRegistry';
import { FontFamily } from '../theme/typography';
import {
  ShieldCheck,
  Lock,
  FileText,
  UserCheck,
  AlertTriangle,
  X,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react-native';

interface DpdpComplianceModalProps {
  visible: boolean;
  onClose: () => void;
}

type DpdpTab = 'notice' | 'rights' | 'security' | 'grievance';

export const DpdpComplianceModal: React.FC<DpdpComplianceModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme, isDark } = useAppTheme();
  const [activeTab, setActiveTab] = useState<DpdpTab>('notice');

  const tabs: Array<{ id: DpdpTab; label: string; icon: any }> = [
    { id: 'notice', label: 'Section 5 Notice', icon: FileText },
    { id: 'rights', label: 'User Rights', icon: UserCheck },
    { id: 'security', label: 'In-Device Proof', icon: Lock },
    { id: 'grievance', label: 'Grievance & DPO', icon: ShieldCheck },
  ];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.root, { backgroundColor: isDark ? '#000000' : '#F7F7F8' }]}>
        {/* HEADER */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: isDark ? '#0F0F17' : '#FFFFFF',
              borderBottomColor: isDark ? '#27272A' : '#E5E7EB',
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <View style={[styles.headerIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.12)' }]}>
              <ShieldCheck size={20} color="#10B981" />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                DPDP Act 2023 Compliance
              </Text>
              <Text style={[styles.headerSub, { color: '#10B981' }]}>
                Digital Personal Data Protection Act, 2023 Verified
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* TABS SELECTOR */}
        <View
          style={[
            styles.tabSelector,
            {
              backgroundColor: isDark ? '#0F0F17' : '#FFFFFF',
              borderBottomColor: isDark ? '#27272A' : '#E5E7EB',
            },
          ]}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
            {tabs.map(tab => {
              const active = activeTab === tab.id;
              const IconComp = tab.icon;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[
                    styles.tabBtn,
                    {
                      backgroundColor: active
                        ? '#2563EB'
                        : isDark
                        ? '#181824'
                        : '#F3F4F6',
                    },
                  ]}
                  onPress={() => setActiveTab(tab.id)}
                >
                  <IconComp size={13} color={active ? '#FFFFFF' : theme.textSecondary} />
                  <Text
                    style={[
                      styles.tabBtnText,
                      { color: active ? '#FFFFFF' : theme.textSecondary },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* CONTENT */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollBody}>
          {activeTab === 'notice' && (
            <View style={styles.sectionWrap}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: isDark ? '#11111B' : '#FFFFFF',
                    borderColor: isDark ? '#27272A' : '#E5E7EB',
                  },
                ]}
              >
                <Text style={[styles.cardTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Notice under Section 5 (Digital Personal Data Protection Act, 2023)
                </Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  WPS Office Mobile operates as a client-side document processing studio. Under Section 5 of the
                  Digital Personal Data Protection Act, 2023 (India), this notice accompanies any processing of
                  personal data.
                </Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  <Text style={{ fontWeight: '700' }}>1. Zero Data Collection:</Text> WPS Office does not collect,
                  retain, log, or transmit personal data or document contents to remote servers or third parties.
                </Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  <Text style={{ fontWeight: '700' }}>2. Data Fiduciary Identity:</Text> {BRAND_ENTITY.publisher},{' '}
                  Registered Address: Assam, India. Official Grievance Officer Contact:{' '}
                  {BRAND_ENTITY.contactEmail}.
                </Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  <Text style={{ fontWeight: '700' }}>3. Processing Purpose:</Text> Document manipulation (Split,
                  Merge, Compress, Watermark, Sign, OCR, Redaction) executed strictly within volatile local device RAM.
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'rights' && (
            <View style={styles.sectionWrap}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: isDark ? '#11111B' : '#FFFFFF',
                    borderColor: isDark ? '#27272A' : '#E5E7EB',
                  },
                ]}
              >
                <Text style={[styles.cardTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Data Principal Rights (Sections 11–14)
                </Text>

                <View style={styles.rightItem}>
                  <CheckCircle size={15} color="#10B981" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rightName, { color: theme.textPrimary }]}>Right to Access Information (Sec 11)</Text>
                    <Text style={[styles.rightDesc, { color: theme.textSecondary }]}>
                      You have full visibility over what is processed. All bytes exist exclusively in your phone's memory.
                    </Text>
                  </View>
                </View>

                <View style={styles.rightItem}>
                  <CheckCircle size={15} color="#10B981" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rightName, { color: theme.textPrimary }]}>Right to Correction & Erasure (Sec 12)</Text>
                    <Text style={[styles.rightDesc, { color: theme.textSecondary }]}>
                      Files and caches can be wiped instantly with 1-tap in Settings. Memory is discarded when the app closes.
                    </Text>
                  </View>
                </View>

                <View style={styles.rightItem}>
                  <CheckCircle size={15} color="#10B981" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rightName, { color: theme.textPrimary }]}>Right of Grievance Redressal (Sec 13)</Text>
                    <Text style={[styles.rightDesc, { color: theme.textSecondary }]}>
                      Direct access to the Data Protection Officer for any privacy concerns with guaranteed response within statutory timelines.
                    </Text>
                  </View>
                </View>

                <View style={styles.rightItem}>
                  <CheckCircle size={15} color="#10B981" />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rightName, { color: theme.textPrimary }]}>Right to Nominate (Sec 14)</Text>
                    <Text style={[styles.rightDesc, { color: theme.textSecondary }]}>
                      Nominate a designated individual to exercise Data Principal rights in accordance with the Act.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'security' && (
            <View style={styles.sectionWrap}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: isDark ? '#11111B' : '#FFFFFF',
                    borderColor: isDark ? '#27272A' : '#E5E7EB',
                  },
                ]}
              >
                <Text style={[styles.cardTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Technical Proof of In-Device Execution
                </Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  WPS Office eliminates cloud security risks through zero-knowledge on-device execution:
                </Text>

                <View style={styles.specBox}>
                  <Text style={[styles.specTitle, { color: isDark ? '#22D3EE' : '#2563EB' }]}>
                    Architecture Verification
                  </Text>
                  <Text style={[styles.specText, { color: theme.textSecondary }]}>
                    • Runtime: React Native Hermes Bytecode Engine{'\n'}
                    • PDF Processing: In-memory ArrayBuffer & TypedArray byte trees{'\n'}
                    • Network Interceptors: 0 file upload API requests{'\n'}
                    • Persistence: Discarded upon garbage collection or app exit
                  </Text>
                </View>

                <View style={styles.specBox}>
                  <Text style={[styles.specTitle, { color: '#10B981' }]}>Section 9: Child Protection</Text>
                  <Text style={[styles.specText, { color: theme.textSecondary }]}>
                    No behavioral monitoring, targeted advertising, or profiling of any user, including minors.
                  </Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === 'grievance' && (
            <View style={styles.sectionWrap}>
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: isDark ? '#11111B' : '#FFFFFF',
                    borderColor: isDark ? '#27272A' : '#E5E7EB',
                  },
                ]}
              >
                <Text style={[styles.cardTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  Grievance Officer & DPO Contact
                </Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  For any questions or statutory inquiries under Section 13:
                </Text>

                <View style={styles.contactCard}>
                  <Text style={[styles.contactLabel, { color: theme.textMuted }]}>DATA FIDUCIARY</Text>
                  <Text style={[styles.contactVal, { color: theme.textPrimary }]}>{BRAND_ENTITY.publisher}</Text>

                  <Text style={[styles.contactLabel, { color: theme.textMuted, marginTop: 8 }]}>EMAIL CONTACT</Text>
                  <Text style={[styles.contactVal, { color: '#2563EB' }]}>{BRAND_ENTITY.contactEmail}</Text>

                  <Text style={[styles.contactLabel, { color: theme.textMuted, marginTop: 8 }]}>WEBSITE</Text>
                  <Text style={[styles.contactVal, { color: theme.textPrimary }]}>{BRAND_ENTITY.websiteUrl}</Text>

                  <Text style={[styles.contactLabel, { color: theme.textMuted, marginTop: 8 }]}>RESPONSE TIMELINE</Text>
                  <Text style={[styles.contactVal, { color: theme.textPrimary }]}>Within 72 hours</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  headerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: FontFamily.sans,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  headerSub: {
    fontFamily: FontFamily.mono,
    fontSize: 10,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 6,
  },
  tabSelector: {
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  tabScroll: {
    paddingHorizontal: 16,
    gap: 6,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  tabBtnText: {
    fontFamily: FontFamily.sans,
    fontSize: 11,
    fontWeight: '700',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionWrap: {
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  cardTitle: {
    fontFamily: FontFamily.sans,
    fontSize: 14.5,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  paragraph: {
    fontFamily: FontFamily.sans,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  rightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 6,
  },
  rightName: {
    fontFamily: FontFamily.sans,
    fontSize: 12.5,
    fontWeight: '600',
  },
  rightDesc: {
    fontFamily: FontFamily.sans,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: -0.1,
  },
  specBox: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.06)',
    gap: 6,
  },
  specTitle: {
    fontFamily: FontFamily.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  specText: {
    fontFamily: FontFamily.sans,
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: -0.1,
  },
  contactCard: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    gap: 2,
  },
  contactLabel: {
    fontFamily: FontFamily.mono,
    fontSize: 9.5,
    fontWeight: '700',
  },
  contactVal: {
    fontFamily: FontFamily.mono,
    fontSize: 12,
    fontWeight: '600',
  },
});
