# Kantrybės — kantrybes.lt

Dev & DJ portfolio. Next.js + MySQL (Railway), viskas vienoje vietoje.

## Struktūra
```
/              → landing (Dev / DJ pasirinkimas)
/dev           → developer portfolio (projektai, admin valdomi)
/dj            → DJ/event puslapis (kuriamas)
/admin         → admin panel (apsaugotas slaptažodžiu)
```

## Stack
- **Next.js 14** (App Router)
- **MySQL** (Railway managed DB)
- **Tailwind CSS**
- **Railway** (hosting + DB, viena vieta)

## Setup

### 1. Railway projektas
1. [railway.app](https://railway.app) → New Project → **Provision MySQL**
2. Railway sukurs MySQL instance — eik į jo **Variables** tab, nukopijuok:
   - `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`
   (Railway juos pavadina skirtingai nei šis projektas — žr. žemiau mapping)

### 2. .env.local
```bash
cp .env.local.example .env.local
```
Užpildyk pagal Railway MySQL Variables:
```
MYSQL_HOST=<MYSQLHOST iš Railway>
MYSQL_PORT=<MYSQLPORT iš Railway>
MYSQL_USER=<MYSQLUSER iš Railway>
MYSQL_PASSWORD=<MYSQLPASSWORD iš Railway>
MYSQL_DATABASE=<MYSQLDATABASE iš Railway>
ADMIN_PASSWORD=<sugalvok savo slaptažodį>
```

### 3. Inicializuoti DB lentelę
```bash
npm install
npm run db:init
```
Tai paleidžia `schema.sql` per Railway MySQL konekciją — sukuria `projects` lentelę ir įdeda sample duomenis.

Alternatyva: nukopijuok `schema.sql` turinį ir paleisk per Railway → MySQL service → **Data** tab → Query.

### 4. Paleisti lokaliai
```bash
npm run dev
```
- Portfolio: http://localhost:3000
- Dev puslapis: http://localhost:3000/dev
- Admin: http://localhost:3000/admin/login

## Deploy į Railway

1. Push kodą į GitHub repo
2. Railway → New Service → **Deploy from GitHub repo** → pasirink repo
3. Railway automatiškai aptiks Next.js ir sukonfigūruos build
4. **Settings → Variables** → pridėk tuos pačius kintamuosius kaip `.env.local`
   - Patogiausia: Railway leidžia "Reference" kintamuosius tarp servisų tame pačiame projekte —
     gali tiesiog susieti `MYSQL_HOST` su MySQL serviso `MYSQLHOST` automatiškai
5. **Settings → Networking** → Generate Domain (arba pridėk custom domain)

## Custom domain (kantrybes.lt)

1. Nupirk domeną (Namecheap, ~€10-15/m)
2. Railway → service → Settings → Networking → **Custom Domain** → įvesk `kantrybes.lt`
3. Railway duos CNAME/A record reikšmes
4. Namecheap → Domain → Advanced DNS → pridėk tuos records

## Admin naudojimas
- `/admin/login` — prisijungimas su `ADMIN_PASSWORD`
- Galima: pridėti, redaguoti, ištrinti projektus per UI
- Pakeitimai matosi iš karto `/dev` puslapyje (server-side render, be cache)

## Kitų projektų pridėjimas į tą pačią Railway sąskaitą

Tame pačiame Railway projekte ("kantrybes") gali pridėti papildomus servisus:
- DJBook backend (Go) → New Service → Deploy from GitHub
- Steam Recommender (Flask) → New Service → Deploy from GitHub

Visi servisai gali naudoti tą pačią MySQL instanciją (skirtingomis lentelėmis/prefix'ais),
arba turėti atskirą DB jei reikia izoliacijos.
