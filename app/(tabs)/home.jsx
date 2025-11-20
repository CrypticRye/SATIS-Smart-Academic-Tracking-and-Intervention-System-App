import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={32} color="#1f2937" />
          </TouchableOpacity>
          <View style={styles.profileSection}>
            <View style={styles.profileImage}>
              <Image
                source={{ uri: "https://via.placeholder.com/48" }}
                style={styles.avatar}
              />
            </View>
            <View >
              <Text style={styles.grade}>Grade 12</Text>
              <Text style={styles.stream}>STEM</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#9ca3af"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
          />
          <TouchableOpacity style={styles.bellIcon}>
            <Ionicons name="notifications-outline" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome Back, Sheena!</Text>
          <Text style={styles.welcomeSubtitle}>Lorem Ipsum</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>GPA</Text>
            <Text style={styles.statValue}>3.5</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Subject at Risk</Text>
            <Text style={styles.statValue}>3</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Attendance</Text>
            <Text style={styles.statValue}>85%</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Subject at Risk</Text>
            <Text style={styles.statValue}>3</Text>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsCard}>
          <Text style={styles.metricsTitle}>Performance Metrics:</Text>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Academic Performance:</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: "45%" }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>0</Text>
              <Text style={styles.progressLabel}>25</Text>
              <Text style={styles.progressLabel}>50</Text>
              <Text style={styles.progressLabel}>75</Text>
              <Text style={styles.progressLabel}>100</Text>
            </View>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Attendance Rate:</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: "50%" }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>0</Text>
              <Text style={styles.progressLabel}>25</Text>
              <Text style={styles.progressLabel}>50</Text>
              <Text style={styles.progressLabel}>75</Text>
              <Text style={styles.progressLabel}>100</Text>
            </View>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Task Completion:</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: "50%" }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>0</Text>
              <Text style={styles.progressLabel}>25</Text>
              <Text style={styles.progressLabel}>50</Text>
              <Text style={styles.progressLabel}>75</Text>
              <Text style={styles.progressLabel}>100</Text>
            </View>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Overall Health:</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: "70%" }]} />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>0</Text>
              <Text style={styles.progressLabel}>25</Text>
              <Text style={styles.progressLabel}>50</Text>
              <Text style={styles.progressLabel}>75</Text>
              <Text style={styles.progressLabel}>100</Text>
            </View>
          </View>
        </View>

        {/* Bottom Stats */}
        <View style={styles.bottomStatsCard}>
          <View style={styles.bottomStatsRow}>
            <View style={styles.bottomStat}>
              <Text style={styles.bottomStatValue}>71.7%</Text>
              <Text style={styles.bottomStatLabel}>Average Grade</Text>
            </View>
            <View style={styles.bottomStat}>
              <Text style={styles.bottomStatValue}>85%</Text>
              <Text style={styles.bottomStatLabel}>Attendance</Text>
            </View>
          </View>
          <View style={styles.bottomStatsRow}>
            <View style={styles.bottomStat}>
              <Text style={styles.bottomStatValue}>3/3</Text>
              <Text style={styles.bottomStatLabel}>Subject Tracked</Text>
            </View>
            <View style={styles.bottomStat}>
              <Text style={styles.bottomStatValue}>70%</Text>
              <Text style={styles.bottomStatLabel}>Task Complete</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF0F5",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#374151",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  
  grade: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  stream: {
    fontSize: 10,
    color: "#374151",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
  },
  bellIcon: {
    marginLeft: 8,
  },
  welcomeCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6b7280",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
    textAlign: "center",
  },
  statValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1f2937",
  },
  metricsCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  metricsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 24,
  },
  metricItem: {
    marginBottom: 24,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 32,
    backgroundColor: "#e5e7eb",
    borderRadius: 16,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#f9a8d4",
    borderRadius: 16,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  bottomStatsCard: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
  },
  bottomStatsRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 24,
  },
  bottomStat: {
    flex: 1,
    alignItems: "center",
  },
  bottomStatValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  bottomStatLabel: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
});
