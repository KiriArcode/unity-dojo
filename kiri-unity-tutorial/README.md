# Kiri Unity Tutorial

Учебный сайт Kiri Unity Tutorial — интерактивный учебник по Unity для 2D мобильных игр.

## Стек

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- MDX (уроки в `src/content/lessons/`)
- Framer Motion, next-themes, lucide-react

## Запуск

```bash
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000). Учитывай `basePath`: в dev-режиме приложение доступно по корню; после экспорта — по `/unity-dojo`.

## Сборка и деплой

Статический экспорт для GitHub Pages:

```bash
npm run build
```

Результат в папке `out/`. Деплой настроен через GitHub Actions (`.github/workflows/deploy.yml` в корне репозитория unity-dojo): при push в `main` собирается этот проект и артефакт загружается в GitHub Pages.

Сайт будет доступен по адресу: `https://<USER>.github.io/unity-dojo/`

## Структура

- `src/app/` — страницы (главная, уроки, источники, обратная связь)
- `src/content/lessons/ru/` — MDX-уроки (русский)
- `src/components/` — layout, MDX-компоненты
- `src/lib/lessons.ts` — чтение и список уроков

## Дальнейшие шаги

- Интеграция UnityInterface из `React Figma/Unity Game Interface Tutorial`
- Компоненты KiriTip, StepByStep, Quiz, DevicePreview
- Форма обратной связи и аналитика (фаза «Полировка»)
