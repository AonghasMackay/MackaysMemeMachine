node scripts/deployCommands.js

if [ ! -f /database/database.sqlite ]; then
    echo "Creating database..."
    node scripts/dbInit.js
fi

node scripts/dbInit.js

node .
exit 0