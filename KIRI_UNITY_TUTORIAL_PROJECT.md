# 🎮 Kiri Unity Tutorial — Инструкция для Cursor

## Оглавление

1. [Обзор проекта](#обзор-проекта)
2. [Технический стек](#технический-стек)
3. [Быстрый старт](#быстрый-старт)
4. [Структура проекта](#структура-проекта)
5. [Workflow создания уроков](#workflow-создания-уроков)
6. [Интеграция с Figma MCP](#интеграция-с-figma-mcp)
7. [Система компонентов](#система-компонентов)
8. [Деплой на GitHub Pages](#деплой-на-github-pages)
9. [Промпты для Cursor](#промпты-для-cursor)

---

## Обзор проекта

### Что это?
Интерактивный многостраничный учебник по Unity для 2D мобильных игр от Game Designer **Kiri (Kristina Melnik)**.

### Цели
- 📚 Научить делать первую игру
- 🎯 Дать основы Unity для портфолио
- 💡 Научить прототипировать идеи
- 🌟 Повысить узнаваемость Kiri в gamedev-сообществе

### Целевая аудитория
- Программисты, новые в Unity
- Дизайнеры, желающие прототипировать без кода
- Языки: RU / EN
- Сообщества: Habr, Reddit r/gamedev, r/Unity2D

### Тон коммуникации
Дружелюбный, с юмором и мемами. Личные комментарии Kiri в стиле "Я обычно делаю так..."

---

## Технический стек

```
Frontend:        Next.js 14 (App Router) + TypeScript
Стилизация:      Tailwind CSS + Framer Motion
Контент:         MDX (Markdown + JSX компоненты)
Хостинг:         GitHub Pages (статический экспорт)
Дизайн:          Figma → MCP Agent
Аналитика:       Plausible / Umami (privacy-friendly)
Формы:           Formspree / Telegram Bot API
```

### Почему этот стек?
| Технология | Причина |
|------------|---------|
| Next.js | SSG для GitHub Pages, отличная поддержка MDX |
| MDX | Markdown + интерактивные React компоненты |
| Tailwind | Быстрая стилизация, темная тема из коробки |
| Framer Motion | Анимации без сложности |
| GitHub Pages | Бесплатно, версионирование контента |

---

## Быстрый старт

### 1. Создание репозитория

```bash
# Создай репозиторий на GitHub
# Название: kiri-unity-tutorial

# Клонируй локально
git clone https://github.com/YOUR_USERNAME/kiri-unity-tutorial.git
cd kiri-unity-tutorial
```

### 2. Инициализация проекта

Открой папку в Cursor и дай команду:

```
@workspace Создай Next.js 14 проект с TypeScript, Tailwind CSS, MDX для статического сайта на GitHub Pages. Добавь Framer Motion для анимаций.
```

Или вручную:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir

# Дополнительные зависимости
npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install framer-motion
npm install next-themes          # Темная тема
npm install lucide-react         # Иконки
npm install @tailwindcss/typography  # Стили для текста
```

### 3. Конфигурация для GitHub Pages

**next.config.mjs:**
```javascript
import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/kiri-unity-tutorial',
  images: { unoptimized: true },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
```

### 4. GitHub Actions для деплоя

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

---

## Структура проекта

```
kiri-unity-tutorial/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Главный layout + навигация
│   │   ├── page.tsx                # Главная страница
│   │   ├── lessons/
│   │   │   ├── page.tsx            # Список всех уроков
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Динамическая страница урока
│   │   ├── resources/
│   │   │   └── page.tsx            # Страница источников
│   │   └── feedback/
│   │       └── page.tsx            # Форма обратной связи
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── KiriAvatar.tsx      # Аватар Kiri с комментариями
│   │   ├── interactive/
│   │   │   ├── UnityInterface.tsx  # Интерактивная схема Unity
│   │   │   ├── CodePlayground.tsx  # Редактор кода с превью
│   │   │   ├── Quiz.tsx            # Мини-тесты
│   │   │   ├── StepByStep.tsx      # Пошаговые инструкции
│   │   │   └── DevicePreview.tsx   # Превью на разных устройствах
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── Callout.tsx         # Подсказки, предупреждения
│   │   └── mdx/
│   │       └── MDXComponents.tsx   # Кастомные компоненты для MDX
│   ├── content/
│   │   └── lessons/
│   │       ├── ru/
│   │       │   ├── 01-getting-started.mdx
│   │       │   ├── 02-unity-interface.mdx
│   │       │   └── ...
│   │       └── en/
│   │           ├── 01-getting-started.mdx
│   │           └── ...
│   ├── lib/
│   │   ├── lessons.ts              # Утилиты для работы с уроками
│   │   └── figma.ts                # Интеграция с Figma MCP
│   ├── styles/
│   │   └── globals.css
│   └── types/
│       └── lesson.ts
├── public/
│   ├── images/
│   │   ├── kiri-avatar.png
│   │   ├── lessons/
│   │   └── figma-exports/          # Экспорты из Figma
│   └── favicon.ico
├── scripts/
│   ├── create-lesson.ts            # Скрипт создания урока
│   └── fetch-figma-assets.ts       # Загрузка из Figma
├── .cursorrules                    # Правила для Cursor AI
├── PROMPTS.md                      # Библиотека промптов
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Workflow создания уроков

### Шаг 1: Написание заметки

Создай текстовый файл с заметкой в свободной форме:

```
notes/canvas-scaler.txt
---
Тема: Canvas Scaler в Unity

Что это: компонент на Canvas, масштабирует UI под разные экраны

3 режима:
- Constant Pixel Size - фиксированный размер, плохо для мобилок
- Scale With Screen Size - РЕКОМЕНДУЕТСЯ, масштаб по референсу
- Constant Physical Size - редко используется

Важные параметры:
- Reference Resolution: обычно 1080x1920
- Match Width/Height: 0 = ширина, 1 = высота, 0.5 = баланс

Где найти: Hierarchy > Canvas > Inspector > Canvas Scaler

Мой совет: для portrait игр типа 2048 ставь Match = 1
```

### Шаг 2: Промпт для Cursor

Открой notes/canvas-scaler.txt и дай команду:

```
@workspace Преобразуй эту заметку в MDX урок для Kiri Unity Tutorial.

Требования:
1. Добавь frontmatter с метаданными
2. Используй компоненты: <KiriTip>, <StepByStep>, <UnityInterface>
3. Создай интерактивную схему Canvas Scaler с переключением режимов
4. Добавь превью на разных устройствах (iPhone, iPad, Android)
5. Включи код настроек для Inspector
6. Тон: дружелюбный, с юмором от Kiri
7. Язык: русский

Сохрани в: src/content/lessons/ru/XX-canvas-scaler.mdx
```

### Шаг 3: Результат — MDX файл

```mdx
---
title: "Canvas Scaler — Магия масштабирования"
slug: "canvas-scaler"
order: 5
category: "UI"
difficulty: "beginner"
duration: "15 мин"
description: "Как сделать так, чтобы UI выглядел круто на всех телефонах"
tags: ["UI", "Canvas", "Mobile", "Adaptation"]
figmaFrame: "canvas-scaler-illustrations"
---

import { KiriTip, StepByStep, UnityInterface, DevicePreview, Quiz } from '@/components/interactive';

# Canvas Scaler — Магия масштабирования 📐

<KiriTip mood="thinking">
  Помнишь, как ты запустил игру на телефоне друга, а там всё поехало?
  Canvas Scaler — твой спаситель от этого кошмара!
</KiriTip>

## Что это такое?

Canvas Scaler — компонент, который автоматически масштабирует весь UI
под размер экрана. Без него твоя игра будет выглядеть как это:

<DevicePreview 
  mode="comparison"
  before={{ scaler: 'none' }}
  after={{ scaler: 'scaleWithScreen', match: 1 }}
/>

## Три режима масштабирования

<UnityInterface 
  component="CanvasScaler"
  interactive={true}
  highlightPath={['Canvas', 'Inspector', 'Canvas Scaler']}
/>

### 1. Constant Pixel Size

<KiriTip mood="warning">
  Никогда не используй для мобильных игр! Серьёзно, просто не надо.
</KiriTip>

...

<StepByStep title="Настройка Canvas Scaler для 2048">
  <Step number={1}>
    Найди **Canvas** в Hierarchy
  </Step>
  <Step number={2}>
    В Inspector найди компонент **Canvas Scaler**
  </Step>
  <Step number={3}>
    UI Scale Mode → **Scale With Screen Size**
  </Step>
  <Step number={4}>
    Reference Resolution: **1080 x 1920**
  </Step>
  <Step number={5}>
    Match: **1** (для portrait игр)
  </Step>
</StepByStep>

<Quiz 
  question="Какой Match использовать для landscape игры?"
  options={[
    { text: "0 (Width)", correct: true },
    { text: "0.5 (Balance)", correct: false },
    { text: "1 (Height)", correct: false }
  ]}
  explanation="Для landscape приоритет по ширине, так как высота меняется сильнее"
/>
```

### Шаг 4: Превью в браузере

```bash
npm run dev
# Открой http://localhost:3000/lessons/canvas-scaler
```

---

## Интеграция с Figma MCP

### Настройка MCP агента

**.cursor/mcp.json:**
```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic/figma-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
      }
    }
  }
}
```

### Получение токена Figma

1. Figma → Settings → Account → Personal access tokens
2. Создай токен с правами на чтение файлов
3. Добавь в `.env.local`:
   ```
   FIGMA_ACCESS_TOKEN=figd_xxxxxxxxxxxxx
   ```

### Структура Figma файла

Организуй файл так:

```
📁 Kiri Unity Tutorial
├── 📄 Components
│   ├── KiriAvatar (все настроения)
│   ├── Buttons
│   ├── Cards
│   └── Icons
├── 📄 Illustrations
│   ├── Unity Interface
│   ├── Canvas Scaler
│   ├── Anchors
│   └── Safe Area
├── 📄 Devices
│   ├── iPhone SE
│   ├── iPhone 14 Pro
│   ├── iPad
│   └── Android
└── 📄 Memes & Fun
    └── Funny illustrations for tips
```

### Промпт для получения ассетов

```
@figma Получи из файла "Kiri Unity Tutorial" все компоненты из фрейма "Canvas Scaler". Экспортируй как SVG и сохрани в public/images/lessons/canvas-scaler/
```

### Автоматический скрипт

**scripts/fetch-figma-assets.ts:**
```typescript
// Cursor сгенерирует этот скрипт по запросу
// Промпт: "Создай скрипт для загрузки ассетов из Figma по имени фрейма"
```

---

## Система компонентов

### KiriTip — Комментарии от Kiri

```tsx
// src/components/interactive/KiriTip.tsx

type KiriMood = 'happy' | 'thinking' | 'warning' | 'excited' | 'confused';

interface KiriTipProps {
  mood: KiriMood;
  children: React.ReactNode;
}

export function KiriTip({ mood, children }: KiriTipProps) {
  // Разные аватары для разных настроений
  // Анимация появления через Framer Motion
}
```

**Использование:**
```mdx
<KiriTip mood="excited">
  Это моя любимая фича в Unity! Сейчас покажу почему.
</KiriTip>
```

### StepByStep — Пошаговые инструкции

```tsx
// src/components/interactive/StepByStep.tsx

interface StepByStepProps {
  title: string;
  children: React.ReactNode; // Step компоненты
}

interface StepProps {
  number: number;
  children: React.ReactNode;
  screenshot?: string;      // Путь к скриншоту
  video?: string;           // Путь к короткому видео/GIF
}
```

**Использование:**
```mdx
<StepByStep title="Создание первого скрипта">
  <Step number={1} screenshot="/images/lessons/scripts/step-1.png">
    Правый клик в **Project** → Create → C# Script
  </Step>
  <Step number={2}>
    Назови скрипт **PlayerController**
  </Step>
</StepByStep>
```

### UnityInterface — Интерактивная схема

```tsx
// src/components/interactive/UnityInterface.tsx

interface UnityInterfaceProps {
  component: 'CanvasScaler' | 'RectTransform' | 'Inspector' | 'Hierarchy';
  interactive?: boolean;
  highlightPath?: string[];  // Путь подсветки в интерфейсе
  onSettingChange?: (settings: object) => void;
}
```

### DevicePreview — Превью на устройствах

```tsx
// src/components/interactive/DevicePreview.tsx

interface DevicePreviewProps {
  devices?: ('iphone-se' | 'iphone-14' | 'ipad' | 'android')[];
  mode?: 'single' | 'comparison' | 'all';
  showSafeArea?: boolean;
  children?: React.ReactNode;  // Кастомный контент внутри
}
```

### Callout — Выноски и подсказки

```tsx
// src/components/ui/Callout.tsx

type CalloutType = 'info' | 'warning' | 'success' | 'error' | 'unity';

interface CalloutProps {
  type: CalloutType;
  title?: string;
  children: React.ReactNode;
}
```

**Использование:**
```mdx
<Callout type="unity" title="Unity Inspector">
  В Inspector ты увидишь все компоненты выбранного объекта
</Callout>
```

---

## Деплой на GitHub Pages

### Автоматический деплой

Каждый push в `main` запускает GitHub Actions:

1. Сборка Next.js (`npm run build`)
2. Экспорт статики в `/out`
3. Деплой на GitHub Pages

### Ручной деплой

```bash
npm run build
# Проверь папку /out

# Или используй gh-pages
npm install -g gh-pages
gh-pages -d out
```

### Настройка домена (опционально)

1. GitHub → Settings → Pages → Custom domain
2. Добавь CNAME файл в `/public`:
   ```
   unity.kiri.dev
   ```

---

## Промпты для Cursor

Сохрани в `.cursorrules`:

```
# Kiri Unity Tutorial - Cursor Rules

## Стиль кода
- TypeScript strict mode
- Функциональные компоненты React
- Tailwind CSS для стилей
- Framer Motion для анимаций

## Стиль контента
- Тон: дружелюбный, с юмором
- Обращение: на "ты"
- Мемы и шутки приветствуются
- Личные комментарии Kiri через <KiriTip>

## Структура уроков
- Всегда начинай с "зачем это нужно"
- Используй интерактивные компоненты
- Добавляй пошаговые инструкции
- Заканчивай практическим заданием или quiz

## Figma интеграция
- Все иллюстрации из Figma файла "Kiri Unity Tutorial"
- Экспорт в SVG когда возможно
- Сохранять в public/images/lessons/{lesson-slug}/
```

### Библиотека промптов

**PROMPTS.md:**

```markdown
# Промпты для создания контента

## Новый урок из заметки
```
Преобразуй заметку в MDX урок для Kiri Unity Tutorial.
Используй компоненты: KiriTip, StepByStep, Callout, Quiz.
Тон: дружелюбный с юмором. Язык: русский.
```

## Интерактивная схема
```
Создай React компонент интерактивной схемы [название].
Требования:
- Tailwind CSS + Framer Motion
- Тултипы при наведении
- Кликабельные элементы
- Адаптивный дизайн
```

## Перевод урока
```
Переведи урок {filename} на английский.
Сохрани структуру MDX и все компоненты.
Адаптируй шутки под англоязычную аудиторию.
```

## Создание quiz
```
Создай 3-5 вопросов quiz для урока о [тема].
Формат: multiple choice с объяснениями.
Уровень: beginner.
```
```

---

## Чеклист запуска MVP

### Контент
- [ ] 5-7 базовых уроков на русском
- [ ] Главная страница с описанием
- [ ] Страница "Об авторе" (Kiri)
- [ ] Страница источников
- [ ] Форма обратной связи

### Технический
- [ ] Настроен Next.js + MDX
- [ ] Работает GitHub Actions деплой
- [ ] Адаптивный дизайн (mobile-first)
- [ ] Темная тема
- [ ] SEO meta-теги

### Дизайн
- [ ] Аватар Kiri (минимум 3 настроения)
- [ ] Цветовая палитра
- [ ] Базовые иллюстрации Unity интерфейса
- [ ] Favicon и OG-изображения

### Интеграции
- [ ] Figma MCP настроен
- [ ] Форма → Email/Telegram
- [ ] Кнопки донатов (Boosty/Patreon)
- [ ] Ссылки на соцсети Kiri

---

## Полезные ссылки

- [Next.js App Router](https://nextjs.org/docs/app)
- [MDX](https://mdxjs.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GitHub Pages с Next.js](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)
- [Figma MCP](https://github.com/anthropics/anthropic-tools)

---

**Удачи с проектом! 🎮✨**

*Если что-то непонятно — пиши Kiri в Telegram*
