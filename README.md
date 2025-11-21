# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    **مشروع واجهة Workflow (React + TypeScript + Vite)**

    ملخص سريع (بالعربي):

    - هذا المشروع هو واجهة أمامية مبنية بـ `React` + `TypeScript` ويدار عبر `Vite`.
    - تنسيق الملفات: المكونات في `src/`، الصور والميديا في `src/assets`.
    - تم استخدام مكتبات UI مثل Ant Design وبعض أيقونات `lucide-react`.

    Quick summary (English):

    - Frontend app built with `React` + `TypeScript` and powered by `Vite`.
    - Components live under `src/`. Static images are kept in `src/assets`.
    - Uses Ant Design and lucide-react for UI and icons.

    ---

    **معلومات النظام (System info)**

    - Node/npm: Use a recent Node.js (18+ recommended) and npm.
    - Run the dev server (PowerShell):

    ```powershell
    npm install
    npm run dev
    ```

    - Build for production:

    ```powershell
    npm run build
    ```

    - Dev server proxy: The Vite dev server proxies `^/api/.*` to the backend at `http://localhost:4000` — see `vite.config.ts`.

    - Authentication: the app stores the JWT token in `localStorage` under the key `auth_token`. Many API calls add `Authorization: Bearer <token>`.

    ---

    **موقع الصور / لقطات الشاشة**

    الصور المرفوعة موجودة في `src/assets`. تم تضمين لقطات للشاشات المهمة أدناه — افتحي الملف محليًا لتأكيد المسارات والأسماء.

    - Employer Dashboard
      ![Employer Dashboard](src/assets/employerDashboard.JPG)

    - HR Manager Dashboard
      ![HR Manager Dashboard](src/assets/hrmangerdashboard.JPG)

    - Landing Page
      ![Landing Page](src/assets/landingpage.JPG)

    - Login
      ![Login](src/assets/login.JPG)

    - Manager Dashboard
      ![Manager Dashboard](src/assets/mangerdashboard.JPG)

    - Notifications (example)
      ![Notifications](src/assets/notofilcation.JPG)

    ---

    **المسارات والصفحات المهمة (Important routes)**

    - `/` — Landing page
    - `/login` — Login
    - `/hr/workflows` — Workflows list (HR)
    - `/hr/workflows/create` — Create workflow page (the form used to create a workflow)![landingpage](https://github.com/user-attachments/assets/10a6564f-54f6-462f-a7e9-ebf829595a59)

    - `/requests` and role-specific pages live in `src/pages/` and `src/layouts/`

demo https://drive.google.com/file/d/1yvRAS3odhQb6M2v7RWwZKTQTbK6rOv8f/view?usp=sharing
![empcreateworkflow](https://github.com/user-attachments/assets/cf635ef5-fc87-4181-840c-c9d70c765f06)
![employerDashboard](https://github.com/user-attachments/assets/bda34cd3-903f-4ca0-ad55-289f8c3cfcd3)
![notofilcation](https://github.com/user-attachments/assets/7b601231-9f1f-4e80-98ca-be4fba8934a6)
![requests](https://github.com/user-attachments/assets/ab32e606-b1b2-4ff8-b6fe-96eeae18dcf7)
![users](https://github.com/user-attachments/assets/1c271251-0213-45df-b616-18cce4ebd4aa)
![mangerdashboard](https://github.com/user-attachments/assets/364d9e85-44fb-4477-87aa-25bf77f9c016)
![login](https://github.com/user-attachments/assets/a9b46098-453e-47aa-8e78-ea089f9bf251)
![Uploading landingpage.JPG…]()


