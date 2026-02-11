# Hopita Web Admin - Tai lieu tinh nang

> He thong quan tri phuc hoi chuc nang thong minh cho bac si, KTV va admin benh vien.
> Dung chung voi Hopita Flutter App (danh cho benh nhan).

---

## Tong quan

- **Tech stack**: Next.js 15 (App Router) + TypeScript + shadcn/ui + Tailwind CSS + Recharts
- **Primary color**: Teal `#0D9488` (dong bo voi Flutter app)
- **Design system**: Spacing 4/8/12/16/20/24/32, Border radius sm=8 md=14 lg=16 xl=20
- **Font**: Geist (mac dinh Next.js)
- **API base URL**: `https://api.hopita.vn` (chua ket noi, dang dung mock data)

---

## Phan quyen (Roles)

| Role | Mo ta | Quyen truy cap |
|------|-------|----------------|
| `admin` | Quan tri he thong | Tat ca tinh nang + Admin section |
| `doctor` | Bac si | Dashboard, Benh nhan, Phac do, Metrics, Video, Telehealth, Bao cao |
| `ktv` | Ky thuat vien | Dashboard, Benh nhan (xem), Metrics, Video, Telehealth |

> Hien tai chua co middleware phan quyen. Can bo sung khi ket noi API.

---

## Cau truc thu muc

```
hopita-web/
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Auth pages (layout rieng, gradient background)
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (dashboard)/               # Main app (layout chung: sidebar + header)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx               # Dashboard
│   │   │   ├── patients/
│   │   │   │   ├── page.tsx           # Danh sach benh nhan
│   │   │   │   └── [id]/page.tsx      # Chi tiet benh nhan (5 tabs)
│   │   │   ├── protocols/
│   │   │   │   ├── page.tsx           # Danh sach phac do
│   │   │   │   └── [id]/page.tsx      # Chinh sua phac do
│   │   │   ├── metrics/page.tsx       # AI Metrics & Ket qua
│   │   │   ├── videos/page.tsx        # Video Review
│   │   │   ├── telehealth/page.tsx    # Lich hen & Video call
│   │   │   ├── notifications/page.tsx # Thong bao
│   │   │   ├── reports/page.tsx       # Bao cao & Xuat du lieu
│   │   │   └── admin/
│   │   │       ├── users/page.tsx     # Quan ly user & phan quyen
│   │   │       ├── tenants/page.tsx   # Quan ly co so / tenant
│   │   │       └── exercises/page.tsx # Danh muc bai tap
│   │   ├── layout.tsx                 # Root layout
│   │   └── globals.css                # Theme & CSS variables
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components (19 components)
│   │   └── layout/
│   │       ├── sidebar.tsx            # Sidebar navigation (collapsible)
│   │       └── header.tsx             # Header (search, notifications, user menu)
│   ├── lib/
│   │   ├── utils.ts                   # shadcn cn() utility
│   │   └── mock-data.ts              # Tat ca mock data
│   └── types/
│       └── index.ts                   # TypeScript types/interfaces
```

---

## Chi tiet tung tinh nang

### 1. Authentication (Xac thuc)

**Routes**: `/login`, `/register`, `/forgot-password`

| Tinh nang | Mo ta | Trang thai |
|-----------|-------|------------|
| Dang nhap | Email + password, ghi nho dang nhap, show/hide password | UI done, chua co API |
| Dang ky | Ho ten, email, SDT, mat khau, xac nhan mat khau, chon vai tro (Bac si/KTV) | UI done, chua co API |
| Quen mat khau | Nhap email, gui link reset, hien thi trang thai da gui | UI done, chua co API |

**Can lam them**:
- [ ] Ket noi API `/auth/login`, `/auth/register`, `/auth/forgot-password`
- [ ] Luu token vao cookie/localStorage
- [ ] Auth middleware (redirect chua dang nhap ve /login)
- [ ] Refresh token
- [ ] OAuth (Google, Apple) - tuy chon

---

### 2. Dashboard (Tong quan)

**Route**: `/`

| Thanh phan | Mo ta |
|------------|-------|
| 4 Stat Cards | Tong benh nhan (active/completed/attention), Lich hen sap toi, Ty le tuan thu %, Canh bao |
| Bieu do Compliance | Line chart ty le tuan thu theo tuan (Recharts) |
| Bieu do Tien trien | Bar chart so benh nhan tien trien/on dinh/giam theo thang |
| Bang Canh bao | Benh nhan bo tap / tap sai, link den chi tiet |
| Lich hen sap toi | 5 lich hen gan nhat voi avatar, thoi gian, loai (Online/Tai kham/Lan dau) |

**Can lam them**:
- [ ] Ket noi API dashboard stats
- [ ] Real-time update (WebSocket hoac polling)
- [ ] Filter theo khoang thoi gian
- [ ] Click stat card de xem chi tiet

---

### 3. Quan ly Benh nhan

**Routes**: `/patients`, `/patients/[id]`

#### 3a. Danh sach benh nhan (`/patients`)

| Tinh nang | Mo ta |
|-----------|-------|
| Tim kiem | Search theo ten benh nhan |
| Loc trang thai | Tat ca / Dang dieu tri / Hoan thanh / Can chu y |
| Bang du lieu | Ho ten (link), Chan doan, Phac do, Tuan thu (badge mau), Phien cuoi, Trang thai |
| Them benh nhan | Button "Them benh nhan" (chua co form) |

#### 3b. Chi tiet benh nhan (`/patients/[id]`) - 5 Tabs

| Tab | Noi dung |
|-----|----------|
| **Thong tin** | 2 cards: Thong tin ca nhan (ngay sinh, gioi tinh, SDT, email) + Thong tin dieu tri (chan doan, bac si, phac do, tuan thu) |
| **Lich su dieu tri** | Timeline vertical voi trang thai (active/completed/paused), thoi gian bat dau - ket thuc |
| **Phac do hien tai** | Ten phac do, mo ta, bang bai tap (ten, sets, reps, thoi gian, tan suat) |
| **Tien trien ROM** | 3 cards (ROM hien tai 95°, ROM ban dau 45°, Cai thien +50°) + Line chart ROM theo thoi gian voi baseline reference line |
| **Ghi chu** | Danh sach ghi chu (tac gia, ngay, noi dung) + Textarea them ghi chu moi |

**Can lam them**:
- [ ] API CRUD benh nhan
- [ ] Form them/sua benh nhan (Dialog)
- [ ] Vo hieu hoa benh nhan
- [ ] Pagination cho danh sach
- [ ] Upload anh dai dien
- [ ] ROM data theo benh nhan thuc te (hien dung chung 1 bo mock)

---

### 4. Quan ly Phac do

**Routes**: `/protocols`, `/protocols/[id]`

#### 4a. Danh sach phac do (`/protocols`)

| Tinh nang | Mo ta |
|-----------|-------|
| Tim kiem | Search theo ten phac do |
| Loc benh ly | Dropdown loc theo target condition |
| Grid cards | Ten, mo ta (truncate), badge benh ly, so bai tap, thoi gian (tuan), so benh nhan, badge Template |
| Tao moi | Button link den `/protocols/new` |

#### 4b. Chinh sua phac do (`/protocols/[id]`)

| Tinh nang | Mo ta |
|-----------|-------|
| Form thong tin | Ten, mo ta, tinh trang muc tieu, thoi gian (tuan), checkbox "Luu lam template" |
| Danh sach bai tap | Bang: #, ten, sets, reps, thoi gian, tan suat, nut xoa |
| Them bai tap | Dialog hien thi catalog bai tap, search, nut "Them" (disable neu da them) |
| Actions | Luu phac do, Gan cho benh nhan, Huy |

**Can lam them**:
- [ ] API CRUD phac do
- [ ] Drag & drop sap xep thu tu bai tap
- [ ] Inline edit sets/reps/duration/frequency trong bang
- [ ] Clone phac do tu template
- [ ] Gan phac do cho nhieu benh nhan (multi-select dialog)

---

### 5. AI Metrics & Ket qua

**Route**: `/metrics`

| Thanh phan | Mo ta |
|------------|-------|
| Patient selector | Dropdown chon benh nhan |
| Date filter | Tabs: Ngay / Tuan / Thang |
| 3 Stat cards | Reps hoan thanh, Do chinh xac %, Posture Score |
| ROM Chart | Line chart voi baseline reference line (Recharts) |
| 3 Comparison cards | ROM baseline vs hien tai, Compliance muc tieu vs thuc te, Posture truoc vs sau |

**Can lam them**:
- [ ] API ket qua AI tu Kemtai
- [ ] ROM data rieng tung benh nhan
- [ ] Export chart thanh hinh anh
- [ ] So sanh nhieu benh nhan

---

### 6. Video Review

**Route**: `/videos`

| Thanh phan | Mo ta |
|------------|-------|
| Bang video | Benh nhan, bai tap, ngay gui, trang thai (Cho review / Da review) |
| Video player | 2 khung: Video benh nhan + Video chuan (hien la placeholder) |
| Annotations | Danh sach ghi chu theo timestamp voi badge mau (error/improvement/good) |
| Feedback | Textarea + nut "Gui feedback" + nut "Danh dau da review" |

**Can lam them**:
- [ ] Tich hop video player thuc te (video.js hoac tuy chinh)
- [ ] Them annotation moi (chon timestamp, nhap note, chon type)
- [ ] So sanh video side-by-side dong bo thoi gian
- [ ] Skeleton analysis overlay tu Kemtai

---

### 7. Telehealth

**Route**: `/telehealth`

| Thanh phan | Mo ta |
|------------|-------|
| Lich tuan | Grid 7 cot (T2-CN), hien thi lich hen theo ngay, highlight hom nay |
| Tao lich hen | Dialog: chon benh nhan, ngay, gio, thoi luong, loai, ghi chu |
| Bang lich hen | Tat ca lich hen: benh nhan, ngay gio, thoi luong, loai, trang thai, nut "Tham gia" |
| Lich su cuoc goi | Danh sach cuoc goi da hoan thanh |

**Can lam them**:
- [ ] Tich hop video call (Twilio, Daily.co, hoac Jitsi)
- [ ] Sua / Huy lich hen
- [ ] Nhac nho truoc lich hen (push notification)
- [ ] Ghi chu noi dung tu van sau cuoc goi
- [ ] Calendar view thang (thay vi chi tuan)

---

### 8. Thong bao

**Route**: `/notifications`

| Thanh phan | Mo ta |
|------------|-------|
| Filter tabs | Tat ca / Chua doc (voi so luong) |
| Mark all read | Button "Danh dau tat ca da doc" |
| Notification cards | Icon theo loai (AlertTriangle/Calendar/Bell/Video), title, message, thoi gian tuong doi, badge benh nhan |
| Chua doc | Border-left primary + background nhat |
| Actions | Click de danh dau da doc, nut xoa tung thong bao |

**Loai thong bao**:
- `compliance_alert` - Benh nhan bo tap / tap sai
- `appointment` - Lich hen sap toi / bi huy
- `video_review` - Video can review
- `system` - Cap nhat he thong

**Can lam them**:
- [ ] API notifications (REST + WebSocket real-time)
- [ ] Push notification (Firebase Cloud Messaging)
- [ ] Click thong bao de navigate den trang lien quan
- [ ] Cai dat thong bao (bat/tat tung loai)

---

### 9. Bao cao & Xuat du lieu

**Route**: `/reports`

| Thanh phan | Mo ta |
|------------|-------|
| Summary stats | 4 cards: Tong BN, Dang dieu tri, Tuan thu TB, Hoan thanh |
| Loai bao cao | Tabs: Tien trien benh nhan / Tuan thu dieu tri |
| Date range | 2 input date: Tu ngay, Den ngay |
| Preview | Bang du lieu tuong ung voi loai bao cao |
| Export | 2 buttons: Xuat PDF, Xuat Excel |

**Can lam them**:
- [ ] Tich hop xuat PDF (jsPDF hoac react-pdf)
- [ ] Tich hop xuat Excel (xlsx hoac exceljs)
- [ ] Bao cao tuy chinh (chon cot, loc)
- [ ] Gui bao cao qua email
- [ ] Bao cao dinh ky (hang tuan/thang)

---

### 10. Quan tri he thong (Admin)

#### 10a. Quan ly User (`/admin/users`)

| Tinh nang | Mo ta |
|-----------|-------|
| Bang user | Ho ten, email, SDT, vai tro (badge), co so, ngay tao |
| Moi user | Dialog: ho ten, email, vai tro (Admin/Bac si/KTV), co so |
| Actions | Edit (icon), Disable (icon) |

#### 10b. Quan ly Co so / Tenant (`/admin/tenants`)

| Tinh nang | Mo ta |
|-----------|-------|
| Grid cards | Ten co so, dia chi, SDT, so bac si, so benh nhan |
| Them co so | Dialog: ten, dia chi, SDT |
| Actions | Edit (icon) |

#### 10c. Danh muc Bai tap (`/admin/exercises`)

| Tinh nang | Mo ta |
|-----------|-------|
| Bang bai tap | Ten, danh muc (badge), reps, sets/ngay, thoi gian, luu y an toan |
| Loc danh muc | Dropdown loc theo category |
| Tim kiem | Search theo ten bai tap |
| Them bai tap | Dialog: ten, mo ta, danh muc, reps, sets, thoi gian, video URL, luu y an toan |

**Can lam them**:
- [ ] API CRUD cho tat ca entities
- [ ] Upload video bai tap (S3/CloudFront)
- [ ] Multi-tenant: moi co so co data rieng
- [ ] Audit log (ai thay doi gi, khi nao)
- [ ] Phan quyen chi tiet (permission-based, khong chi role-based)

---

## Quy trinh dieu tri (6 giai doan)

Theo Hopita Overview diagram:

```
1. DANG KY          Benh nhan dang ky tai khoan
      ↓
2. LAP PHAC DO      Bac si danh gia → Tao phac do → Gan bai tap
      ↓
3. TAP LUYEN        Benh nhan tap theo lich → AI phan tich (Kemtai) → Ghi nhan ket qua
      ↓
4. TAI DANH GIA     Bac si xem metrics → Review video → Dieu chinh phac do
      ↓
5. TAI KHAM         Lich hen truc tiep hoac telehealth → Danh gia tien trien
      ↓
6. KET THUC         Hoan thanh dieu tri → Bao cao tong ket
```

**Actors**:
- **Benh nhan**: Dung Flutter app de tap luyen, xem lich, nhan thong bao
- **Bac si/KTV**: Dung Web admin de quan ly, theo doi, dieu chinh
- **AI (Kemtai)**: Phan tich tu the, tinh diem, do ROM tu dong
- **Backend**: Xu ly API, luu tru, thong bao

---

## Data Models (TypeScript)

Xem chi tiet tai `src/types/index.ts`. Cac model chinh:

| Model | Mo ta | Truong chinh |
|-------|-------|-------------|
| `User` | Tai khoan he thong | id, email, fullName, phone, role, facilityId |
| `Patient` | Benh nhan | id, fullName, diagnosis, status, assignedDoctorId, currentProtocolId, complianceRate |
| `Exercise` | Bai tap | id, name, description, videoUrl, category, repetitions, setsPerDay, durationSeconds |
| `Protocol` | Phac do dieu tri | id, name, targetCondition, isTemplate, exercises[], durationWeeks |
| `ProtocolExercise` | Bai tap trong phac do | exerciseId, sets, reps, durationSeconds, frequency, order |
| `ExerciseSession` | Phien tap | id, patientId, exerciseId, status, score, accuracy, postureScore, romValue |
| `Appointment` | Lich hen | id, patientId, doctorId, scheduledAt, type (followup/initial/telehealth), status |
| `RomDataPoint` | Du lieu ROM | date, value, baseline |
| `ClinicalNote` | Ghi chu lam sang | id, patientId, authorId, content, createdAt |
| `AppNotification` | Thong bao | id, type, title, message, isRead, patientId |
| `VideoReview` | Video can review | id, patientId, exerciseId, videoUrl, status, feedback, annotations[] |
| `Facility` | Co so y te | id, name, address, phone, doctorCount, patientCount |

---

## Mock Data

Tat ca mock data nam tai `src/lib/mock-data.ts`:

- 8 benh nhan (5 active, 1 completed, 2 attention)
- 8 bai tap (Khop goi, Khop vai, Co chan, Cot song, Co tay)
- 5 phac do (4 template, 1 custom)
- 6 exercise sessions
- 5 lich hen
- 8 diem du lieu ROM
- 3 ghi chu lam sang
- 6 thong bao
- 4 video review
- 3 co so y te
- 5 staff users
- 12 tuan du lieu compliance
- 6 thang du lieu tien trien

---

## Viec can lam (Roadmap)

### Phase 1: Hoan thien UI
- [ ] Form them/sua benh nhan
- [ ] Form them/sua lich hen (sua/huy)
- [ ] Drag & drop bai tap trong phac do
- [ ] Pagination cho tat ca danh sach
- [ ] Responsive toan dien (mobile/tablet)
- [ ] Dark mode

### Phase 2: Ket noi Backend
- [ ] Auth (login/register/refresh token)
- [ ] Auth middleware + protected routes
- [ ] CRUD API cho tat ca entities
- [ ] Real-time notifications (WebSocket)
- [ ] File upload (avatar, video)

### Phase 3: Tich hop
- [ ] Kemtai AI data (ROM, posture score, accuracy)
- [ ] Video call (Twilio/Daily.co/Jitsi)
- [ ] Export PDF/Excel
- [ ] Push notifications (FCM)

### Phase 4: Multi-tenant
- [ ] Tenant isolation (data rieng moi co so)
- [ ] Subdomain routing (optional)
- [ ] Tenant-level settings
- [ ] Billing/subscription (optional)

---

## Cach chay

```bash
cd hopita-web
npm install
npm run dev        # Development: http://localhost:3000
npm run build      # Production build
npm run start      # Start production server
```

---

## Lien ket lien quan

- **Flutter App**: `../hopita_flutter/` - App cho benh nhan
- **Flutter FEATURES.md**: `../hopita_flutter/FEATURES.md`
- **BRD Web**: `../BRD.xlsx - Web.pdf`
- **Overview Diagram**: `../Hopita-Overview.drawio.png`
- **API Base URL**: `https://api.hopita.vn`
- **Kemtai**: `https://app.kemtai.com`
