#!/bin/bash

# Скрипт ожидает, что он запускается из корня проекта (стандартное поведение IDE)
if [ "$#" -eq 0 ]; then
    echo "Usage: $0 <feature_name1> <feature_name2> ..."
    exit 1
fi

echo "🚀 Запуск фабрики агентов..."

for FEATURE in "$@"; do
  WORKTREE_DIR="$PWD/.worktrees/$FEATURE"
  
  if [ -d "$WORKTREE_DIR" ]; then
    echo "▶ Стартует агент для фичи: $FEATURE"
    tmux new-session -d -s "$FEATURE" -c "$WORKTREE_DIR" "gemini /spec-kitty.implement"
    echo "✅ Агент запущен в tmux-сессии '$FEATURE'."
  else
    echo "⚠️ Ошибка: Working tree для $FEATURE не найден!"
  fi
done