backend: ts-node app.ts
MAC: rm -rf node_modules
    npm install
    npx ts-node app.ts
    
frontend: npm run dev

npm install react-chartjs-2 chart.js

DOCKER: (in this directory run)
docker compose up -d --build

to close run:
docker compose down