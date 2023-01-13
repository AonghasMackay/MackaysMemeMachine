node scripts/deployCommands.js

if [ ! -e ./database/database.sqlite ]; then
    echo "Creating database..."
    node scripts/dbInit.js
fi

node .
exit 0