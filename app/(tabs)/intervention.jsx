import React, { useState, useEffect, useRef } from 'react';
import Mainmenu from "../mainMenu.jsx";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StyleSheet,
  Image,
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Mail, Calendar, X, Check } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';

const Intervention = () => {
  const [activeFilter, setActiveFilter] = useState('All');
 

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingNotes, setMeetingNotes] = useState('');

  const interventions = [
    {
      id: 1,
      subject: 'Earth and Life Science',
      priority: 'Medium Priority',
      status: 'Critical',
      description: "Student's science performance has dropped to 68%, showing difficulty with recent life and earth concepts. Missing 3 assignments and attendance at 20%. Requires immediate teacher consultation and personalized tutoring.",
      currentGrade: '69%',
      previousGrade: '76%',
      missingWork: 3,
      teacher: 'Ms. Salcedo',
      actionPlan: ['Monitor Daily Attendance', 'Book a Office School Tutor/Program']
    },
    {
      id: 2,
      subject: 'Statistics and Probably',
      priority: 'Medium Priority',
      status: 'In Progress',
      description: 'Irregular attendance in Mathematics (85%) affecting comprehension of sequences topics. Grade currently at 72%, showing slow decline. Early intervention recommended to prevent further issues.',
      currentGrade: '72%',
      previousGrade: '85%',
      missingWork: 2,
      teacher: 'Mr. Math',
      actionPlan: ['Monitor Daily Attendance', 'Book a Office School Tutor/Program']
    },
    {
      id: 3,
      subject: 'Oral Communication',
      priority: 'Low Priority',
      status: 'Completed',
      description: 'Irregular attendance in Mathematics (85%) affecting comprehension of sequences topics. Grade currently at 72%, showing slow decline. Early intervention recommended to prevent further issues.',
      currentGrade: '72%',
      previousGrade: '85%',
      missingWork: 2,
      teacher: 'Mr. Math',
      actionPlan: ['Monitor Daily Attendance', 'Book a Office School Tutor/Program']
    }
  ];

  const teachers = ['Ms. Salcedo', 'Mr. Math', 'Ms. Johnson', 'Mr. Smith'];

  const filteredInterventions = activeFilter === 'All' 
    ? interventions 
    : interventions.filter(i => i.status === activeFilter);

  const toggleTeacherSelection = (teacher) => {
    setSelectedTeachers(prev => 
      prev.includes(teacher) 
        ? prev.filter(t => t !== teacher)
        : [...prev, teacher]
    );
  };

  const handleScheduleMeeting = () => {
    if (selectedTeachers.length === 0) {
      Alert.alert('Error', 'Please select at least one teacher');
      return;
    }
    if (!meetingDate || !meetingTime) {
      Alert.alert('Error', 'Please fill in date and time');
      return;
    }

    Alert.alert(
      'Meeting Scheduled',
      `Meeting scheduled with ${selectedTeachers.join(', ')} on ${meetingDate} at ${meetingTime}`,
      [{ text: 'OK', onPress: () => {
        setShowScheduleModal(false);
        setSelectedTeachers([]);
        setMeetingDate('');
        setMeetingTime('');
        setMeetingNotes('');
      }}]
    );
  };

  const handleEmailTeachers = () => {
    if (selectedTeachers.length === 0) {
      Alert.alert('Error', 'Please select at least one teacher');
      return;
    }

    Alert.alert(
      'Email Sent',
      `Email sent to ${selectedTeachers.join(', ')} regarding student interventions`,
      [{ text: 'OK', onPress: () => {
        setShowEmailModal(false);
        setSelectedTeachers([]);
      }}]
    );
  };

  const getPriorityColor = (priority) => {
    if (priority.includes('Medium')) return '#FF9800';
    if (priority.includes('Low')) return '#4CAF50';
    return '#F44336';
  };

  const getStatusColor = (status) => {
    if (status === 'Critical') return '#F44336';
    if (status === 'In Progress') return '#FF9800';
    return '#4CAF50';
  };

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
        <TextInput 
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#999"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <Text style={styles.title}>Intervention & Feedback</Text>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          {['All', 'Critical', 'In Progress', 'Completed'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                activeFilter === filter && styles.filterTabActive
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Active{'\n'}Intervention</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Total{'\n'}Feedback</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>78%</Text>
            <Text style={styles.statLabel}>Success{'\n'}Rate</Text>
          </View>
        </View>

        {/* Intervention Cards */}
        {filteredInterventions.map((intervention) => (
          <View key={intervention.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{intervention.subject}</Text>
              <View style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(intervention.priority) }
              ]}>
                <Text style={styles.priorityText}>{intervention.priority}</Text>
              </View>
            </View>

            <Text style={styles.cardDescription}>{intervention.description}</Text>

            <View style={styles.gradeContainer}>
              <View style={styles.gradeBox}>
                <Text style={styles.gradePercent}>{intervention.currentGrade}</Text>
                <Text style={styles.gradeLabel}>Current Grade</Text>
              </View>
              <View style={styles.gradeBox}>
                <Text style={styles.gradePercent}>{intervention.previousGrade}</Text>
                <Text style={styles.gradeLabel}>Previous Grade</Text>
              </View>
              <View style={styles.gradeBox}>
                <Text style={styles.gradePercent}>{intervention.missingWork}</Text>
                <Text style={styles.gradeLabel}>Missing Work</Text>
              </View>
            </View>

            

            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(intervention.status) }
            ]}>
              <Text style={styles.statusText}>{intervention.status}</Text>
            </View>
          </View>
           
        ))}

        {/* Quick Actions */}
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.emailButton]}
            onPress={() => setShowEmailModal(true)}
          >
            <Mail size={24} color="#FF6B9D" />
            <Text style={styles.actionButtonText}>Email All Teachers</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.scheduleButton]}
            onPress={() => setShowScheduleModal(true)}
          >
            <Calendar size={24} color="#4169E1" />
            <Text style={styles.actionButtonText}>Schedule Meeting</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Schedule Meeting Modal */}
      <Modal
        visible={showScheduleModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Meeting</Text>
              <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>Select Teachers:</Text>
              {teachers.map((teacher) => (
                <TouchableOpacity
                  key={teacher}
                  style={styles.teacherOption}
                  onPress={() => toggleTeacherSelection(teacher)}
                >
                  <View style={[
                    styles.checkbox,
                    selectedTeachers.includes(teacher) && styles.checkboxChecked
                  ]}>
                    {selectedTeachers.includes(teacher) && (
                      <Check size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.teacherName}>{teacher}</Text>
                </TouchableOpacity>
              ))}

              <Text style={styles.modalLabel}>Date:</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={meetingDate}
                onChangeText={setMeetingDate}
              />

              <Text style={styles.modalLabel}>Time:</Text>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={meetingTime}
                onChangeText={setMeetingTime}
              />

              <Text style={styles.modalLabel}>Notes:</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Meeting agenda..."
                value={meetingNotes}
                onChangeText={setMeetingNotes}
                multiline
              />

              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleScheduleMeeting}
              >
                <Text style={styles.submitButtonText}>Schedule Meeting</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Email Modal */}
      <Modal
        visible={showEmailModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Email Teachers</Text>
              <TouchableOpacity onPress={() => setShowEmailModal(false)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>Select Teachers:</Text>
              {teachers.map((teacher) => (
                <TouchableOpacity
                  key={teacher}
                  style={styles.teacherOption}
                  onPress={() => toggleTeacherSelection(teacher)}
                >
                  <View style={[
                    styles.checkbox,
                    selectedTeachers.includes(teacher) && styles.checkboxChecked
                  ]}>
                    {selectedTeachers.includes(teacher) && (
                      <Check size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.teacherName}>{teacher}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleEmailTeachers}
              >
                <Text style={styles.submitButtonText}>Send Email</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </ScrollView>
    
        </SafeAreaView>
 
   
    
    
  );
};

const styles = StyleSheet.create({
  safe: {
  flex: 1,
  backgroundColor: '#fff7fb', // Same pink background
},
mainMenuWrapper: {
  paddingHorizontal: 8,
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
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 20,
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flex: 1,
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingVertical: 20,
    marginBottom: 16,
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
    width: '100%',
   
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  filterTabActive: {
    backgroundColor: '#FFB6C1',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  gradeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    
  },
  gradeBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  gradePercent: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gradeLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  actionPlanTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF6B9D',
    borderColor: '#FF6B9D',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 16,
  },
  quickActions: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  emailButton: {
    borderWidth: 2,
    borderColor: '#FF6B9D',
  },
  scheduleButton: {
    borderWidth: 2,
    borderColor: '#4169E1',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  teacherOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 8,
  },
  teacherName: {
    fontSize: 14,
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 40,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '80%',
    backgroundColor: '#f3f4f6',
    paddingTop: 60,
    paddingHorizontal: 16,
    elevation: 12,
    zIndex: 50,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  drawerItem: {
    paddingVertical: 12,
  },
  drawerItemText: {
    fontSize: 16,
  },
});

export default Intervention;