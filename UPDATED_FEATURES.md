# Company Blacklist System - Updated Documentation

## ✅ რა განხორციელდა

### Backend განახლებები

#### 1. User Entity - ახალი ველები
- `taxId` - 9 ციფრიანი უნიკალური კოდი
- `companyName` - კომპანიის იურიდიული დასახელება
- `legalAddress` - იურიდიული მისამართი (nullable)
- `authorizedPersonName` - ავტორიზებული პირის სახელი და გვარი
- `email` - უნიკალური ელექტრონული ფოსტა
- `phoneNumber` - მობილურის ნომერი
- `password` - ჰეშირებული პაროლი (მინ. 8 სიმბოლო)
- `role` - 'user' ან 'admin'
- `status` - 'pending', 'approved', 'rejected'

#### 2. ვალიდაციები
- **ს/კ**: მხოლოდ 9 ციფრი (`/^\d{9}$/`)
- **Email**: უნიკალური უნდა იყოს
- **პაროლი**: მინიმუმ 8 სიმბოლო
- **ტელეფონი**: ფორმატი `5XXXXXXXX` (9 ციფრი)

#### 3. Database
- `dropSchema: true` - ავტომატურად წაშლის ძველ სქემას და ქმნის ახალს
- ⚠️ **Production-ში ეს უნდა ამოიშალოს!**

### Frontend განახლებები

#### რეგისტრაციის ფორმა (3 სექცია)

**1. კომპანიის იურიდიული მონაცემები**
- საიდენტიფიკაციო კოდი (ს/კ) * - 9 ციფრი, ავტო-ფილტრაცია
- კომპანიის იურიდიული დასახელება *
- იურიდიული მისამართი - სურვილისამებრ

**2. ავტორიზებული პირის მონაცემები**
- სახელი და გვარი *
- ელექტრონული ფოსტა *
- მობილურის ნომერი * - ფორმატი: 5XXXXXXXX, ავტო-ფილტრაცია

**3. უსაფრთხოება**
- პაროლი * - მინ. 8 სიმბოლო
- პაროლის დადასტურება *

#### Login გვერდი
- ს/კ - 9 ციფრიანი, ავტო-ფილტრაცია
- პაროლი

## 🚀 როგორ გავაშვათ

### Backend
```bash
cd backend
npm run start:dev
```
Server: `http://localhost:3001`

### Frontend
```bash
cd frontend
npm start
```
App: `http://localhost:3000`

## 🔑 Admin Credentials

- **Tax ID**: `000000000`
- **Password**: `admin123`
- **Email**: `admin@system.local`

## 📋 User Workflow

1. **რეგისტრაცია**
   - მომხმარებელი აავსებს ყველა ველს
   - სისტემა ამოწმებს ვალიდაციას
   - მომხმარებელი იქმნება `status: PENDING`
   - გამოდის შეტყობინება: "თქვენი მოთხოვნა გაიგზავნა ადმინისტრატორთან"

2. **Waiting Page**
   - Pending მომხმარებელი login-ის შემდეგ ხედავს Waiting გვერდს
   - "მიმდინარეობს ვერიფიკაცია..."

3. **Admin Approval**
   - ადმინი ხედავს pending მომხმარებლებს Admin Panel-ში
   - ხედავს ყველა მონაცემს: ს/კ, კომპანია, email, ტელეფონი და ა.შ.
   - აჭერს ✅ Approve ან ❌ Reject

4. **Approved User**
   - მომხმარებელი login-ის შემდეგ გადადის Dashboard-ზე
   - შეუძლია კომპანიების ძებნა და დამატება

5. **Rejected User**
   - **ვერ შეძლებს ხელახლა რეგისტრაციას იმავე ს/კ-ით**
   - მუდმივად დაბლოკილია

## 🔒 უსაფრთხოება

- Password hashing: bcrypt (10 rounds)
- JWT tokens: 24h expiration
- Guards: JwtAuthGuard → StatusGuard → RolesGuard
- Permanent Tax ID blocking for rejected users
- Email uniqueness validation

## 📡 API Endpoints

### Auth
```
POST /api/auth/register - რეგისტრაცია
POST /api/auth/login - შესვლა
GET  /api/auth/me - მიმდინარე მომხმარებელი
```

### Admin (Admin only)
```
GET  /api/admin/pending - pending მომხმარებლები
POST /api/admin/approve/:id - დამტკიცება
POST /api/admin/reject/:id - უარყოფა
```

### Blacklist (Approved users only)
```
GET  /api/blacklist - ყველა კომპანია
GET  /api/blacklist/search?q=query - ძებნა
POST /api/blacklist/add - კომპანიის დამატება
```

## ⚠️ Production Checklist

- [ ] `dropSchema: true` ამოშალეთ app.module.ts-დან
- [ ] ადმინის პაროლი შეცვალეთ
- [ ] JWT secret გადაიტანეთ environment variables-ში
- [ ] CORS შეზღუდეთ production domain-ზე
- [ ] HTTPS დააყენეთ
- [ ] Rate limiting დაამატეთ

## 🐛 Debugging

თუ database error-ს იღებთ:
1. გაჩერეთ backend server
2. წაშალეთ `backend/database.sqlite`
3. ხელახლა გაუშვით `npm run start:dev`
4. Database ახლიდან შეიქმნება seed-ით

## 📝 Notes

- Frontend-ის RegisterStyles.css დაემატა form sections-ისთვის
- Login and Register გვერდებზე small tags დაემატა hint-ებისთვის
- ყველა input-ს აქვს ავტომატური ვალიდაცია და ფილტრაცია
- Database იშლება ყოველ გაშვებაზე (development only!)
