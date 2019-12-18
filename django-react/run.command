#!/bin/sh
# Script: nw2
# Opens a new Terminal window
osascript  <<EOF
tell app "Terminal"
  do script "cd /Users/wiktor/Documents/GitHub/Familytree-Django-React/django-react
  sh backend.sh"
end tell
EOF
osascript  <<EOF
tell app "Terminal"
  do script "cd /Users/wiktor/Documents/GitHub/Familytree-Django-React/django-react
  sh frontend.sh"
end tell
EOF
