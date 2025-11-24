import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Mail, Phone, MapPin, Calendar, Book, Users } from 'lucide-react';
import { useRouter } from 'expo-router'

function StudentProfile() {
  const student = {
    name: 'Abdul, Balabak O.',
    initials: 'AB',
    lrn: '223456987345',
    status: 'Active',
    grade: 'Grade 12 - ICT - A',
    email: 'abdulbalabak@ibsths.edu.ph',
    phone: '+63 912 345 9789',
    address: 'Lunurin, Soccasurgen, Zamboanga City',
    birthDate: 'January 16, 2007',
    strand: 'Information and Communications Technology',
    schoolYear: '2025 - 2026',
    guardian: 'Fatima Balabak',
    guardianPhone: '+63 912 345 9780',
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{student.initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.lrn}>LRN: {student.lrn}</Text>
          <View style={styles.badgeContainer}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{student.status}</Text>
            </View>
            <View style={styles.gradeBadge}>
              <Text style={styles.gradeText}>{student.grade}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Users size={20} color="#333" style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Mail size={18} color="#999" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{student.email}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Phone size={18} color="#999" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{student.phone}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <MapPin size={18} color="#999" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{student.address}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Calendar size={18} color="#999" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Birth Date</Text>
            <Text style={styles.infoValue}>{student.birthDate}</Text>
          </View>
        </View>
      </View>

      {/* Academic Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Book size={20} color="#333" style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Academic Information</Text>
        </View>

        <View style={styles.academicItem}>
          <Text style={styles.infoLabel}>Grade & Section</Text>
          <Text style={styles.infoValue}>{student.grade}</Text>
        </View>

        <View style={styles.academicItem}>
          <Text style={styles.infoLabel}>Strand</Text>
          <Text style={styles.infoValue}>{student.strand}</Text>
        </View>

        <View style={styles.academicItem}>
          <Text style={styles.infoLabel}>School Year</Text>
          <Text style={styles.infoValue}>{student.schoolYear}</Text>
        </View>
      </View>

      {/* Guardian Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Users size={20} color="#333" style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Guardian Information</Text>
        </View>

        <View style={styles.academicItem}>
          <Text style={styles.infoLabel}>Guardian Name</Text>
          <Text style={styles.infoValue}>{student.guardian}</Text>
        </View>

        <View style={styles.academicItem}>
          <Text style={styles.infoLabel}>Guardian Contact</Text>
          <Text style={styles.infoValue}>{student.guardianPhone}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  lrn: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '600',
  },
  gradeBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  gradeText: {
    color: '#0284c7',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  academicItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
});

export default StudentProfile;