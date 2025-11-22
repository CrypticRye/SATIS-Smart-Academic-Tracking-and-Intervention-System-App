import React, { useMemo, useState } from 'react';
import Mainmenu from '../mainMenu.jsx';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AttendanceDashboard() {
  // Geting today's actual date to
  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState(todayMonth);
  const [currentYear, setCurrentYear] = useState(todayYear);
  const [showPercentage, setShowPercentage] = useState(true);

  // Sample events data PWEDE lang mag add aslong as sundan format
  const events = {
    // Format: YYYY-M-D
    [`${currentYear}-${currentMonth}-21`]: [
      { type: 'assignment', title: 'Earth and life Assignment Due', status: 'pending' },
      { type: 'exam', title: 'Machine Learning Quiz', status: 'pending' },
    ],
    [`${currentYear}-${currentMonth}-25`]: [
      { type: 'project', title: 'Software Engineering Presentation', status: 'pending' },
    ],
    [`${currentYear}-${currentMonth}-15`]: [
      { type: 'assignment', title: 'English Submitted', status: 'completed' },
    ],
  };

  // Get events for selected date on calendar
  const selectedEvents = events[`${currentYear}-${currentMonth}-${selectedDate}`] || [];

  // Subject data with both percentage and fraction tas ung colors is for progress bar
  const subjects = [
    {
      name: 'Earth and Life Science',
      percentage: 78,
      attended: 7,
      total: 9,
      color: '#fb7185', 
      status: 'Late',
    },
    {
      name: 'Statistics & Probability',
      percentage: 85,
      attended: 8,
      total: 9,
      color: '#7c3aed', 
      status: 'Absent',
    },
    {
      name: 'Oral Communication',
      percentage: 86,
      attended: 8,
      total: 9,
      color: '#3b82f6', 
      status: 'Present',
    },
  ];

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [currentMonth, currentYear]);

  const changeMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((y) => y - 1);
      } else {
        setCurrentMonth((m) => m - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((y) => y + 1);
      } else {
        setCurrentMonth((m) => m + 1);
      }
    }
  };

  // layout sizing
  const calendarCellSize = Math.floor((SCREEN_WIDTH - 40 - 6 * 8) / 7); // padding at gaps

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

        {/* Attendance Overview modal */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>📅 Attendance Overview</Text>
          </View>

          <View style={styles.grid2}>
            <View style={[styles.smallCard, { backgroundColor: '#fff7ed' }]}>
              <View style={styles.smallCardHeader}>
                <View style={[styles.iconBox, { backgroundColor: '#fb923c' }]}>
                  <Text style={styles.iconText}>📈</Text>
                </View>
                <Text style={styles.deltaText}> +6%</Text>
              </View>
              <Text style={styles.bigNumber}>85%</Text>
              <Text style={styles.smallMuted}>Overall Attendance</Text>
            </View>

            <View style={[styles.smallCard, { backgroundColor: '#eff6ff' }]}>
              <View style={[styles.iconBox, { backgroundColor: '#60a5fa', marginBottom: 8 }]}>
                <Text style={styles.iconText}>📅</Text>
              </View>
              <Text style={styles.bigNumber}>170</Text>
              <Text style={styles.smallMuted}>Days Present</Text>
              <Text style={styles.smallMutedExtra}>Out of 200 days</Text>
            </View>
          </View>

          <View style={styles.grid2}>
            <View style={[styles.smallCard, { backgroundColor: '#fff1f2' }]}>
              <View style={styles.smallCardHeader}>
                <View style={[styles.iconBox, { backgroundColor: '#f87171' }]}>
                  <Text style={styles.iconText}>❌</Text>
                </View>
                <Text style={[styles.deltaText, { color: '#dc2626' }]}> -2 days</Text>
              </View>
              <Text style={styles.bigNumber}>30</Text>
              <Text style={styles.smallMuted}>Days Absent</Text>
            </View>

            <View style={[styles.smallCard, { backgroundColor: '#faf5ff' }]}>
              <View style={[styles.iconBox, { backgroundColor: '#a78bfa' }]}>
                <Text style={styles.iconText}>⏰</Text>
              </View>
              <Text style={styles.bigNumber}>15</Text>
              <Text style={styles.smallMuted}>Tardiness</Text>
            </View>
          </View>
        </View>

        {/* Calendar modal */}
        <View style={styles.card}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>{monthNames[currentMonth]} {currentYear}</Text>
            <View style={styles.monthBtns}>
              <TouchableOpacity onPress={() => changeMonth('prev')} style={styles.monthButton}>
                <Text style={styles.monthButtonText}>‹</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => changeMonth('next')} style={styles.monthButton}>
                <Text style={styles.monthButtonText}>›</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.weekRow}>
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
              <View key={d} style={[styles.weekDayCell, { width: calendarCellSize }]}>
                <Text style={styles.weekDayText}>{d}</Text>
              </View>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarDays.map((day, idx) => {
              const isSelected = day === selectedDate;
              const isToday = day === todayDate && currentMonth === todayMonth && currentYear === todayYear;
              const hasEvents = day && events[`${currentYear}-${currentMonth}-${day}`];
              
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => day && setSelectedDate(day)}
                  style={[
                    styles.calendarCell,
                    { width: calendarCellSize, height: calendarCellSize },
                    !day ? styles.calendarCellEmpty : null,
                    isSelected ? styles.calendarCellSelected : null,
                    isToday && !isSelected ? styles.calendarCellToday : null,
                  ]}
                  activeOpacity={day ? 0.7 : 1}
                >
                  <Text style={[
                    styles.calendarCellText, 
                    isSelected ? styles.calendarCellTextSelected : null,
                    isToday && !isSelected ? styles.calendarCellTextToday : null
                  ]}>
                    {day || ''}
                  </Text>
                  {hasEvents && (
                    <View style={styles.eventDot} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Date Events modal */}
        {selectedEvents.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle}>
                📌 Events on {monthNames[currentMonth]} {selectedDate}, {currentYear}
              </Text>
            </View>

            <View>
              {selectedEvents.map((event, idx) => {
                const isCompleted = event.status === 'completed';
                const eventIcon = 
                  event.type === 'assignment' ? '📝' :
                  event.type === 'exam' ? '📋' :
                  event.type === 'project' ? '🎯' : '📅';
                
                return (
                  <View key={idx} style={[styles.eventCard, isCompleted && styles.eventCardCompleted]}>
                    <Text style={styles.eventIcon}>{eventIcon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.eventTitle, isCompleted && styles.eventTitleCompleted]}>
                        {event.title}
                      </Text>
                      <Text style={styles.eventType}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, isCompleted ? styles.statusCompleted : styles.statusPending]}>
                      <Text style={[styles.statusText, isCompleted && styles.statusTextCompleted]}>
                        {isCompleted ? 'Done' : 'Pending'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Subject Attendance modal */}
        <View style={styles.card}>
          <View style={styles.subjectHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.subjectIconBox}><Text>📚</Text></View>
              <Text style={styles.subjectTitle}>Subject Attendance</Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowPercentage((s) => !s)}
              style={[styles.toggleTrack, showPercentage ? styles.toggleOn : styles.toggleOff]}
              activeOpacity={0.8}
            >
              <View style={[styles.toggleKnob, showPercentage ? styles.toggleKnobOn : styles.toggleKnobOff]} />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 6 }}>
            {subjects.map((subject, i) => {
              const absences = subject.total - subject.attended;
              return (
                <View key={i} style={{ marginBottom: 16 }}>
                  <View style={styles.subjectRow}>
                    <Text style={styles.subjectName}>{subject.name}</Text>
                    <Text style={styles.subjectStat}>
                      {showPercentage ? `${subject.percentage}%` : `${subject.attended}/${subject.total}`}
                    </Text>
                  </View>

                  <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${subject.percentage}%`, backgroundColor: subject.color }]} />
                  </View>

                  <Text style={styles.absencesText}>Absences: {absences}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent Activity modal */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>⏰ Recent Activity</Text>
          </View>

          <View>
            {subjects.map((subject, idx) => {
              const status = subject.status;
              const bg =
                status === 'Present' ? '#ecfdf5' :
                status === 'Absent' ? '#fee2e2' :
                '#fff7ed';
              const icon =
                status === 'Present' ? '✅' :
                status === 'Absent' ? '❌' : '⏰';
              const color =
                status === 'Present' ? '#16a34a' :
                status === 'Absent' ? '#dc2626' :
                '#f97316';

              return (
                <View key={idx} style={[styles.activityRow, { backgroundColor: '#fafafa' }]}>
                  <View style={[styles.statusCircle, { backgroundColor: bg }]}>
                    <Text style={{ fontSize: 18 }}>{icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.activityName}>{subject.name}</Text>
                    <Text style={[styles.activityStatus, { color }]}>{status}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: 40 }} />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  avatarLeft: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  notificationDot: {
    width: 8,
    height: 8,
    backgroundColor: '#ef4444',
    borderRadius: 4,
    position: 'absolute',
    right: -2,
    top: -2,
  },
  bellEmoji: { fontSize: 16 },
  avatarRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#c084fc',
  },

  /* Dito ung Cards */
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 14,
    marginBottom: 12,
    // subtle shadow (Android)
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  /* overview grid dito */
  grid2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  smallCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    marginRight: 8,
  },
  smallCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 18, color: '#fff' },
  deltaText: { fontSize: 12, color: '#16a34a', fontWeight: '600' },
  bigNumber: { fontSize: 28, fontWeight: '800', marginTop: 6 },
  smallMuted: { fontSize: 13, color: '#6b7280' },
  smallMutedExtra: { fontSize: 11, color: '#9ca3af' },

  /* calendar dito */
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarTitle: { fontSize: 16, fontWeight: '700', color: '#db2777' },
  monthBtns: { flexDirection: 'row' },
  monthButton: {
    width: 36,
    height: 36,
    backgroundColor: '#fff0f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginLeft: 8,
  },
  monthButtonText: { fontSize: 18 },

  weekRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekDayCell: { alignItems: 'center' },
  weekDayText: { fontSize: 12, color: '#6b7280' },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  calendarCell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 8,
  },
  calendarCellEmpty: {
    opacity: 0,
  },
  calendarCellSelected: {
    backgroundColor: '#fb923c',
    shadowColor: '#fb923c',
    shadowRadius: 6,
    elevation: 3,
  },
  calendarCellText: { fontSize: 13, color: '#374151' },
  calendarCellTextSelected: { color: '#fff', fontWeight: '700' },
  calendarCellToday: {
    borderWidth: 2,
    borderColor: '#fb923c',
  },
  calendarCellTextToday: {
    color: '#fb923c',
    fontWeight: '700',
  },
  eventDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fb923c',
  },

  /* events dito */
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#fb923c',
  },
  eventCardCompleted: {
    opacity: 0.7,
    borderLeftColor: '#10b981',
  },
  eventIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  eventTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  eventType: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#fff7ed',
  },
  statusCompleted: {
    backgroundColor: '#d1fae5',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f97316',
  },
  statusTextCompleted: {
    color: '#10b981',
  },

  /* subjects dito */
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#fff0f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  subjectTitle: { fontSize: 16, fontWeight: '700' },

  toggleTrack: {
    width: 48,
    height: 26,
    borderRadius: 20,
    padding: 3,
    justifyContent: 'center',
  },
  toggleOn: { backgroundColor: '#fb7185' },
  toggleOff: { backgroundColor: '#e5e7eb' },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
  },
  toggleKnobOn: { alignSelf: 'flex-end' },
  toggleKnobOff: { alignSelf: 'flex-start' },

  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectName: { fontSize: 14, fontWeight: '600', color: '#374151' },
  subjectStat: { fontSize: 13, fontWeight: '700' },

  progressBg: {
    height: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: 10,
    borderRadius: 8,
  },
  absencesText: { fontSize: 12, color: '#6b7280', marginTop: 6 },

  /* recent activity dito */
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityName: { fontSize: 13, fontWeight: '700', color: '#111827' },
  activityStatus: { fontSize: 12, fontWeight: '700' },
});