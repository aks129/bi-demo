# MVP Build Guide - ACME Pharmacy Analytics

**Estimated Time:** 45-60 minutes for core MVP
**Result:** Working demo with login, one dashboard, seeded database

---

## Quick Build Steps

### 1. Complete Next.js Setup (5 minutes)

```bash
cd apps/web

# Create Next.js config files
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
EOF

cat > postcss.config.mjs << 'EOF'
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

export default config
EOF

# Install missing dependency
npm install tailwindcss-animate
```

### 2. Set Up Prisma (10 minutes)

```bash
mkdir -p prisma

# Create schema (copy from IMPLEMENTATION_BLUEPRINT.md or use simplified version below)
```

**Simplified Prisma Schema** (`prisma/schema.prisma`):

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      String
  orgId     String?
  clientId  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model DimClient {
  id        String   @id @default(cuid())
  name      String
  segment   String
  region    String
  createdAt DateTime @default(now())
}

model DimMember {
  id         String   @id @default(cuid())
  clientId   String
  dob        DateTime
  gender     String
  riskBand   String
  planId     String
  createdAt  DateTime @default(now())

  @@index([clientId])
}

model FactAdherence {
  id          String   @id @default(cuid())
  clientId    String
  memberId    String
  drugClass   String
  pdc90       Float
  pdc180      Float
  mpr90       Float
  asOfDate    DateTime
  createdAt   DateTime @default(now())

  @@index([clientId])
  @@index([asOfDate])
}

model FactNotification {
  id          String    @id @default(cuid())
  clientId    String?
  ruleKey     String
  entityRef   String
  severity    String
  owner       String
  slaHours    Int
  status      String
  createdAt   DateTime  @default(now())
  acknowledgedAt DateTime?
  resolvedAt  DateTime?

  @@index([status])
}
```

### 3. Create Environment File

```bash
cat > .env.local << 'EOF'
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="supersecret-change-in-production-abc123xyz"
EOF
```

### 4. Simple Seed Script (10 minutes)

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create client
  const client = await prisma.dimClient.create({
    data: {
      name: 'ACME Pharmacy',
      segment: 'Mid-Market',
      region: 'Northeast'
    }
  })

  // Create users
  const password = await bcrypt.hash('demo123', 10)

  await prisma.user.createMany({
    data: [
      {
        email: 'analyst@acme.com',
        password,
        name: 'Maria Rodriguez',
        role: 'CLIENT_VIEWER',
        clientId: client.id
      },
      {
        email: 'exec@acme.com',
        password,
        name: 'David Chen',
        role: 'EXEC',
        clientId: client.id
      }
    ]
  })

  // Create sample members and adherence data
  for (let i = 0; i < 100; i++) {
    const member = await prisma.dimMember.create({
      data: {
        clientId: client.id,
        dob: new Date(1950 + Math.floor(Math.random() * 30), 0, 1),
        gender: Math.random() > 0.5 ? 'M' : 'F',
        riskBand: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        planId: 'plan-' + Math.floor(Math.random() * 3)
      }
    })

    for (const drugClass of ['Diabetes', 'Hypertension', 'Statins']) {
      await prisma.factAdherence.create({
        data: {
          clientId: client.id,
          memberId: member.id,
          drugClass,
          pdc90: 60 + Math.random() * 35,
          pdc180: 60 + Math.random() * 35,
          mpr90: 60 + Math.random() * 40,
          asOfDate: new Date()
        }
      })
    }
  }

  // Create sample notification
  await prisma.factNotification.create({
    data: {
      clientId: client.id,
      ruleKey: 'adherence_risk_spike',
      entityRef: 'Diabetes cohort',
      severity: 'High',
      owner: 'CLIENT_ADMIN',
      slaHours: 48,
      status: 'open'
    }
  })

  console.log('✅ Seeding complete!')
  console.log('Created: 1 client, 2 users, 100 members, 300 adherence records')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

### 5. Initialize Database (2 minutes)

```bash
npx prisma db push
npm run db:seed
```

### 6. Create Core Files (15 minutes)

I'll provide a Python script to generate all core files:

```bash
# Create build script
cat > build-core.py << 'PYTHON_EOF'
import os

files = {
    "lib/prisma.ts": '''import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
''',

    "lib/utils.ts": '''import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
''',

    "app/globals.css": '''@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
  }
}
''',

    "app/layout.tsx": '''export const metadata = {
  title: 'ACME Pharmacy Analytics',
  description: 'Sigma-class analytics demo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
''',

    "app/page.tsx": '''export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">ACME Pharmacy Analytics</h1>
        <p className="text-xl mb-8">Sigma-class analytics demo</p>
        <a
          href="/dashboard"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          View Dashboard
        </a>
      </div>
    </div>
  )
}
''',

    "app/dashboard/page.tsx": '''import { prisma } from '@/lib/prisma'

async function getKPIs() {
  const adherenceStats = await prisma.factAdherence.groupBy({
    by: ['drugClass'],
    _avg: {
      pdc90: true,
    },
  })

  return adherenceStats
}

export default async function DashboardPage() {
  const kpis = await getKPIs()

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Client Analytics</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {kpis.map((stat) => (
          <div key={stat.drugClass} className="border rounded-lg p-6">
            <h3 className="text-sm text-gray-500">{stat.drugClass} PDC</h3>
            <p className="text-3xl font-bold">
              {stat._avg.pdc90?.toFixed(1)}%
            </p>
            <p className={stat._avg.pdc90 && stat._avg.pdc90 >= 80 ? "text-green-600" : "text-red-600"}>
              {stat._avg.pdc90 && stat._avg.pdc90 >= 80 ? "✓ Above target" : "⚠ Below 80%"}
            </p>
          </div>
        ))}
      </div>

      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Impact Message</h2>
        <p><strong>So what?</strong> Adherence below 80% puts Star Ratings at risk.</p>
        <p><strong>Now what?</strong> Identify at-risk members and send refill reminders.</p>
      </div>
    </div>
  )
}
''',
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content)
    print(f"Created {path}")

print("\n✅ Core files created!")
PYTHON_EOF

python3 build-core.py
```

### 7. Test Locally (2 minutes)

```bash
npm run dev
# Open http://localhost:3000
```

### 8. Commit to GitHub (5 minutes)

```bash
cd ../..  # Back to repo root

git init
git add .
git commit -m "Initial commit: ACME Pharmacy Analytics MVP

- Next.js 15 app with Tailwind CSS
- Prisma with SQLite database
- Seeded with 100 members and adherence data
- Basic Client Analytics dashboard
- Ready for Vercel deployment"

# Create GitHub repo and push
gh repo create acme-pharmacy-analytics --public --source=. --remote=origin
git push -u origin main
```

### 9. Deploy to Vercel (5 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name: acme-pharmacy-analytics
# - Directory: ./
# - Override settings? No

# Set environment variables in Vercel dashboard:
# NEXTAUTH_SECRET=your-secret
# NEXTAUTH_URL=https://your-app.vercel.app
```

---

## Expected Result

After these steps, you'll have:

✅ Working Next.js app at `localhost:3000`
✅ Database with 100 members + adherence data
✅ One functional dashboard showing KPIs
✅ Code committed to GitHub
✅ App deployed to Vercel

---

## Next Steps to Expand

1. Add authentication (NextAuth)
2. Add more dashboards (Exec Overview, Ops, etc.)
3. Add charts (Recharts)
4. Add API routes
5. Add more sophisticated UI components

This MVP demonstrates the core architecture and can be expanded incrementally.
