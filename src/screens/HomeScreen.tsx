import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { useTranslation } from "react-i18next";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const menuItems = [
    {
      id: "crop",
      icon: "leaf",
      label: "Crop Recommendation",
      color: "#22c55e",
      screen: "Crop",
    },
    {
      id: "disease",
      icon: "bug",
      label: "Disease Detection",
      color: "#ef4444",
      screen: "DiseaseDetection",
    },
    {
      id: "pest",
      icon: "bug-outline",
      label: "Pest Detection",
      color: "#8b5cf6",
      screen: "PestDetection",
    },
    {
      id: "profit",
      icon: "calculator",
      label: "Profit & Loss Analysis",
      color: "#f59e0b",
      screen: "ProfitLoss",
    },
    {
      id: "market",
      icon: "trending-up",
      label: "Market Prices",
      color: "#3b82f6",
      screen: "Market",
    },
    {
      id: "chat",
      icon: "chatbubbles",
      label: "AI Chat Assistant",
      color: "#ec4899",
      screen: "ChatAssistant",
    },
    {
      id: "weather",
      icon: "partly-sunny",
      label: "Weather & Forecast",
      color: "#06b6d4",
      screen: "Weather",
    },
    {
      id: "community",
      icon: "people",
      label: "Community Forum",
      color: "#8b5cf6",
      screen: "Community",
    },
  ];

  const openScreen = (screenName: string) => {
    setSidebarVisible(false);
    // Navigate to stack screens using CommonActions
    navigation.getParent()?.navigate(screenName);
  };

  return (
    <View style={styles.container}>
      <Modal
        visible={sidebarVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSidebarVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalOverlay} />
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <View style={styles.headerContent}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>🌾</Text>
                </View>
                <Text style={styles.headerTitle}>AgriSmart</Text>
                <Text style={styles.headerSubtitle}>AI Farming Assistant</Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSidebarVisible(false)}
              >
                <Ionicons name="close" size={28} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuContainer}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => openScreen(item.screen)}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: item.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={24}
                      color={item.color}
                    />
                  </View>
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.menuItem}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "#22c55e20" },
                  ]}
                >
                  <Ionicons name="megaphone" size={24} color="#22c55e" />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuLabel}>Voice Assistant</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{t("common.welcome")}</Text>
            <Text style={styles.subtitle}>AI-Powered Farming Assistant</Text>
          </View>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setSidebarVisible(true)}
          >
            <Ionicons name="menu" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <Card style={styles.quickActionCard}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="leaf" size={32} color="#22c55e" />
              <Text style={styles.actionText}>Crop</Text>
            </TouchableOpacity>
          </Card>

          <Card style={styles.quickActionCard}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="bug" size={32} color="#ef4444" />
              <Text style={styles.actionText}>Disease</Text>
            </TouchableOpacity>
          </Card>

          <Card style={styles.quickActionCard}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="trending-up" size={32} color="#3b82f6" />
              <Text style={styles.actionText}>Market</Text>
            </TouchableOpacity>
          </Card>

          <Card style={styles.quickActionCard}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="calculator" size={32} color="#f59e0b" />
              <Text style={styles.actionText}>Profit</Text>
            </TouchableOpacity>
          </Card>
        </View>

        <Card>
          <Text style={styles.cardTitle}>Today's Weather</Text>
          <View style={styles.weatherCard}>
            <Ionicons name="sunny" size={48} color="#f59e0b" />
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherTemp}>28°C</Text>
              <Text style={styles.weatherDesc}>Sunny</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Top Market Prices</Text>
          <View style={styles.priceList}>
            <View style={styles.priceItem}>
              <Text style={styles.cropName}>Rice</Text>
              <Text style={styles.cropPrice}>₹45/kg ↑</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.cropName}>Wheat</Text>
              <Text style={styles.cropPrice}>₹38/kg ↓</Text>
            </View>
            <View style={styles.priceItem}>
              <Text style={styles.cropName}>Tomato</Text>
              <Text style={styles.cropPrice}>₹60/kg ↑</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: "#22c55e",
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#dcfce7",
  },
  menuButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  quickActionCard: {
    width: "47%",
    padding: 0,
    margin: 0,
  },
  actionButton: {
    alignItems: "center",
    padding: 20,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  weatherCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  weatherInfo: {
    flex: 1,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
  },
  weatherDesc: {
    fontSize: 16,
    color: "#6b7280",
  },
  priceList: {
    gap: 12,
  },
  priceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  cropName: {
    fontSize: 16,
    color: "#111827",
  },
  cropPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#22c55e",
  },
  modalContainer: {
    flex: 1,
    flexDirection: "row",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sidebar: {
    width: width * 0.85,
    backgroundColor: "#ffffff",
    borderLeftWidth: 1,
    borderLeftColor: "#e5e7eb",
  },
  sidebarHeader: {
    backgroundColor: "#22c55e",
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerContent: {
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#dcfce7",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 8,
    marginHorizontal: 20,
  },
});
