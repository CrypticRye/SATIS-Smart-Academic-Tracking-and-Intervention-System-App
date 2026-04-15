import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GraduationCap,
  AlertTriangle,
  ClipboardCheck,
  BookCheck,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import Mainmenu from "../../src/components/MainMenu";
import styles from "@styles/home";
import axios from "axios";
import { useAuth } from "@context/AuthContext";
import SubjectCard from "../../src/components/SubjectCard";
import NotificationItem from "../../src/components/NotificationItem";
import MiniChart from "../../src/components/MiniChart";
import QuickActionCard from "../../src/components/QuickActionCard";
import SemesterToggle from "../../src/components/SemesterToggle";
import SchoolPic from "@assets/school.jpg";
// Helper function for time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

const normalizeList = (value) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value);
  return [];
};

const firstNonEmpty = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    return value;
  }

  return null;
};

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === "") return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const splitName = (value) => {
  const tokens = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (tokens.length === 0) {
    return { firstName: "", middleName: "", lastName: "" };
  }

  if (tokens.length === 1) {
    return { firstName: tokens[0], middleName: "", lastName: "" };
  }

  return {
    firstName: tokens[0],
    middleName: tokens.length > 2 ? tokens.slice(1, -1).join(" ") : "",
    lastName: tokens[tokens.length - 1],
  };
};

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [greeting, setGreeting] = useState(getGreeting());
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const fetchDashboard = useCallback(
    async (semester = null) => {
      const params = semester ? { semester } : {};
      setError(null);

      let dashboardData = null;
      let performanceData = null;
      let profileData = null;

      try {
        const res = await axios.get(`/student/dashboard`, { params });
        dashboardData = res.data || {};
      } catch (err) {
        console.warn("Home: failed to load dashboard", err?.response || err);
      }

      const dashboardSubjects = normalizeList(
        dashboardData?.subjectPerformance,
      );
      const needsPerformanceFallback =
        dashboardData === null ||
        dashboardSubjects.length === 0 ||
        firstNonEmpty(
          dashboardData?.stats?.overallGrade,
          dashboardData?.stats?.overall_grade,
        ) === null;

      if (needsPerformanceFallback) {
        try {
          const perfRes = await axios.get(`/student/performance`, { params });
          performanceData = perfRes.data || {};
        } catch (fallbackErr) {
          console.warn(
            "Home: performance fallback failed",
            fallbackErr?.response || fallbackErr,
          );
        }
      }

      const candidateStudent = {
        ...(dashboardData?.student || {}),
        ...(performanceData?.student || {}),
      };

      const hasName =
        firstNonEmpty(
          candidateStudent?.firstName,
          candidateStudent?.first_name,
          candidateStudent?.fullName,
          candidateStudent?.full_name,
          candidateStudent?.displayName,
          candidateStudent?.studentName,
          candidateStudent?.student_name,
        ) !== null;

      const hasClassInfo =
        firstNonEmpty(
          candidateStudent?.gradeLevel,
          candidateStudent?.grade_level,
          candidateStudent?.section,
          candidateStudent?.classSection,
          candidateStudent?.class_section,
        ) !== null;

      if (!hasName || !hasClassInfo) {
        try {
          const profileRes = await axios.get(`/student/profile`);
          profileData = profileRes.data || {};
        } catch (profileErr) {
          console.warn(
            "Home: profile fallback failed",
            profileErr?.response || profileErr,
          );
        }
      }

      const mergedNameSeed = firstNonEmpty(
        dashboardData?.student?.fullName,
        dashboardData?.student?.full_name,
        dashboardData?.student?.displayName,
        dashboardData?.student?.studentName,
        dashboardData?.student?.student_name,
        performanceData?.student?.fullName,
        performanceData?.student?.full_name,
        performanceData?.student?.displayName,
        performanceData?.student?.studentName,
        performanceData?.student?.student_name,
        profileData?.student?.studentName,
        profileData?.student?.student_name,
        profileData?.user?.name,
        user?.name,
      );

      const splitMergedName = splitName(mergedNameSeed);

      const mergedStudent = {
        ...(dashboardData?.student || {}),
        ...(performanceData?.student || {}),
        ...(profileData?.student || {}),
        id: firstNonEmpty(
          dashboardData?.student?.id,
          performanceData?.student?.id,
          profileData?.student?.id,
        ),
        firstName: firstNonEmpty(
          dashboardData?.student?.firstName,
          dashboardData?.student?.first_name,
          performanceData?.student?.firstName,
          performanceData?.student?.first_name,
          profileData?.student?.firstName,
          profileData?.student?.first_name,
          profileData?.user?.firstName,
          profileData?.user?.first_name,
          user?.firstName,
          user?.first_name,
          splitMergedName.firstName,
        ),
        middleName: firstNonEmpty(
          dashboardData?.student?.middleName,
          dashboardData?.student?.middle_name,
          performanceData?.student?.middleName,
          performanceData?.student?.middle_name,
          profileData?.student?.middleName,
          profileData?.student?.middle_name,
          profileData?.user?.middleName,
          profileData?.user?.middle_name,
          user?.middleName,
          user?.middle_name,
          splitMergedName.middleName,
        ),
        lastName: firstNonEmpty(
          dashboardData?.student?.lastName,
          dashboardData?.student?.last_name,
          performanceData?.student?.lastName,
          performanceData?.student?.last_name,
          profileData?.student?.lastName,
          profileData?.student?.last_name,
          profileData?.user?.lastName,
          profileData?.user?.last_name,
          user?.lastName,
          user?.last_name,
          splitMergedName.lastName,
        ),
        fullName: firstNonEmpty(
          dashboardData?.student?.fullName,
          dashboardData?.student?.full_name,
          performanceData?.student?.fullName,
          performanceData?.student?.full_name,
          profileData?.user?.name,
          mergedNameSeed,
        ),
        displayName: firstNonEmpty(
          dashboardData?.student?.displayName,
          performanceData?.student?.displayName,
          profileData?.student?.studentName,
          profileData?.student?.student_name,
          mergedNameSeed,
        ),
        studentName: firstNonEmpty(
          dashboardData?.student?.studentName,
          dashboardData?.student?.student_name,
          performanceData?.student?.studentName,
          performanceData?.student?.student_name,
          profileData?.student?.studentName,
          profileData?.student?.student_name,
          mergedNameSeed,
        ),
        email: firstNonEmpty(
          dashboardData?.student?.email,
          performanceData?.student?.email,
          profileData?.user?.email,
          user?.email,
        ),
        gradeLevel: firstNonEmpty(
          dashboardData?.student?.gradeLevel,
          dashboardData?.student?.grade_level,
          performanceData?.student?.gradeLevel,
          performanceData?.student?.grade_level,
          profileData?.student?.gradeLevel,
          profileData?.student?.grade_level,
        ),
        section: firstNonEmpty(
          dashboardData?.student?.section,
          dashboardData?.student?.classSection,
          dashboardData?.student?.class_section,
          performanceData?.student?.section,
          performanceData?.student?.classSection,
          performanceData?.student?.class_section,
          profileData?.student?.section,
          profileData?.student?.classSection,
          profileData?.student?.class_section,
        ),
        strand: firstNonEmpty(
          dashboardData?.student?.strand,
          performanceData?.student?.strand,
          profileData?.student?.strand,
        ),
        track: firstNonEmpty(
          dashboardData?.student?.track,
          performanceData?.student?.track,
          profileData?.student?.track,
        ),
        lrn: firstNonEmpty(
          dashboardData?.student?.lrn,
          performanceData?.student?.lrn,
          profileData?.student?.lrn,
        ),
      };

      const mergedStats = {
        ...(performanceData?.stats || {}),
        ...(dashboardData?.stats || {}),
        overallGrade: firstNonEmpty(
          dashboardData?.stats?.overallGrade,
          dashboardData?.stats?.overall_grade,
          performanceData?.stats?.overallGrade,
          performanceData?.stats?.overall_grade,
        ),
        overallAttendance: firstNonEmpty(
          dashboardData?.stats?.overallAttendance,
          dashboardData?.stats?.overall_attendance,
          performanceData?.stats?.overallAttendance,
          performanceData?.stats?.overall_attendance,
        ),
        totalSubjects: firstNonEmpty(
          dashboardData?.stats?.totalSubjects,
          dashboardData?.stats?.total_subjects,
          performanceData?.stats?.totalSubjects,
          performanceData?.stats?.total_subjects,
          normalizeList(performanceData?.subjectPerformance).length || null,
          normalizeList(dashboardData?.subjectPerformance).length || null,
        ),
      };

      const mergedSubjects =
        normalizeList(dashboardData?.subjectPerformance).length > 0
          ? normalizeList(dashboardData?.subjectPerformance)
          : normalizeList(performanceData?.subjectPerformance);

      const nextData = {
        ...(performanceData || {}),
        ...(dashboardData || {}),
        student: mergedStudent,
        stats: mergedStats,
        subjectPerformance: mergedSubjects,
      };

      const hasRenderableData =
        mergedSubjects.length > 0 ||
        firstNonEmpty(
          mergedStudent?.firstName,
          mergedStudent?.fullName,
          mergedStudent?.displayName,
        ) !== null ||
        firstNonEmpty(mergedStats?.overallGrade) !== null;

      if (!hasRenderableData) {
        setData(null);
        setError("Failed to load dashboard");
        return;
      }

      setData(nextData);
      setError(null);

      if (semester === null && nextData?.semesters?.selected) {
        setSelectedSemester(nextData.semesters.selected);
      }
    },
    [
      user?.email,
      user?.firstName,
      user?.first_name,
      user?.lastName,
      user?.last_name,
      user?.middleName,
      user?.middle_name,
      user?.name,
    ],
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        await fetchDashboard();
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [fetchDashboard]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboard(selectedSemester);
    setRefreshing(false);
  }, [fetchDashboard, selectedSemester]);

  const handleSemesterChange = useCallback(
    async (semester) => {
      if (semester === selectedSemester) return;
      setSelectedSemester(semester);
      setLoading(true);
      await fetchDashboard(semester);
      setLoading(false);
    },
    [fetchDashboard, selectedSemester],
  );

  const markNotificationRead = async (notificationId) => {
    try {
      await axios.post(`/student/notifications/${notificationId}/read`);
      // update local state
      setData((prev) => {
        if (!prev) return prev;
        const previousNotifications = normalizeList(prev.notifications);
        return {
          ...prev,
          notifications: previousNotifications.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
          unreadNotificationCount: Math.max(
            (prev.unreadNotificationCount || 0) - 1,
            0,
          ),
        };
      });
    } catch (err) {
      console.warn("Failed to mark notification read", err?.response || err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await axios.post(`/student/notifications/read-all`);
      setData((prev) => {
        if (!prev) return prev;
        const previousNotifications = normalizeList(prev.notifications);
        return {
          ...prev,
          notifications: previousNotifications.map((n) => ({
            ...n,
            isRead: true,
          })),
          unreadNotificationCount: 0,
        };
      });
    } catch (err) {
      console.warn("Failed to mark all read", err?.response || err);
    }
  };

  const subjectPerformance = normalizeList(data?.subjectPerformance);
  const notifications = normalizeList(data?.notifications);
  const upcomingTasks = normalizeList(data?.upcomingTasks);

  const totalNotifications = notifications.length;
  const unreadNotificationCount = data?.unreadNotificationCount || 0;
  const displayedNotifications = showAllNotifications
    ? notifications
    : notifications.slice(0, 3);

  const studentNameSeed = firstNonEmpty(
    data?.student?.displayName,
    data?.student?.fullName,
    data?.student?.full_name,
    data?.student?.studentName,
    data?.student?.student_name,
    user?.name,
  );
  const splitStudentName = splitName(studentNameSeed);

  const studentFirstName = firstNonEmpty(
    data?.student?.firstName,
    data?.student?.first_name,
    user?.firstName,
    user?.first_name,
    splitStudentName.firstName,
    "Student",
  );

  const studentFullName = firstNonEmpty(
    studentNameSeed,
    [
      firstNonEmpty(data?.student?.firstName, data?.student?.first_name),
      firstNonEmpty(data?.student?.middleName, data?.student?.middle_name),
      firstNonEmpty(data?.student?.lastName, data?.student?.last_name),
    ]
      .filter(Boolean)
      .join(" "),
    "Student",
  );

  const studentGradeLevel = firstNonEmpty(
    data?.student?.gradeLevel,
    data?.student?.grade_level,
  );

  const studentSection = firstNonEmpty(
    data?.student?.section,
    data?.student?.classSection,
    data?.student?.class_section,
  );

  const classLabel = [
    studentGradeLevel ? `Grade ${studentGradeLevel}` : null,
    studentSection,
  ]
    .filter(Boolean)
    .join(" - ");

  const overallGradeValue = toNumberOrNull(
    firstNonEmpty(data?.stats?.overallGrade, data?.stats?.overall_grade),
  );

  const overallGradeLabel =
    overallGradeValue !== null ? `${overallGradeValue}%` : "N/A";

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.center, { flex: 1 }]}>
          <ActivityIndicator size="large" color="#FF6B9D" />
        </View>
      </SafeAreaView>
    );
  }

  if (error && !data) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.center, { flex: 1, paddingHorizontal: 24 }]}>
          <Text style={{ color: "#DC2626", fontSize: 14, textAlign: "center" }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={() => fetchDashboard(selectedSemester)}
            style={{
              marginTop: 14,
              backgroundColor: "#DB2777",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#FFF", fontWeight: "700" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.mainMenuWrapper}>
        <Mainmenu />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#DB2777"]}
            tintColor="#DB2777"
          />
        }
      >
        {/* Welcome Section */}
        <ImageBackground
          source={SchoolPic}
          style={styles.welcomeCard}
          imageStyle={styles.welcomeCardImage}
        >
          <View style={styles.welcomeOverlay}>
            <Text style={styles.welcomeTitle}>
              {greeting}, {studentFirstName}!
            </Text>
            <Text style={styles.welcomeSubtitle}>
              Student: {studentFullName}
            </Text>
            <Text style={styles.welcomeMeta}>
              {classLabel || "Class: N/A"} • Overall Grade: {overallGradeLabel}
            </Text>
          </View>
        </ImageBackground>

        {/* Semester Toggle */}
        <SemesterToggle
          currentSemester={data?.semesters?.current || 1}
          selectedSemester={data?.semesters?.selected || selectedSemester || 1}
          schoolYear={data?.semesters?.schoolYear || ""}
          semester1Count={data?.semesters?.semester1Count || 0}
          semester2Count={data?.semesters?.semester2Count || 0}
          onSemesterChange={handleSemesterChange}
        />

        {/* Key Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <GraduationCap size={24} color="#DB2777" />
            <Text style={styles.statValue}>{overallGradeLabel}</Text>
            <Text style={styles.statLabel}>Overall Grade</Text>
          </View>
          <View style={styles.statCard}>
            <ClipboardCheck size={24} color="#10B981" />
            <Text style={styles.statValue}>
              {data?.stats?.overallAttendance ?? "N/A"}%
            </Text>
            <Text style={styles.statLabel}>Attendance</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/performance",
                params: { risk: "at-risk" },
              })
            }
            style={styles.statCard}
            activeOpacity={0.7}
          >
            <AlertTriangle size={24} color="#F59E0B" />
            <Text style={styles.statValue}>
              {data?.stats?.subjectsAtRisk ?? 0}
            </Text>
            <Text style={styles.statLabel}>At Risk</Text>
            <Text style={styles.statSubLabel}>
              of {data?.stats?.totalSubjects ?? 0} subjects
            </Text>
          </TouchableOpacity>
          <View style={styles.statCard}>
            <BookCheck size={24} color="#6366F1" />
            <Text style={styles.statValue}>
              {data?.stats?.completedTasks ?? 0}/{data?.stats?.totalTasks ?? 0}
            </Text>
            <Text style={styles.statLabel}>Tasks Done</Text>
          </View>
        </View>

        {/* Subject Performance */}
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
              Subject Performance
            </Text>
            <TouchableOpacity onPress={() => router.push("/performance")}>
              <Text style={{ color: "#6366F1", fontWeight: "600" }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {subjectPerformance.slice(0, 4).map((subject) => (
              <View key={subject.id} style={{ width: "48%", marginBottom: 12 }}>
                <SubjectCard subject={subject} />
              </View>
            ))}
            {subjectPerformance.length === 0 && (
              <View
                style={{
                  padding: 16,
                  backgroundColor: "#fff",
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: "#6B7280" }}>
                  No subjects enrolled yet
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Grade Trend & Pending Tasks */}
        <View style={{ marginBottom: 16 }}>
          {/* Grade Trend */}
          <View style={styles.trendSection}>
            <Text style={styles.trendTitle}>Grade Trend</Text>
            {data?.gradeTrend?.subjectName ? (
              <Text style={styles.trendSubtitle}>
                <Text style={{ fontWeight: "600", color: "#6366F1" }}>
                  {data.gradeTrend.subjectName}
                </Text>
                {" trend"}
              </Text>
            ) : (
              <Text style={styles.trendSubtitle}>Score by category</Text>
            )}
            <MiniChart data={data?.gradeTrend || {}} />
          </View>

          {/* Pending Tasks */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 14,
              marginTop: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: "700", color: "#111827" }}
              >
                Pending Tasks
              </Text>
              <View
                style={{
                  backgroundColor: "#DBEAFE",
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 10,
                }}
              >
                <Text
                  style={{ fontSize: 11, color: "#1D4ED8", fontWeight: "600" }}
                >
                  {upcomingTasks.length} pending
                </Text>
              </View>
            </View>
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task, index) => (
                <View
                  key={task.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 10,
                    paddingVertical: 10,
                    borderBottomWidth: index < upcomingTasks.length - 1 ? 1 : 0,
                    borderBottomColor: "#F3F4F6",
                  }}
                >
                  <View
                    style={{
                      width: 14,
                      height: 14,
                      marginTop: 2,
                      borderRadius: 3,
                      borderWidth: 1.5,
                      borderColor: "#D1D5DB",
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#111827",
                        fontWeight: "500",
                      }}
                    >
                      {task.description}
                    </Text>
                    <Text
                      style={{ fontSize: 11, color: "#6B7280", marginTop: 3 }}
                    >
                      {task.subject}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 16 }}>
                <Text style={{ fontSize: 24, marginBottom: 6 }}>🎉</Text>
                <Text
                  style={{ color: "#10B981", fontWeight: "600", fontSize: 13 }}
                >
                  All tasks completed!
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Notifications */}
        <View style={{ marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}
              >
                Notifications
              </Text>
              {unreadNotificationCount > 0 && (
                <View
                  style={{
                    backgroundColor: "#EF4444",
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 999,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#FFFFFF",
                      fontWeight: "700",
                    }}
                  >
                    {unreadNotificationCount > 99
                      ? "99+"
                      : unreadNotificationCount}
                  </Text>
                </View>
              )}
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              {unreadNotificationCount > 0 && (
                <TouchableOpacity onPress={markAllNotificationsRead}>
                  <Text
                    style={{
                      color: "#6366F1",
                      fontWeight: "600",
                      fontSize: 12,
                    }}
                  >
                    Mark all read
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={() => router.push("/intervention")}>
                <Text
                  style={{ color: "#6B7280", fontWeight: "600", fontSize: 12 }}
                >
                  View all →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {totalNotifications > 0 ? (
            <View>
              {displayedNotifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onPress={async () => {
                    await markNotificationRead(n.id);
                    router.push(`/intervention?highlight=${n.id}`);
                  }}
                  onMarkRead={async (id) => await markNotificationRead(id)}
                />
              ))}

              {totalNotifications > 3 && (
                <TouchableOpacity
                  onPress={() => setShowAllNotifications((prev) => !prev)}
                  style={{
                    marginTop: 4,
                    paddingVertical: 8,
                    borderRadius: 10,
                    alignItems: "center",
                    backgroundColor: "#EEF2FF",
                  }}
                >
                  <Text
                    style={{
                      color: "#4F46E5",
                      fontWeight: "600",
                      fontSize: 12,
                    }}
                  >
                    {showAllNotifications
                      ? "Show Less"
                      : `View ${totalNotifications - 3} More`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View
              style={{
                padding: 20,
                backgroundColor: "#fff",
                borderRadius: 16,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 28, marginBottom: 8 }}>📭</Text>
              <Text style={{ color: "#6B7280", fontSize: 13 }}>
                No notifications yet
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#111827",
              marginBottom: 10,
            }}
          >
            Quick Actions
          </Text>
          <QuickActionCard
            title="View Analytics"
            description="Detailed performance breakdown"
            onPress={() => router.push("/performance")}
            gradientColor="#6366F1"
          />
          <QuickActionCard
            title="Interventions & Feedback"
            description="Check teacher feedback"
            onPress={() => router.push("/intervention")}
            gradientColor="#DB2777"
          />
          <QuickActionCard
            title="At-Risk Subjects"
            description="Review risk overview"
            onPress={() =>
              router.push({
                pathname: "/performance",
                params: { risk: "at-risk" },
              })
            }
            gradientColor="#EF4444"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
