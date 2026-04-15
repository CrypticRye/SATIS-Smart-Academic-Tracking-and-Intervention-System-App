import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import {
  ChevronDown,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Lightbulb,
  ClipboardList,
  BarChart3,
  MessageCircle,
} from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";
import axios from "axios";
import styles from "@styles/mainMenu";
import { useAuth } from "../context/AuthContext";
import SchoolLogo from "@assets/school-logo.png";
import SatisLogo from "@assets/satis-logo.png";

const firstNonEmpty = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    if (typeof value === "string" && value.trim() === "") continue;
    return value;
  }

  return null;
};

function Mainmenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const width = Dimensions.get("window").width;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [studentData, setStudentData] = useState(null);

  const drawerTranslateX = useState(new Animated.Value(-width * 0.85))[0];
  const drawerBackdropOpacity = useState(new Animated.Value(0))[0];

  const navigationItems = [
    {
      label: "Dashboard",
      icon: Home,
      route: "/home",
      color: "#DB2777",
    },
    {
      label: "Learn More",
      icon: Lightbulb,
      route: "/about",
      color: "#D97706",
    },
    {
      label: "Attendance",
      icon: ClipboardList,
      route: "/attendance",
      color: "#7C3AED",
    },
    {
      label: "Performance",
      icon: BarChart3,
      route: "/performance",
      color: "#2563EB",
    },
    {
      label: "Intervention",
      icon: MessageCircle,
      route: "/intervention",
      color: "#059669",
    },
  ];

  useEffect(() => {
    let isMounted = true;

    const resolveAuthFallback = () => ({
      firstName: firstNonEmpty(user?.firstName, user?.first_name),
      middleName: firstNonEmpty(user?.middleName, user?.middle_name),
      lastName: firstNonEmpty(user?.lastName, user?.last_name),
      fullName: firstNonEmpty(user?.name),
      displayName: firstNonEmpty(user?.name),
      email: firstNonEmpty(user?.email),
    });

    const fetchStudentData = async () => {
      let dashboardStudent = null;
      let profileStudent = null;
      let profileUser = null;

      try {
        const res = await axios.get("/student/dashboard");
        dashboardStudent = res.data?.student || null;
      } catch (err) {
        console.warn(
          "MainMenu: Failed to fetch student data",
          err?.response || err,
        );
      }

      const shouldFetchProfile =
        firstNonEmpty(
          dashboardStudent?.firstName,
          dashboardStudent?.first_name,
          dashboardStudent?.fullName,
          dashboardStudent?.full_name,
          dashboardStudent?.displayName,
          dashboardStudent?.studentName,
          dashboardStudent?.student_name,
        ) === null ||
        firstNonEmpty(
          dashboardStudent?.gradeLevel,
          dashboardStudent?.grade_level,
          dashboardStudent?.section,
        ) === null;

      if (shouldFetchProfile) {
        try {
          const profileRes = await axios.get("/student/profile");
          profileStudent = profileRes.data?.student || null;
          profileUser = profileRes.data?.user || null;
        } catch (profileErr) {
          console.warn(
            "MainMenu: Failed to fetch profile fallback",
            profileErr?.response || profileErr,
          );
        }
      }

      const mergedStudent = {
        ...(dashboardStudent || {}),
        ...(profileStudent || {}),
        firstName: firstNonEmpty(
          dashboardStudent?.firstName,
          dashboardStudent?.first_name,
          profileStudent?.firstName,
          profileStudent?.first_name,
          profileUser?.firstName,
          profileUser?.first_name,
          user?.firstName,
          user?.first_name,
        ),
        middleName: firstNonEmpty(
          dashboardStudent?.middleName,
          dashboardStudent?.middle_name,
          dashboardStudent?.middleInitial,
          dashboardStudent?.middle_initial,
          profileStudent?.middleName,
          profileStudent?.middle_name,
          profileUser?.middleName,
          profileUser?.middle_name,
          user?.middleName,
          user?.middle_name,
        ),
        lastName: firstNonEmpty(
          dashboardStudent?.lastName,
          dashboardStudent?.last_name,
          profileStudent?.lastName,
          profileStudent?.last_name,
          profileUser?.lastName,
          profileUser?.last_name,
          user?.lastName,
          user?.last_name,
        ),
        fullName: firstNonEmpty(
          dashboardStudent?.fullName,
          dashboardStudent?.full_name,
          dashboardStudent?.displayName,
          dashboardStudent?.studentName,
          dashboardStudent?.student_name,
          profileStudent?.studentName,
          profileStudent?.student_name,
          profileUser?.name,
          user?.name,
        ),
        displayName: firstNonEmpty(
          dashboardStudent?.displayName,
          profileStudent?.studentName,
          profileStudent?.student_name,
          profileUser?.name,
          user?.name,
        ),
      };

      const hasIdentity =
        firstNonEmpty(
          mergedStudent?.firstName,
          mergedStudent?.lastName,
          mergedStudent?.fullName,
          mergedStudent?.displayName,
        ) !== null;

      if (!isMounted) return;
      setStudentData(hasIdentity ? mergedStudent : resolveAuthFallback());
    };

    fetchStudentData();

    return () => {
      isMounted = false;
    };
  }, [
    user?.email,
    user?.firstName,
    user?.first_name,
    user?.lastName,
    user?.last_name,
    user?.middleName,
    user?.middle_name,
    user?.name,
  ]);

  useEffect(() => {
    if (drawerOpen) {
      Animated.parallel([
        Animated.timing(drawerTranslateX, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(drawerBackdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(drawerTranslateX, {
        toValue: -width * 0.85,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(drawerBackdropOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [drawerOpen, drawerTranslateX, drawerBackdropOpacity, width]);

  const getInitials = () => {
    let firstName = String(
      firstNonEmpty(
        studentData?.firstName,
        studentData?.first_name,
        user?.firstName,
        user?.first_name,
        "",
      ),
    ).trim();

    let middleName = String(
      firstNonEmpty(
        studentData?.middleInitial,
        studentData?.middle_initial,
        studentData?.middleName,
        studentData?.middle_name,
        user?.middleName,
        user?.middle_name,
        "",
      ),
    ).trim();

    let lastName = String(
      firstNonEmpty(
        studentData?.lastName,
        studentData?.last_name,
        user?.lastName,
        user?.last_name,
        "",
      ),
    ).trim();

    const fallbackName = String(
      firstNonEmpty(
        studentData?.fullName,
        studentData?.full_name,
        studentData?.displayName,
        studentData?.studentName,
        studentData?.student_name,
        user?.name,
        "",
      ),
    ).trim();

    if ((!firstName || !lastName || !middleName) && fallbackName) {
      const parts = fallbackName.split(/\s+/).filter(Boolean);
      if (!firstName && parts.length > 0) firstName = parts[0];
      if (!lastName && parts.length > 1) lastName = parts[parts.length - 1];
      if (!middleName && parts.length > 2)
        middleName = parts.slice(1, -1).join(" ");
    }

    const firstInitial = (firstName.charAt(0) || "S").toUpperCase();
    const secondSource = lastName || middleName || "T";
    const lastInitial = (secondSource.charAt(0) || "T").toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const getFullName = () => {
    let firstName = String(
      firstNonEmpty(
        studentData?.firstName,
        studentData?.first_name,
        user?.firstName,
        user?.first_name,
        "",
      ),
    ).trim();

    let middleName = String(
      firstNonEmpty(
        studentData?.middleInitial,
        studentData?.middle_initial,
        studentData?.middleName,
        studentData?.middle_name,
        user?.middleName,
        user?.middle_name,
        "",
      ),
    ).trim();

    let lastName = String(
      firstNonEmpty(
        studentData?.lastName,
        studentData?.last_name,
        user?.lastName,
        user?.last_name,
        "",
      ),
    ).trim();

    const fallbackName = String(
      firstNonEmpty(
        studentData?.fullName,
        studentData?.full_name,
        studentData?.displayName,
        studentData?.studentName,
        studentData?.student_name,
        user?.name,
        "",
      ),
    ).trim();

    if ((!firstName || !lastName || !middleName) && fallbackName) {
      const parts = fallbackName.split(/\s+/).filter(Boolean);
      if (!firstName && parts.length > 0) firstName = parts[0];
      if (!lastName && parts.length > 1) lastName = parts[parts.length - 1];
      if (!middleName && parts.length > 2)
        middleName = parts.slice(1, -1).join(" ");
    }

    const middleInitial = middleName
      ? `${middleName.charAt(0).toUpperCase()}.`
      : "";
    const fullName = [firstName, middleInitial, lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    return fullName || "Student";
  };

  const handleProfileOpen = () => {
    setDrawerOpen(false);
    setProfileMenuOpen((prev) => !prev);
  };

  const handleDrawerOpen = () => {
    setProfileMenuOpen(false);
    setDrawerOpen(true);
  };

  const handleNavigation = (route) => {
    setDrawerOpen(false);
    setTimeout(() => {
      router.push(route);
    }, 110);
  };

  const isActiveRoute = (route) =>
    pathname === route || pathname.startsWith(`${route}/`);

  const handleProfileNavigate = () => {
    setProfileMenuOpen(false);
    router.push("/profile");
  };

  const handleLogoutPress = () => {
    setProfileMenuOpen(false);
    setLogoutModalVisible(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutModalVisible(false);
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={handleDrawerOpen}
            activeOpacity={0.8}
          >
            <Menu size={21} color="#334155" strokeWidth={2.8} />
          </TouchableOpacity>

          <Image source={SchoolLogo} style={styles.logo} resizeMode="contain" />
        </View>

        <TouchableOpacity
          style={styles.profileTrigger}
          onPress={handleProfileOpen}
          activeOpacity={0.8}
        >
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <Text style={styles.profileName} numberOfLines={1}>
            {getFullName()}
          </Text>
          <ChevronDown size={15} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={drawerOpen}
        transparent
        animationType="none"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View style={styles.drawerModalRoot}>
          <Animated.View
            style={[styles.drawerBackdrop, { opacity: drawerBackdropOpacity }]}
          >
            <Pressable
              style={styles.drawerBackdropPressable}
              onPress={() => setDrawerOpen(false)}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.drawerPanel,
              { transform: [{ translateX: drawerTranslateX }] },
            ]}
          >
            <View style={styles.drawerHeader}>
              <View style={styles.drawerBrandBlock}>
                <Image
                  source={SatisLogo}
                  style={styles.drawerBrandLogo}
                  resizeMode="contain"
                />
                <View style={styles.drawerBrandTextWrap}>
                  <Text style={styles.drawerBrandTitle} numberOfLines={1}>
                    SATIS
                    <Text style={styles.drawerBrandTitleAccent}>-FACTION</Text>
                  </Text>
                  <Text style={styles.drawerBrandSubtitle} numberOfLines={2}>
                    Smart Academic Tracking and Intervention System
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.drawerCloseButton}
                onPress={() => setDrawerOpen(false)}
                activeOpacity={0.75}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.drawerScroll}
              contentContainerStyle={styles.drawerScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.route);

                return (
                  <TouchableOpacity
                    key={item.route}
                    style={[
                      styles.drawerItem,
                      isActive && styles.drawerItemActive,
                    ]}
                    onPress={() => handleNavigation(item.route)}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.drawerItemIconWrap,
                        { backgroundColor: `${item.color}16` },
                      ]}
                    >
                      <Icon
                        size={18}
                        color={isActive ? item.color : "#64748B"}
                        strokeWidth={2}
                      />
                    </View>
                    <Text
                      style={[
                        styles.drawerItemText,
                        isActive && { color: item.color, fontWeight: "700" },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={profileMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setProfileMenuOpen(false)}
      >
        <View style={styles.dropdownModalRoot}>
          <Pressable
            style={styles.dropdownBackdrop}
            onPress={() => setProfileMenuOpen(false)}
          />

          <View style={styles.dropdownContainer}>
            <View style={styles.dropdownCard}>
              <View style={styles.dropdownHeader}>
                <Text style={styles.dropdownName}>{getFullName()}</Text>
                <Text style={styles.dropdownRole}>Student</Text>
              </View>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={handleProfileNavigate}
                activeOpacity={0.75}
              >
                <User size={16} color="#4B5563" />
                <Text style={styles.dropdownItemText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={handleLogoutPress}
                activeOpacity={0.75}
              >
                <LogOut size={16} color="#E11D48" />
                <Text style={styles.dropdownItemTextDanger}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalContainer}>
            <View style={styles.confirmIconContainer}>
              <LogOut size={30} color="#DC2626" strokeWidth={2} />
            </View>

            <Text style={styles.confirmTitle}>Logout</Text>
            <Text style={styles.confirmMessage}>
              Are you sure you want to logout? You will need to sign in again.
            </Text>

            <View style={styles.confirmButtonRow}>
              <TouchableOpacity
                style={styles.confirmCancelButton}
                onPress={() => setLogoutModalVisible(false)}
                activeOpacity={0.75}
              >
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmLogoutButton}
                onPress={handleLogoutConfirm}
                activeOpacity={0.75}
              >
                <Text style={styles.confirmLogoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default Mainmenu;
