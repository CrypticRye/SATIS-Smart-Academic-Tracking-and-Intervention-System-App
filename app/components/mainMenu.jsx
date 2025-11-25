import { StyleSheet, Text, View, TouchableOpacity, Image, Animated, Dimensions, Modal } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

function Mainmenu() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const width = Dimensions.get('window').width;
  const translateX = useRef(new Animated.Value(-width * 0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (drawerOpen) {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: -width * 0.8,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 240,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [drawerOpen]);

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => setDrawerOpen(true)}
          style={styles.menuButton}
        >
          <Ionicons name="menu" size={28} color="#1f2937" />
        </TouchableOpacity>
        
        <View style={styles.rightSection}>
          <View style={styles.profileSection}>
            <View style={styles.profileImage}>
              <Image
                source={{ uri: "https://via.placeholder.com/48" }}
                style={styles.avatar}
              />
            </View>
            <View>
              <Text style={styles.grade}>Grade 12</Text>
              <Text style={styles.stream}>STEM</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Drawer Modal */}
      <Modal
        visible={drawerOpen}
        transparent={true}
        animationType="none"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View style={styles.modalContainer}>
          {/* Backdrop */}
          <Animated.View 
            style={[styles.drawerBackdrop, { opacity }]}
          >
            <TouchableOpacity 
              style={styles.backdropTouchable}
              activeOpacity={1}
              onPress={() => setDrawerOpen(false)} 
            />
          </Animated.View>

          {/* Drawer */}
          <Animated.View 
            style={[
              styles.drawer, 
              { transform: [{ translateX }] }
            ]}
          >
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menu</Text>
              <TouchableOpacity 
                onPress={() => setDrawerOpen(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color="#1f2937" />
              </TouchableOpacity>
            </View>

            <View style={styles.drawerContent}>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  setDrawerOpen(false);
                  router.push('/Screens/about');
                }}
              >
                <Ionicons name="information-circle-outline" size={24} color="#1f2937" />
                <Text style={styles.drawerItemText}>Learn More</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  setDrawerOpen(false);
                  router.push('/Screens/profile');
                }}
              >
                <Ionicons name="person-outline" size={24} color="#1f2937" />
                <Text style={styles.drawerItemText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  setDrawerOpen(false);
                  // Add your logout logic
                }}
              >
                <Ionicons name="log-out-outline" size={24} color="#dc2626" />
                <Text style={[styles.drawerItemText, { color: '#dc2626' }]}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  )
}

export default Mainmenu;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  menuButton: {
    padding: 8,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#374151',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  grade: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1f2937',
  },
  stream: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
  },
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  backdropTouchable: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '80%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  drawerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  drawerContent: {
    paddingTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  drawerItemText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '600',
  },
})