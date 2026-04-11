# Socially Frontend — Ghid pentru Echipă

Acesta este repository-ul pentru frontend-ul aplicației **Socially**, un proiect pentru organizarea și descoperirea ieșirilor cu prietenii (Proiect IP).
Proiectul este construit folosind **React.js** și **Vite**.

---

## 🛠 Instalare și Rulare (First Time Setup)

Când începi lucrul la proiect pentru prima dată pe un laptop nou, trebuie să urmezi exact pașii de mai jos:

### Pasul 0: Instalează Node.js (Obligatoriu)
- Descarcă **Node.js (LTS)** de pe [https://nodejs.org/](https://nodejs.org/).
- Execută installer-ul dând Next la tot (păstrează setările implicite).
- **CRITIC:** După ce ai instalat Node.js, dacă aveai Visual Studio Code sau un Terminal deschis, **trebuie să le închizi complet și să le redeschizi**, altfel nu va recunoaște comanda `npm`.

### Pasul 1: Clonează repository-ul
Deschide terminalul și rulează:
```bash
git clone https://github.com/fii-a5-ip/socially-frontend.git
cd socially-frontend
```

### Pasul 2: Descarcă dependențele proiectului
În interiorul folderului clonat, rulează:
```bash
npm install
```
*(Dacă primești o eroare că `npm` nu este recunoscut, înseamnă că nu ai instalat Node.js corect sau nu ai restartat terminalul la Pasul 0).*

#### 🆘 Windows Troubleshooting (Eroare "running scripts is disabled")
Dacă pe Windows primești o eroare cu textul roșu `cannot be loaded because running scripts is disabled on this system` (PSSecurityException):
1. Deschide **PowerShell ca Administrator** (caută PowerShell în Start -> Click dreapta -> Run as Administrator)
2. Rulează comanda: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Când te întreabă, apasă `Y` (Yes) și dă Enter.
4. Închide acel PowerShell, revino în VS Code (sau terminalul tău) și rulează din nou `npm install`.

### Pasul 3: Rulează aplicația
Pentru a porni aplicația pe calculatorul tău, rulează:
```bash
npm run dev
```
Mergi în browser la adresa indicată (de obicei **[http://localhost:5173/](http://localhost:5173/)**). 

---

## 🌿 Cum interacționezi cu GitHub (Git Workflow)

Pentru că lucrăm în echipă, **NU trebuie să scrii cod direct pe ramura `main`**. Procedura corectă pentru a lua o pagină la care să lucrezi este următoarea:

**1. Asigură-te că ești pe `main` și ai ultima versiune**
În terminal, scrie:
```bash
git checkout main
git pull origin main
```

**2. Creează-ți o ramură specială pentru taskul tău**
Gândește-te la ce lucrezi și pune un nume scurt. De exemplu, dacă lucrezi la pagina de Login:
```bash
git checkout -b feature/pagina-login
```

**3. Scrie cod**. Testează-l în browser. (Aplicația se va reîncărca automat când salvezi fișierele).

**4. Salvează și trimite codul tău**
Când ești gata cu pagina ta, rulează următoarele:
```bash
git add .
git commit -m "feat: implementat pagina de login cu formular"
git push -u origin feature/pagina-login
```

**5. Crează un Pull Request**
Acum ramura ta a ajuns pe GitHub. Intră pe GitHub-ul proiectului și apasă pe butonul verde **"Compare & pull request"**. Alt coleg se va uita peste codul tău și îl va apruba spre a intra pe ramura principală (`main`).

---

## 📂 Structura Proiectului (Unde lucrez?)
- **`src/pages/`** - Aici vei găsi un folder creat deja pentru pagina ta (ex: Login, Register, Groups). Intră acolo și editează fișierele `NumePagina.jsx` și `NumePagina.css`.
- **`src/components/`** - Aici sunt butoane, bare de navigare sau input-uri refolosibile. 
- **`src/index.css`** - Aici este design-ul vizual al aplicației (nu prea e nevoie să modifici aici, folosește variabilele deja existente).

---

## 🎨 Design System & Stiluri (Vanilla CSS)

Pentru a ne asigura că tot proiectul arată premium (și că funcțiile precum **Light/Dark Mode** se aplică automat), respectăm următoarele reguli:
- **Fără culori hardcodate**: Niciodată nu folosi culori precum `background-color: #D98A55`. Folosește **variabilele noastre globale** din `index.css` (ex: `var(--bg-primary)`, `var(--text-primary)`, `var(--color-primary)` etc.).
- **Fără clase Tailwind implicite**: Proiectul nostru este pe „Vanilla CSS”. Asta înseamnă că structura paginilor pe care lucrați (`.jsx` + `.css`) trebuie să respecte CSS curat, standard. Dacă ai lucrat un design concept folosind clase de tailwind (`bg-[#eee...]`), trebuie să îl transpilezi vizual la arhitectura noastră înainte de comitere pentru ca design-ul să nu fie orfan.

---

## ⚠️ Code Quality & Erori Frecvente (Lint & Build)

Pentru ca ramura principală (`main`) să nu se strice niciodată, trebuie să devii sigur pe ceea ce pushezi:
- **Regula Linting-ului (Niciun warning la PR!)**: Înainte de orice comitere, rulează `npm run lint`. Remediază erorile apărute (ex: dependințe lipsă din `useEffect`, sau adăugarea importurilor). 
- **Verificarea Build-ului**: Cel mai periculos bug este importarea unor funcții sau imagini care nu există în proiect (de ex: componente descărcate sau rătăcite dintr-un alt proiect). Ca să te asiguri de asta, rulează neapărat `npm run build` o singură dată pe local înainte de a deschide Pull Request-ul. Dacă dă eroare, repara-l.
- **Integrarea înainte de Push**: Înainte de a considera branch-ul finalizat, dă un `git merge main` în interiorul branch-ului tău. Rezolvă conflictele dacă există; abia apoi deschide Pull Request.

---

## 🤖 Best Practices & Generare de Cod (AI ajutător)

Suntem încurajați să fim eficienți. Dacă vrei să generezi implementări cu asistenți AI (ChatGPT, GitHub Copilot etc):
- **Citește și analizează codul**: Nu da niciodată copy-paste pe nevăzute. Chiar dacă botul îți dă cod funcțional, **trebuie neapărat să-l înțelegi**.
- **Păstrează coerența cu proiectul**: AI-ul nu își dă mereu seama de structura din `index.css` sau de faptul că noi scriem pe `.jsx` folosind `lucide-react` pentru iconițe și CSS Vanilla. Corectează tot codul primit ca să fuzioneze perfect cu ghidurile detaliate mai sus.

Succes la codat! 🚀
