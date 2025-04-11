#!/bin/sh


echo "Running zenstack & prisma setup..."

npx zenstack generate

npx prisma migrate deploy 

npx prisma generate

echo "Starting the app..."

exec npm run dev