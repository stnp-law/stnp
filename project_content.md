# STNP Project Content Reference

This document contains all the core content and structural information for the Soaloan Tua Nababan & Partners (STNP) website project. AI agents should use this as the single source of truth for firm details, team members, legal services, and project assets.

---

## 🏛️ Firm Information

- **Full Name**: Soaloan Tua Nababan & Partners
- **Short Name / Abbreviation**: STNP
- **Founded**: 2018
- **Founder**: Mr. Oswald Soaloan Silalahi
- **Tagline**: Enforcing the Law of Truth and Justice Indiscriminately (Indonesian: *Menegakkan Hukum Kebenaran dan Keadilan Tanpa Pandang Bulu*)
- **Firm Quote**: *"If a law is unjust a man is not only right to disobey it, he is obligated to do so."* — Thomas Jefferson

### Contact Details
- **Email**: `admin@stnp.co.id`
- **Phone**: 
  - `+6221-2952-7087 ext. 120`
  - `+6221 5795-7668`
- **Address**: 
  Prudential Tower, Lantai 19
  Jl. Jenderal Sudirman Kav. 79
  Jakarta Selatan, 12910
  Indonesia

### Core Principles
1. **Strategic Resolution**: We believe that first, we need to understand the needs and purpose of our clients. Only by understanding those matters so we can advise legal actions that can solve our clients' needs and minimize their risk in the future.
2. **Principled Efficiency**: We will advise legal actions in the most effective way and efficient cost. We are not that type of lawyer that likes to propose something our clients don't need just to make an extra profit. We believe in mutual benefit.
3. **Strong Relationship**: We will always maintain good communication with our clients so that we can have a strong relationship with them. We believe that only by strong relationship we can really understand the needs and purpose of our clients.

---

## 🗺️ Website Structure & Routing

The Next.js `app` router implements the following main pages:

- `/` — **Homepage** (Hero, About Summary, Practice Areas zig-zag, Quote Banner, Latest Articles, Contact CTA mesh)
- `/about-us` — **About Us** (Detailed firm background and philosophy)
- `/legal-services` — **Services** (Complete list of practice areas)
- `/team-profile` — **Team Profiles** (Directory of partners and associates)
- `/article` — **Insights/Blog** (Wordpress headless integration fetching articles)
- `/contact` — **Contact Page** (Form and location details)

---

## ⚖️ Legal Services (Practice Areas)

### Dispute Resolution
- **Commercial Litigation**: We have deep knowledge and experience in Indonesian law enforcement mechanism and have represented many major clients in various civil and commercial litigations from District Court until Supreme Court. All of our lawyers are registered in Indonesian Bar and can act before a court in Indonesia. Our team also have involved in some administrative litigations.
- **Banking & Finance**
- **Bankruptcy & Insolvency**: We have experience in representing both creditors and debtors on all aspects of insolvency and bankruptcy. Our lawyers have registered as members of Association of Trustee in Bankruptcy and Receiver Indonesia.
- **Industrial Relations (Labor Law)**: We regularly assist and provide advice to our clients on all types of employment industrial relation matters, such as company regulation, collective employment agreement, fixed and permanent terms employment agreement, labour union, employment termination and severance payment, and industrial relation dispute.

### Corporate & Commercial
- **General Corporate**: We provide advice and assistance on corporate and commercial business legal matters in Indonesia from the establishment of the company, license, acquisition, closure, and day-to-day legal issues.
- **Mergers & Acquisitions**
- **Project Financing**: We have been involved in project financing for many projects in Indonesia, such as infrastructure, industrial, and plantation projects.
- **Intellectual Property**: We have provided legal advice to our clients on Intellectual Property regulation in Indonesia and assisted in agreement to protect their interests that related to Intellectual Property matters.

### Industry Focus
- **Energy, Mining & Forestry**: We have experience in providing advice and assisting major clients in forestry matters, in which we have provided legal advice to forest company on its license and assisted to obtain it. We also have been involved in sale and purchase of Forest Plantation Wood Production Permit agreements.
- **Infrastructure & Property**: We have advised and assisted our clients in several infrastructure projects in Indonesia, such as legal acquisition, permits, and agreements matters. We provide our services in real property business, in which we have experience in assisting property companies related to permits, land acquisitions, lease agreements, rights of land, and land-based dispute settlement.
- **Plantation & Agriculture**: We have the expertise and have assisted major clients in plantation matters. We have been involved in the acquisitions of palm oil plantation companies and provide advice on several issues such as licensing, land acquisition, rights of land, and its plasma plantation.
- **Tourism & Hospitality**: We assist and provide advice to property owners, investors, and tourism-business entities on their permits and agreements, such as management agreements, lease agreements, and license agreements.

### Commitment to Justice
- **Pro Bono Legal Aid**: We believe that everyone deserves a legal help and that we have obligation to provide a free of charge legal cost to disadvantage people that has a legal issue.

---

## 👥 Team Directory

### Partners
- **Oswald Anggi Soaloan, S.H.** *(Managing Partner)*
  - **Specialization**: Commercial litigation, bankruptcy, mining, plantation, and energy.
  - **Bio context**: Graduated from Gadjah Mada University (Ugm). Holds Peradi advocate license. Passed Capital Market Legal Consultant course. 

- **Gideon Putra Tua Sitorus, S.H., M.H.** *(Partner)*
  - **Specialization**: General corporate matters, commercial litigation, plantation, and industrial relationships.
  - **Bio context**: Bachelor & Magister from UGM. PERADI member. Experienced in handling cases and transactions across various legal fields.

- **Daniel Perdana Saoloan Nababan, S.H., M.H.** *(Partner)*
  - **Specialization**: Commercial litigation and Bankruptcy.
  - **Bio context**: Bachelor from UGM, Magister from University of Christian Indonesia. Member of PERADI and AKPI. Represents International and Indonesian clients.

### Senior Associates
- **Nirwati S. Salomo, S.H.** 
  - **Specialization**: Company acquisitions, general corporate, family law, employment, mining, and energy. (UI Alumnus, 1985).
- **Praya Dwiputra Ramadhan, S.H.** 
  - **Specialization**: Bankruptcy law and commercial transactions.

### Associates
- **Andreanna Rotua Siahaan, S.H.**
  - Focuses on litigation and corporate practice, case preparation, and legal research.
- **Imanuel Patar Parsaoran Turnip, S.H.** 
  - Keen interest in commercial law and dispute resolution.

---

## 📂 Static Assets Reference

All assets are located in the `/public` directory.

### Branding
- `/images/logo.png` (Default Logo)
- `/images/logo-dark.png` (Dark Mode Logo)

### Video
- `/videos/hero-loop.mp4` (Primary background video)
- `/videos/hero-loop-hevc.mp4` (Highly compressed video for Safari/Apple platforms)

### Team Photography
Mapped based on their object ID in `lib/data/team.js`:
- `/images/team/oswald.webp`
- `/images/team/gideon.webp`
- `/images/team/daniel.webp`
- `/images/team/nirwati.webp`
- `/images/team/praya.webp`
- `/images/team/anna.webp`
- `/images/team/nuel.webp`
