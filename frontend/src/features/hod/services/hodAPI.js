import { projectsApi } from '@/services/api';
import { apiClient } from '@/shared/lib/http/axios';

const DASHBOARD_WINDOW_DAYS = 30;

const notImplemented = () => {
  throw new Error('This HOD API endpoint is not implemented yet.');
};

const normalizeArray = (payload) => (
  Array.isArray(payload) ? payload : Array.isArray(payload?.results) ? payload.results : []
);

const toDate = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const formatShortDate = (value) => {
  const date = toDate(value);
  return date
    ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A';
};

const formatRelativeTime = (value) => {
  const date = toDate(value);
  if (!date) return 'Just now';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatShortDate(date);
};

const capitalize = (value) => {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'Pending';
};

const getTeacherName = (item) => (
  item?.created_by_name
  || item?.author_name
  || item?.uploaded_by_email
  || item?.created_by_email
  || 'Unknown Teacher'
);

const isWithinDays = (value, days) => {
  const date = toDate(value);
  if (!date) return false;

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return date >= cutoff;
};

const getPercentChange = (current, previous) => {
  if (!previous) {
    return current > 0 ? 100 : 0;
  }

  return Math.round(((current - previous) / previous) * 100);
};

const buildTrend = (current, previous) => ({
  direction: current >= previous ? 'up' : 'down',
  change: Math.abs(getPercentChange(current, previous)),
});

const summarizeTeacherActivity = (notes, materials) => {
  const noteItems = notes.map((note) => ({
    id: `note-${note.id}`,
    teacher: getTeacherName(note),
    action: `${note.title || 'Untitled note'}${note.subject_name ? ` in ${note.subject_name}` : ''}`,
    type: note.is_published ? 'update' : 'upload',
    timestamp: note.updated_at || note.created_at,
  }));

  const materialItems = materials.map((material) => ({
    id: `material-${material.id}`,
    teacher: getTeacherName(material),
    action: `${material.title || 'Untitled material'} submitted as ${capitalize(material.status)}`,
    type: material.status === 'published' ? 'update' : 'upload',
    timestamp: material.updated_at || material.created_at,
  }));

  return [...noteItems, ...materialItems]
    .filter((item) => toDate(item.timestamp))
    .sort((a, b) => toDate(b.timestamp) - toDate(a.timestamp))
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      teacher: item.teacher,
      action: item.action,
      type: item.type,
      time: formatRelativeTime(item.timestamp),
    }));
};

const summarizeCourseSubmissions = (notes, materials) => (
  [...materials, ...notes]
    .filter((item) => toDate(item.updated_at || item.created_at))
    .sort((a, b) => toDate(b.updated_at || b.created_at) - toDate(a.updated_at || a.created_at))
    .slice(0, 6)
    .map((item, index) => ({
      id: item.id || `submission-${index}`,
      title: item.title || 'Untitled',
      teacher: getTeacherName(item),
      date: formatShortDate(item.updated_at || item.created_at),
      status: capitalize(item.status || (item.is_published ? 'approved' : 'pending')),
    }))
);

const buildDepartmentAlerts = ({ recentTeacherActivity, materials, projects, totalTeachers, activeTeachers }) => {
  const draftMaterials = materials.filter((item) => capitalize(item.status) === 'Draft').length;
  const publishedMaterials = materials.filter((item) => capitalize(item.status) === 'Published').length;
  const pendingProjects = projects.filter((item) => capitalize(item.status) === 'Pending').length;
  const approvedProjects = projects.filter((item) => capitalize(item.status) === 'Approved').length;
  const inactiveTeachers = Math.max(totalTeachers - activeTeachers, 0);

  const alerts = [];

  if (pendingProjects > 0) {
    alerts.push({
      id: 'pending-projects',
      severity: 'warning',
      message: `${pendingProjects} student project${pendingProjects > 1 ? 's are' : ' is'} waiting for review.`,
      time: 'Needs attention',
    });
  }

  if (draftMaterials > 0) {
    alerts.push({
      id: 'draft-materials',
      severity: 'info',
      message: `${draftMaterials} course material${draftMaterials > 1 ? 's remain' : ' remains'} in draft state.`,
      time: 'Latest sync',
    });
  }

  if (approvedProjects > 0 || publishedMaterials > 0) {
    alerts.push({
      id: 'published-progress',
      severity: 'success',
      message: `${approvedProjects} project${approvedProjects !== 1 ? 's' : ''} approved and ${publishedMaterials} material${publishedMaterials !== 1 ? 's are' : ' is'} published.`,
      time: 'From database records',
    });
  }

  if (!recentTeacherActivity.length || inactiveTeachers > 0) {
    alerts.push({
      id: 'teacher-activity',
      severity: !recentTeacherActivity.length ? 'error' : 'warning',
      message: !recentTeacherActivity.length
        ? 'No recent teacher activity was found in the connected database.'
        : `${inactiveTeachers} teacher${inactiveTeachers > 1 ? 's have' : ' has'} no activity in the last ${DASHBOARD_WINDOW_DAYS} days.`,
      time: `Last ${DASHBOARD_WINDOW_DAYS} days`,
    });
  }

  return alerts.slice(0, 4);
};

export const hodAPI = {
  getDashboard: async () => {
    const [notesResult, myMaterialsResult, libraryMaterialsResult, projectsResult] = await Promise.allSettled([
      apiClient.get('/api/notes/'),
      apiClient.get('/api/materials/'),
      apiClient.get('/api/materials/library/'),
      projectsApi.all(),
    ]);

    const notes = notesResult.status === 'fulfilled' ? normalizeArray(notesResult.value.data) : [];
    const ownMaterials = myMaterialsResult.status === 'fulfilled' ? normalizeArray(myMaterialsResult.value.data) : [];
    const libraryMaterials = libraryMaterialsResult.status === 'fulfilled'
      ? normalizeArray(libraryMaterialsResult.value.data)
      : [];
    const projects = projectsResult.status === 'fulfilled' ? normalizeArray(projectsResult.value.data) : [];

    const materials = [...ownMaterials, ...libraryMaterials].filter((item, index, collection) => (
      collection.findIndex((entry) => entry.id === item.id) === index
    ));

    const teacherKeys = new Set();
    [...notes, ...materials].forEach((item) => {
      const teacherName = getTeacherName(item);
      if (teacherName && teacherName !== 'Unknown Teacher') {
        teacherKeys.add(teacherName.toLowerCase());
      }
    });

    const activeTeacherKeys = new Set();
    [...notes, ...materials].forEach((item) => {
      if (isWithinDays(item.updated_at || item.created_at, DASHBOARD_WINDOW_DAYS)) {
        const teacherName = getTeacherName(item);
        if (teacherName && teacherName !== 'Unknown Teacher') {
          activeTeacherKeys.add(teacherName.toLowerCase());
        }
      }
    });

    const allSubjects = new Set(
      notes
        .map((note) => (note.subject_name || note.subject_code || '').trim())
        .filter(Boolean)
        .map((subject) => subject.toLowerCase())
    );

    const thisMonthMaterials = [...notes, ...materials].filter((item) => isWithinDays(item.created_at, 30)).length;
    const previousMonthMaterials = [...notes, ...materials].filter((item) => {
      const date = toDate(item.created_at);
      if (!date) return false;

      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);
      const sixtyDaysAgo = new Date(now);
      sixtyDaysAgo.setDate(now.getDate() - 60);

      return date >= sixtyDaysAgo && date < thirtyDaysAgo;
    }).length;

    const totalTeachers = teacherKeys.size;
    const activeTeachers = activeTeacherKeys.size;
    const studentEngagementRate = totalTeachers > 0
      ? Math.round((activeTeachers / totalTeachers) * 100)
      : 0;

    const recentTeacherActivity = summarizeTeacherActivity(notes, materials);
    const recentCourseSubmissions = summarizeCourseSubmissions(notes, materials);
    const departmentAlerts = buildDepartmentAlerts({
      recentTeacherActivity,
      materials,
      projects,
      totalTeachers,
      activeTeachers,
    });

    return {
      data: {
        stats: {
          totalTeachers,
          activeCourses: allSubjects.size,
          uploadedMaterials: notes.length + materials.length,
          studentEngagementRate,
        },
        trends: {
          totalTeachers: buildTrend(activeTeachers, Math.max(totalTeachers - activeTeachers, 0)),
          activeCourses: buildTrend(allSubjects.size, Math.max(allSubjects.size - 1, 0)),
          uploadedMaterials: buildTrend(thisMonthMaterials, previousMonthMaterials),
          studentEngagementRate: buildTrend(studentEngagementRate, 50),
        },
        recentTeacherActivity,
        recentCourseSubmissions,
        departmentAlerts,
      },
    };
  },
  getPerformance: notImplemented,
  getTeacherContributions: notImplemented,
  getMaterialApprovals: async () => {
    try {
      const response = await apiClient.get('/api/materials/library/');
      const materials = normalizeArray(response.data);

      const approvals = materials.map((material) => ({
        id: material.id,
        title: material.title,
        teacher: material.author_name || material.uploaded_by_email || 'Unknown',
        course: 'Study Material',
        date: material.created_at ? new Date(material.created_at).toLocaleDateString() : 'N/A',
        status: capitalize(material.status),
        ...material,
      }));

      return {
        data: {
          approvals,
        }
      };
    } catch (error) {
      console.error('Failed to load saved materials:', error);
      return {
        data: {
          approvals: [],
        }
      };
    }
  },
  getStudentEngagement: notImplemented,
  getProjectApprovals: async () => {
    const response = await projectsApi.all();
    return {
      data: {
        approvals: normalizeArray(response.data).map((project) => ({
          ...project,
          student: project.student_name || project.student,
          date: formatShortDate(project.created_at),
          status: capitalize(project.status),
        })),
      }
    };
  },
  approveMaterial: notImplemented,
  rejectMaterial: notImplemented,
  requestMaterialRevision: notImplemented,
  approveProject: (id) => projectsApi.approve(id),
  rejectProject: (id) => projectsApi.reject(id),
  getAnalytics: notImplemented,
  getCourseApprovals: notImplemented,
  approveCourse: notImplemented,
  rejectCourse: notImplemented,
  requestRevision: notImplemented,
};
