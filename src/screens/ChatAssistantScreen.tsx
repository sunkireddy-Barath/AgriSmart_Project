import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { queryGemini } from '../services/gemini';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/Card';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatAssistantScreen() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your AI farming assistant. Ask me anything about farming, crops, or agricultural practices.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    // scroll to bottom when messages change
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputText('');

    // Decide routing: if query is crop related, use Gemini; else use local responder
    const lower = inputText.toLowerCase();
    const isCropQuery = lower.includes('crop') || lower.includes('paddy') || lower.includes('rice') || lower.includes('maize') || lower.includes('wheat');

    if (isCropQuery) {
      setLoading(true);
      queryGemini(inputText)
        .then((response) => {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: typeof response === 'string' ? response : JSON.stringify(response),
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiMessage]);
        })
        .catch(() => {
          const aiMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: 'Sorry, AI service failed to respond.',
            isUser: false,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiMessage]);
        })
        .finally(() => setLoading(false));
    } else {
      // local responder for other topics
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('crop')) {
      return 'For optimal crop growth, ensure proper soil nutrients (NPK balance), adequate water supply, and good pest management practices.';
    }
    if (lowerQuery.includes('price') || lowerQuery.includes('market')) {
      return 'Check the Market Prices tab for the latest crop prices and trends in your area.';
    }
    if (lowerQuery.includes('disease') || lowerQuery.includes('pest')) {
      return 'Use the Disease Detection feature to upload an image of the affected plant, and I will help you identify and treat it.';
    }
    if (lowerQuery.includes('profit') || lowerQuery.includes('cost')) {
      return 'Navigate to the Profit & Loss Analysis tab to calculate your farming costs and expected returns.';
    }
    
    return 'I understand your question about farming. Could you provide more specific details? I can help with crop selection, disease detection, market prices, and profitability analysis.';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 100}
      >
        <View style={styles.headerDark}>
          <Text style={styles.title}>AI Chat Assistant</Text>
          <Text style={styles.subtitle}>Ask me anything about farming</Text>
        </View>

  <ScrollView ref={scrollRef as any} style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <View style={[styles.messageBubble, message.isUser ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.messageText, message.isUser ? styles.userText : styles.aiText]}>
                {message.text}
              </Text>
            </View>
          </View>
        ))}
        </ScrollView>

        <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask me about farming..."
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={500}
          onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 250)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#000000',
  },
  header: {
    backgroundColor: '#8b5cf6',
    padding: 20,
    paddingTop: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerDark: {
    backgroundColor: '#071840',
    padding: 20,
    paddingTop: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color:'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd6fe',
  },
  messagesContainer: {
  flex: 1,
  backgroundColor: 'transparent',
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageContainer: {
    marginBottom: 8,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
  backgroundColor: '#0d9488',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
  backgroundColor: '#071837',
    borderBottomLeftRadius: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
  color: '#E6F7FF',
  },
  aiText: {
  color: '#9FD3FF',
  },
  inputContainer: {
  flexDirection: 'row',
  padding: 16,
  gap: 8,
  backgroundColor: '#071840',
  borderTopWidth: 0,
  paddingBottom: 8,
  marginBottom: 8,
  },
  input: {
    flex: 1,
  borderWidth: 0,
  borderRadius: 24,
  paddingHorizontal: 16,
  paddingVertical: 12,
  fontSize: 14,
  maxHeight: 100,
  color: '#E6F7FF',
  backgroundColor: 'rgba(255,255,255,0.03)'
  },
  sendButton: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: '#22c55e',
  justifyContent: 'center',
  alignItems: 'center',
  },
});
