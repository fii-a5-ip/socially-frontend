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

Succes la codat! 🚀
