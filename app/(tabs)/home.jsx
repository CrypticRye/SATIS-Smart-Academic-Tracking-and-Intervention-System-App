import React, { useState, useEffect, useRef } from "react";
import Mainmenu from "../mainMenu.jsx";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
  Dimensions,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Home() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.mainMenuWrapper}>
        <Mainmenu />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
        <ImageBackground
          source={require('../../assets/school.jpg')}
          style={styles.welcomeCard}
          imageStyle={styles.welcomeCardImage}
        >
          <View style={styles.welcomeOverlay}>
            <Text style={styles.welcomeTitle}>Welcome Back, Sheena!</Text>
            <Text style={styles.welcomeSubtitle}>From Grade 12 - TVL</Text>
          </View>
        </ImageBackground>

        {/* Stats Grid - Row 1 */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>GPA</Text>
            <Text style={styles.statValue}>3.5</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Subjects at Risk</Text>
            <Text style={styles.statValue}>3</Text>
          </View>
        </View>

        {/* Stats Grid - Row 2 */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Attendance</Text>
            <Text style={styles.statValue}>85%</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Task Completion</Text>
            <Text style={styles.statValue}>70%</Text>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsCard}>
          <Text style={styles.metricsTitle}>Performance Metrics</Text>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Academic Performance</Text>
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
            <Text style={styles.metricLabel}>Attendance Rate</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: "85%" }]} />
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
            <Text style={styles.metricLabel}>Task Completion</Text>
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

          <View style={[styles.metricItem, styles.lastMetricItem]}>
            <Text style={styles.metricLabel}>Overall Health</Text>
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

        {/* Bottom Stats Summary */}
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
          <View style={[styles.bottomStatsRow, styles.lastBottomRow]}>
            <View style={styles.bottomStat}>
              <Text style={styles.bottomStatValue}>3/3</Text>
              <Text style={styles.bottomStatLabel}>Subjects Tracked</Text>
            </View>
            <View style={styles.bottomStat}>
              <Text style={styles.bottomStatValue}>70%</Text>
              <Text style={styles.bottomStatLabel}>Tasks Complete</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
  flex: 1,
  backgroundColor: '#fff7fb', // Same pink background
},
mainMenuWrapper: {
  paddingHorizontal: 16,
  paddingTop: 8,
  backgroundColor: '#fff7fb',
},
scrollView: {
  flex: 1,
},
scrollContent: {
  padding: 16,          // or paddingHorizontal: 16
  paddingTop: 8,
  paddingBottom: 100,   // Space for bottom navigation
},
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1f2937",
   
  },
  bellIcon: {
    marginLeft: 10,
    padding: 4,
  },
  welcomeCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    height: 160,
    justifyContent: 'flex-top',
  },
  welcomeCardImage: {
    borderRadius: 20,
  },
  welcomeOverlay: {
    padding: 20,
    
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#000000",
    opacity: 0.9,
    fontWeight: "500",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 12,
    textAlign: "center",
  },
  statValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#1f2937",
  },
  metricsCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 20,
  },
  metricItem: {
    marginBottom: 24,
  },
  lastMetricItem: {
    marginBottom: 0,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 32,
    backgroundColor: "#e5e7eb",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#f9a8d4",
    borderRadius: 16,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: "#9ca3af",
  },
  bottomStatsCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 3,
  },
  bottomStatsRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 24,
  },
  lastBottomRow: {
    marginBottom: 0,
  },
  bottomStat: {
    flex: 1,
    alignItems: "center",
  },
  bottomStatValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  bottomStatLabel: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    fontWeight: "500",
  },
});