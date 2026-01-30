#!/bin/bash

# Скрипт для проверки локальной сборки

echo "🔨 Запуск сборки Next.js..."
npm run build

echo ""
echo "=================================="
echo "📁 Структура файлов в out/ после сборки:"
echo "=================================="
ls -la out/ | head -20

echo ""
echo "=================================="
echo "📄 Проверка index.html:"
echo "=================================="
if [ -f "out/index.html" ]; then
  echo "✓ out/index.html существует"
  echo ""
  echo "Первые 10 строк (проверь пути к ассетам):"
  head -10 out/index.html | grep -E "(src=|href=|/unity-dojo/|/_next/)"
else
  echo "✗ out/index.html НЕ найден"
fi

echo ""
echo "=================================="
echo "📁 Проверка директории _next (ассеты):"
echo "=================================="
if [ -d "out/_next" ]; then
  echo "✓ Директория out/_next/ существует"
  echo "Структура:"
  find out/_next -type f | head -5
else
  echo "✗ Директория out/_next/ НЕ найдена"
fi

echo ""
echo "=================================="
echo "🔍 Анализ путей в index.html:"
echo "=================================="
if [ -f "out/index.html" ]; then
  echo "Пути начинающиеся с /unity-dojo/:"
  grep -o '"/unity-dojo/[^"]*"' out/index.html | head -5
  echo ""
  echo "Пути начинающиеся с /_next/:"
  grep -o '"/_next/[^"]*"' out/index.html | head -5
fi

echo ""
echo "=================================="
echo "🌐 Для проверки локально:"
echo "=================================="
echo ""
echo "Вариант 1 (Python):"
echo "  cd out"
echo "  python3 -m http.server 8000"
echo "  Открой: http://localhost:8000/unity-dojo/"
echo ""
echo "Вариант 2 (serve):"
echo "  npx serve out -p 8000"
echo "  Открой: http://localhost:8000/unity-dojo/"
echo ""
echo "⚠️  ВАЖНО: Next.js с basePath экспортирует файлы в out/,"
echo "   но пути в HTML начинаются с /unity-dojo/"
echo "   Поэтому нужно открывать /unity-dojo/, а не корень!"
