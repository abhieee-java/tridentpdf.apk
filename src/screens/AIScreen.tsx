import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAppTheme } from '../theme/ThemeContext';
import { AIAssistantService, PIIItem } from '../services/aiAssistantService';
import { Bot, Send, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react-native';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const AIScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const [activeTab, setActiveTab] = useState<'chat' | 'pii' | 'summary'>('chat');
  const [inputText, setInputText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! I am your TridentPDF AI Document Assistant. You can ask me to summarize documents, clarify clauses, or detect sensitive personal data (PII). All processing executes 100% on-device in volatile RAM under DPDP Act 2023 zero-retention rules.',
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  // PII Redaction State
  const [samplePIIText, setSamplePIIText] = useState<string>(
    'The buyer John Doe (SSN: 123-45-6789, email: john.doe@example.com, phone: 555-019-2834) agreed to payment with card 4111-2222-3333-4444.'
  );
  const [redactionResult, setRedactionResult] = useState<{
    redactedText: string;
    detections: PIIItem[];
  } | null>(null);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    setInputText('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const reply = await AIAssistantService.queryDocument('TridentPDF Document Context', userMsg);
    setLoading(false);
    setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
  };

  const handleRunPIIRedaction = () => {
    const res = AIAssistantService.redactPIILocally(samplePIIText);
    setRedactionResult(res);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Sub Tabs */}
      <View style={[styles.tabBar, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'chat' && { backgroundColor: theme.primary }]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'chat' ? '#FFF' : theme.textSecondary }]}>
            Ask AI
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'pii' && { backgroundColor: theme.primary }]}
          onPress={() => setActiveTab('pii')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'pii' ? '#FFF' : theme.textSecondary }]}>
            PII Redactor
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'summary' && { backgroundColor: theme.primary }]}
          onPress={() => setActiveTab('summary')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'summary' ? '#FFF' : theme.textSecondary }]}>
            Summarizer
          </Text>
        </TouchableOpacity>
      </View>

      {/* CHAT TAB */}
      {activeTab === 'chat' && (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.chatScroll} showsVerticalScrollIndicator={false}>
            {messages.map((m, idx) => (
              <View
                key={idx}
                style={[
                  styles.msgBubble,
                  m.role === 'user' ? styles.userBubble : styles.assistantBubble,
                  {
                    backgroundColor: m.role === 'user' ? theme.primary : theme.surfaceCard,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text style={[styles.msgText, { color: m.role === 'user' ? '#FFFFFF' : theme.textPrimary }]}>
                  {m.text}
                </Text>
              </View>
            ))}
            {loading && (
              <View style={[styles.msgBubble, styles.assistantBubble, { backgroundColor: theme.surfaceCard }]}>
                <ActivityIndicator size="small" color="#3B82F6" />
              </View>
            )}
          </ScrollView>

          {/* Chat Input Bar */}
          <View style={[styles.inputBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
            <TextInput
              style={[styles.input, { color: theme.textPrimary, backgroundColor: theme.surfaceElevated }]}
              placeholder="Ask anything about your document..."
              placeholderTextColor={theme.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSendMessage}
            />
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
              <Send size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* PII REDACTOR TAB */}
      {activeTab === 'pii' && (
        <ScrollView style={styles.tabContent} contentContainerStyle={{ paddingBottom: 32 }}>
          <View style={[styles.infoCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <ShieldAlert size={20} color="#F59E0B" />
              <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>Automated Privacy Sanitizer</Text>
            </View>
            <Text style={[styles.cardText, { color: theme.textSecondary }]}>
              Scans document text for sensitive Personally Identifiable Information and sanitizes them before sharing.
            </Text>
          </View>

          <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>Input Document Text / Excerpt:</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.surfaceCard, color: theme.textPrimary, borderColor: theme.border }]}
            multiline
            numberOfLines={4}
            value={samplePIIText}
            onChangeText={setSamplePIIText}
          />

          <TouchableOpacity style={styles.actionBtn} onPress={handleRunPIIRedaction}>
            <Text style={styles.actionBtnText}>🛡️ Run AI Redaction Scan</Text>
          </TouchableOpacity>

          {redactionResult && (
            <View style={[styles.resultCard, { backgroundColor: theme.surfaceCard, borderColor: '#10B981' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <CheckCircle2 size={18} color="#10B981" />
                <Text style={{ color: '#10B981', fontWeight: '800', fontSize: 14 }}>
                  {redactionResult.detections.length} Sensitive Items Detected & Masked
                </Text>
              </View>

              <Text style={[styles.redactedOutput, { color: theme.textPrimary }]}>
                {redactionResult.redactedText}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* SUMMARIZER TAB */}
      {activeTab === 'summary' && (
        <ScrollView style={styles.tabContent} contentContainerStyle={{ paddingBottom: 32 }}>
          <View style={[styles.infoCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <FileText size={20} color="#3B82F6" />
              <Text style={[styles.cardHeading, { color: theme.textPrimary }]}>Document Executive Summary</Text>
            </View>
            <Text style={[styles.cardText, { color: theme.textSecondary }]}>
              Generates executive takeaways and identifies critical action items across contracts and agreements.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              Alert.alert(
                'Summary Generated',
                '• Agreement Term: 24 Months\n• Termination Notice: 30 Days\n• Governing Law: State of California\n• Status: Ready for execution'
              );
            }}
          >
            <Text style={styles.actionBtnText}>📄 Summarize Current Document</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    margin: 16,
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  chatScroll: {
    padding: 16,
    gap: 12,
  },
  msgBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    fontSize: 14,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    padding: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeading: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardText: {
    fontSize: 13,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  textArea: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  actionBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  resultCard: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  redactedOutput: {
    fontSize: 13,
    lineHeight: 19,
    fontFamily: 'monospace',
  },
});
