const translations: Record<string, Record<string, { en: string; ar: string }>> = {
  sidebar: {
    dashboard: { en: 'Dashboard', ar: 'لوحة التحكم' },
    projects: { en: 'Projects', ar: 'المشاريع' },
    team: { en: 'Team', ar: 'الفريق' },
    messages: { en: 'Messages', ar: 'الرسائل' },
    back: { en: 'Back to Site', ar: 'العودة للموقع' },
    logout: { en: 'Logout', ar: 'تسجيل الخروج' },
    panel: { en: 'Admin Panel', ar: 'لوحة الإدارة' },
    studio: { en: 'B-20 Studio', ar: 'ب-20' },
    register: { en: 'Add Admin', ar: 'إضافة مشرف' },
  },
  dashboard: {
    title: { en: 'Dashboard', ar: 'لوحة التحكم' },
    subtitle: { en: 'Overview of your B-20 Studio site', ar: 'نظرة عامة على موقع ب-20' },
    totalProjects: { en: 'Total Projects', ar: 'إجمالي المشاريع' },
    teamMembers: { en: 'Team Members', ar: 'أعضاء الفريق' },
    messages: { en: 'Messages', ar: 'الرسائل' },
    siteVisits: { en: 'Site Visits', ar: 'زيارات الموقع' },
    recentActivity: { en: 'Recent Activity', ar: 'آخر النشاطات' },
    recentActivityDesc: { en: 'No recent activity to display. Start managing your content from the sidebar.', ar: 'لا توجد نشاطات حديثة. ابدأ بإدارة المحتوى من القائمة الجانبية.' },
    quickActions: { en: 'Quick Actions', ar: 'إجراءات سريعة' },
    quickActionsDesc: { en: 'Use the sidebar to manage Projects, Team members, and Messages.', ar: 'استخدم القائمة الجانبية لإدارة المشاريع وأعضاء الفريق والرسائل.' },
  },
  projects: {
    title: { en: 'Projects', ar: 'المشاريع' },
    subtitle: { en: 'Manage your portfolio projects', ar: 'إدارة مشاريع المحفظة' },
    add: { en: 'Add Project', ar: 'إضافة مشروع' },
    edit: { en: 'Edit Project', ar: 'تعديل المشروع' },
    create: { en: 'Add Project', ar: 'إضافة مشروع' },
    editTitle: { en: 'Edit Project', ar: 'تعديل المشروع' },
    addTitle: { en: 'Add Project', ar: 'إضافة مشروع' },
    editDesc: { en: 'Update the project details below.', ar: 'قم بتحديث تفاصيل المشروع أدناه.' },
    addDesc: { en: 'Fill in the details for the new project.', ar: 'أدخل تفاصيل المشروع الجديد.' },
    titleLabel: { en: 'Title', ar: 'العنوان' },
    titlePlaceholder: { en: 'Project title', ar: 'عنوان المشروع' },
    descriptionLabel: { en: 'Description', ar: 'الوصف' },
    descriptionPlaceholder: { en: 'Project description', ar: 'وصف المشروع' },
    tagsLabel: { en: 'Tags (comma separated)', ar: 'الوسوم (مفصولة بفاصلة)' },
    tagsPlaceholder: { en: 'React, Node.js, TypeScript', ar: 'React, Node.js, TypeScript' },
    imageLabel: { en: 'Image URL (optional)', ar: 'رابط الصورة (اختياري)' },
    imagePlaceholder: { en: 'https://example.com/image.jpg', ar: 'https://example.com/image.jpg' },
    cancel: { en: 'Cancel', ar: 'إلغاء' },
    update: { en: 'Update', ar: 'تحديث' },
    createBtn: { en: 'Create', ar: 'إنشاء' },
    deleteConfirm: { en: 'Delete this project?', ar: 'حذف هذا المشروع؟' },
    tableTitle: { en: 'Title', ar: 'العنوان' },
    tableDesc: { en: 'Description', ar: 'الوصف' },
    tableTags: { en: 'Tags', ar: 'الوسوم' },
    tableActions: { en: 'Actions', ar: 'الإجراءات' },
  },
  team: {
    title: { en: 'Team', ar: 'الفريق' },
    subtitle: { en: 'Manage your team members', ar: 'إدارة أعضاء الفريق' },
    add: { en: 'Add Member', ar: 'إضافة عضو' },
    edit: { en: 'Edit Member', ar: 'تعديل العضو' },
    addMember: { en: 'Add Member', ar: 'إضافة عضو' },
    editTitle: { en: 'Edit Member', ar: 'تعديل العضو' },
    addTitle: { en: 'Add Member', ar: 'إضافة عضو' },
    editDesc: { en: 'Update the team member details.', ar: 'قم بتحديث بيانات العضو.' },
    addDesc: { en: 'Add a new team member.', ar: 'أضف عضو فريق جديد.' },
    nameLabel: { en: 'Name', ar: 'الاسم' },
    namePlaceholder: { en: 'Full name', ar: 'الاسم الكامل' },
    roleLabel: { en: 'Role', ar: 'الدور' },
    rolePlaceholder: { en: 'e.g. Lead Developer', ar: 'مثال: مطور رئيسي' },
    avatarLabel: { en: 'Avatar URL (optional)', ar: 'رابط الصورة (اختياري)' },
    avatarPlaceholder: { en: 'https://example.com/avatar.jpg', ar: 'https://example.com/avatar.jpg' },
    cancel: { en: 'Cancel', ar: 'إلغاء' },
    update: { en: 'Update', ar: 'تحديث' },
    addBtn: { en: 'Add', ar: 'إضافة' },
    deleteConfirm: { en: 'Delete this member?', ar: 'حذف هذا العضو؟' },
    tableName: { en: 'Name', ar: 'الاسم' },
    tableRole: { en: 'Role', ar: 'الدور' },
    tableActions: { en: 'Actions', ar: 'الإجراءات' },
  },
  messages: {
    title: { en: 'Messages', ar: 'الرسائل' },
    subtitle: { en: 'Contact form submissions ({unread} unread)', ar: 'رسائل التواصل ({unread} غير مقروءة)' },
    read: { en: 'Read', ar: 'مقروءة' },
    new: { en: 'New', ar: 'جديد' },
    close: { en: 'Close', ar: 'إغلاق' },
    from: { en: 'From', ar: 'من' },
    deleteConfirm: { en: 'Delete this message?', ar: 'حذف هذه الرسالة؟' },
    tableFrom: { en: 'From', ar: 'من' },
    tableSubject: { en: 'Subject', ar: 'الموضوع' },
    tableDate: { en: 'Date', ar: 'التاريخ' },
    tableStatus: { en: 'Status', ar: 'الحالة' },
    tableActions: { en: 'Actions', ar: 'الإجراءات' },
  },
  login: {
    title: { en: 'Admin Login', ar: 'تسجيل دخول المشرف' },
    subtitle: { en: 'B-20 Studio Dashboard', ar: 'لوحة تحكم ب-20' },
    username: { en: 'Username', ar: 'اسم المستخدم' },
    usernamePlaceholder: { en: 'Enter username', ar: 'أدخل اسم المستخدم' },
    password: { en: 'Password', ar: 'كلمة المرور' },
    passwordPlaceholder: { en: 'Enter password', ar: 'أدخل كلمة المرور' },
    signIn: { en: 'Sign In', ar: 'تسجيل الدخول' },
    noAccount: { en: "No account?", ar: 'ليس لديك حساب؟' },
    register: { en: 'Register', ar: 'سجل الآن' },
    error: { en: 'Please fill in all fields', ar: 'يرجى ملء جميع الحقول' },
    errorCredentials: { en: 'Invalid credentials', ar: 'بيانات الدخول غير صحيحة' },
  },
  register: {
    title: { en: 'Register Admin', ar: 'تسجيل مشرف جديد' },
    subtitle: { en: 'Create a new admin account', ar: 'إنشاء حساب مشرف جديد' },
    username: { en: 'Username', ar: 'اسم المستخدم' },
    usernamePlaceholder: { en: 'Choose a username', ar: 'اختر اسم مستخدم' },
    password: { en: 'Password', ar: 'كلمة المرور' },
    passwordPlaceholder: { en: 'Min 6 characters', ar: '6 أحرف على الأقل' },
    confirm: { en: 'Confirm Password', ar: 'تأكيد كلمة المرور' },
    confirmPlaceholder: { en: 'Repeat password', ar: 'أعد إدخال كلمة المرور' },
    create: { en: 'Create Account', ar: 'إنشاء الحساب' },
    hasAccount: { en: 'Already have an account?', ar: 'لديك حساب بالفعل؟' },
    signIn: { en: 'Sign in', ar: 'تسجيل الدخول' },
    success: { en: 'Account created successfully!', ar: 'تم إنشاء الحساب بنجاح!' },
    redirect: { en: 'Redirecting to login...', ar: 'جاري التحويل إلى تسجيل الدخول...' },
    errorRequired: { en: 'Please fill in all fields', ar: 'يرجى ملء جميع الحقول' },
    errorLength: { en: 'Password must be at least 6 characters', ar: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
    errorMatch: { en: 'Passwords do not match', ar: 'كلمات المرور غير متطابقة' },
    errorExists: { en: 'Username already exists', ar: 'اسم المستخدم موجود بالفعل' },
  },
};

export function getAdminLang(): 'en' | 'ar' {
  try {
    const lang = localStorage.getItem('admin_lang');
    if (lang === 'ar' || lang === 'en') return lang;
  } catch {}
  return document.dir === 'rtl' ? 'ar' : 'en';
}

export function setAdminLang(lang: 'en' | 'ar') {
  localStorage.setItem('admin_lang', lang);
}

export function adminT(key: string, vars?: Record<string, string | number>): string {
  const [group, field] = key.split('.');
  const entry = translations[group]?.[field];
  if (!entry) return key;
  const lang = getAdminLang();
  let text = entry[lang];
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, String(v));
    });
  }
  return text;
}

export function isRTL(): boolean {
  return getAdminLang() === 'ar';
}
