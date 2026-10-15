@echo off
title Travel & Cab Booking System
echo ========================================================
echo        Starting Travel Booking Server...
echo ========================================================
cd /d "%~dp0"
node server.js
pause
